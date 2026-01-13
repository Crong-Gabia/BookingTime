#!/bin/bash

# BookingTime 데이터베이스 리셋 스크립트
# 데이터베이스를 완전히 삭제하고 다시 생성합니다.
# 모든 데이터가 손실됩니다.

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.." || exit 1
log_info "프로젝트 루트 디렉토리로 이동: $(pwd)"

# 경고 메시지
log_error "경고: 이 작업은 데이터베이스의 모든 데이터를 삭제합니다!"
log_warning "계속하려면 'yes'를 입력하고 엔터를 누르세요:"
read -r response

if [ "$response" != "yes" ]; then
    log_info "작업이 취소되었습니다."
    exit 0
fi

# Docker 컨테이너 및 볼륨 삭제
cd infra/docker || exit 1
log_info "Docker 컨테이너 및 볼륨 삭제 중..."

docker-compose down -v

log_success "Docker 컨테이너 및 볼륨이 삭제되었습니다."

# 데이터베이스 다시 시작
log_info "데이터베이스 다시 시작 중..."
docker-compose up -d

sleep 15

# 마이그레이션 실행
cd ../.. || exit 1
log_info "데이터베이스 마이그레이션 중..."
pnpm --filter api db:migrate:dev

log_success "데이터베이스가 리셋되었습니다."
