#!/bin/bash

# BookingTime 개발 환경 중지 스크립트
# Docker 컨테이너와 관련 서비스를 중지합니다.

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

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.." || exit 1
log_info "프로젝트 루트 디렉토리로 이동: $(pwd)"

# Docker 컨테이너 중지
cd infra/docker || exit 1
log_info "Docker 컨테이너 중지 중..."

if docker-compose ps | grep -q "Up"; then
    docker-compose down
    log_success "Docker 컨테이너가 중지되었습니다."
else
    log_warning "실행 중인 Docker 컨테이너가 없습니다."
fi

cd ../.. || exit 1

log_success "개발 환경이 중지되었습니다."
log_info "다시 시작하려면: ./scripts/setup-dev-env.sh"
