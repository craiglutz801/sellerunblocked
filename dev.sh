#!/usr/bin/env bash
# SellerUnblocked — start Next.js dev server (works when Node isn’t on your global PATH).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# Prefer project-local Node (Cursor/agent bootstrap), then system Node
LOCAL_NODE="$ROOT/.local/node-v20.19.0-darwin-x64/bin"
if [ -x "$LOCAL_NODE/node" ]; then
  export PATH="$LOCAL_NODE:$PATH"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found."
  echo "Install LTS from https://nodejs.org/ or: brew install node"
  exit 1
fi

echo "Using: $(command -v node) — $(node -v)"
export WATCHPACK_POLLING=true
npm install
# Prevent stale webpack chunks (missing ./NNN.js, __webpack_modules__ errors) after edits or crashes
rm -rf .next
echo "Cleared .next cache for a clean dev server."
exec npm run dev
