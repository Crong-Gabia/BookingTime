#!/bin/bash

# BookingTime 개발 환경 설정 스크립트
# 실행 가이드에 따라 자동으로 개발 환경을 설정합니다.

set -e  # 오류 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 도구 체크 함수
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1이 설치되지 않았습니다."
        exit 1
    fi
}

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")" || exit 1
log_info "프로젝트 루트 디렉토리로 이동: $(pwd)"

# 필수 도구 체크
log_info "필수 도구 확인 중..."
check_command "docker"
check_command "docker-compose"
check_command "pnpm"
check_command "node"
log_success "모든 필수 도구가 설치되어 있습니다."

# 1. 데이터베이스 시작
log_info "1/5. 데이터베이스 시작 중..."
cd infra/docker || exit 1

if docker-compose ps | grep -q "Up"; then
    log_warning "데이터베이스가 이미 실행 중입니다."
else
    docker-compose up -d
    log_info "데이터베이스가 시작되었습니다. 준비될 때까지 기다리는 중..."
    sleep 15  # 데이터베이스가 준비될 때까지 대기
fi

# 데이터베이스 상태 확인
if docker-compose ps | grep -q "Up"; then
    log_success "데이터베이스가 정상적으로 실행 중입니다."
else
    log_error "데이터베이스 시작에 실패했습니다. 로그를 확인하세요."
    log_info "로그 보기: cd infra/docker && docker-compose logs"
    exit 1
fi

cd ../.. || exit 1

# 2. 의존성 설치
log_info "2/5. 의존성 설치 중..."
if [ ! -d "node_modules" ] || [ ! -d "apps/api/node_modules" ] || [ ! -d "apps/web/node_modules" ]; then
    pnpm install
    log_success "의존성이 설치되었습니다."
else
    log_info "이미 설치된 의존성이 있습니다. 건너뜁니다."
fi

# 3. 환경변수 설정
log_info "3/5. 환경변수 설정 중..."
if [ ! -f "apps/api/.env.local" ]; then
    cp apps/api/.env.example apps/api/.env.local
    log_success "환경변수 파일이 생성되었습니다 (apps/api/.env.local)."
    log_warning "필요한 경우 apps/api/.env.local을 직접 수정하세요."
else
    log_info "환경변수 파일이 이미 존재합니다. 건너뜁니다."
fi

# 4. 데이터베이스 마이그레이션
log_info "4/5. 데이터베이스 마이그레이션 중..."
pnpm --filter api db:migrate:dev
log_success "데이터베이스 마이그레이션이 완료되었습니다."

# 5. Prisma Client 생성
log_info "5/5. Prisma Client 생성 중..."
pnpm --filter api prisma generate
log_success "Prisma Client가 생성되었습니다."

# 완료
echo ""
log_success "=========================================="
log_success "개발 환경 설정이 완료되었습니다!"
log_success "=========================================="
echo ""
log_info "다음 명령어로 개발 서버를 시작하세요:"
echo "  pnpm run dev       # API + Web"
echo "  pnpm --filter api dev    # API만"
echo "  pnpm --filter web dev    # Web만"
echo ""
log_info "유용한 명령어:"
echo "  cd infra/docker && docker-compose logs  # 데이터베이스 로그"
echo "  pnpm --filter api prisma studio        # DB GUI"
echo "  pnpm test                              # 테스트 실행"
echo ""
