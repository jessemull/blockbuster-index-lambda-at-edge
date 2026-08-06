#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> lint"
npm run lint

echo "==> test"
npm test

echo "==> format:check"
npm run format:check

echo "==> build"
npm run build

echo "==> audit"
npm audit

echo "==> preflight OK"
