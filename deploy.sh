#!/bin/bash

# 현재 스크립트가 위치한 디렉토리로 이동
cd "$(dirname "$0")"

echo "🛠️  빌드 시작..."
npm run build

echo "🚚 파일 서버로 전송 중..."
scp -r dist/* ubuntu@14.63.178.147:/home/ubuntu/

echo "🔐 서버 접속 후 파일 복사 및 Nginx 재시작..."
ssh ubuntu@14.63.178.147 << EOF
  sudo rm -rf /var/www/html/*
  sudo cp -r /home/ubuntu/dist/* /var/www/html/
  sudo systemctl restart nginx
  echo "✅ 서버에 배포 완료!"
EOF


