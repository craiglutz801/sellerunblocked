#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/SellerUnblocked

echo "==> Node"
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null || true)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get remove -y libnode-dev 2>/dev/null || true
  sudo apt-get install -y nodejs
fi
node -v
npm -v

echo "==> Nginx"
sudo apt-get update -qq
sudo apt-get install -y nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp /home/ubuntu/SellerUnblocked/deploy/nginx-sellerunblocked.conf /etc/nginx/sites-available/sellerunblocked
sudo ln -sf /etc/nginx/sites-available/sellerunblocked /etc/nginx/sites-enabled/sellerunblocked
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "==> Build SellerUnblocked"
npm ci
npm run build

echo "==> systemd: sellerunblocked"
sudo cp /home/ubuntu/SellerUnblocked/deploy/sellerunblocked.service /etc/systemd/system/sellerunblocked.service
sudo systemctl daemon-reload
sudo systemctl enable sellerunblocked
sudo systemctl restart sellerunblocked

sleep 2
sudo systemctl --no-pager status sellerunblocked || true
curl -sS -o /dev/null -w "localhost:3001 -> HTTP %{http_code}\n" http://127.0.0.1:3001/ || true
curl -sS -o /dev/null -w "nginx:80 -> HTTP %{http_code}\n" http://127.0.0.1/ || true

echo "Done. Open http://$(curl -fsS http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo YOUR_PUBLIC_IP)/ and /app"
