#!/bin/bash

# 스크립트에 실행 권한 부여
chmod +x "$0"

echo "프론트엔드 Docker 컨테이너 중지 및 삭제..."
docker compose down

echo "프론트엔드 Docker 이미지 빌드..."
docker compose build

echo "불필요한 이미지 정리..."
docker image prune -f

echo "프론트엔드 Docker 컨테이너 시작..."
docker compose up -d

echo "컨테이너 상태 확인..."
docker ps -a

echo "프론트엔드 배포 완료!"