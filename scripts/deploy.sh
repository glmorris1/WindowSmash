#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build

git fetch origin gh-pages 2>/dev/null || true
git worktree remove /tmp/windowsmash-gh-pages --force 2>/dev/null || true
git worktree add -B gh-pages /tmp/windowsmash-gh-pages origin/gh-pages 2>/dev/null || \
  git worktree add -B gh-pages /tmp/windowsmash-gh-pages

rm -rf /tmp/windowsmash-gh-pages/*
cp -r dist/* /tmp/windowsmash-gh-pages/
touch /tmp/windowsmash-gh-pages/.nojekyll

cd /tmp/windowsmash-gh-pages
git add -A
git diff --staged --quiet || git commit -m "Deploy $(date +%Y-%m-%d)"
git push origin gh-pages

echo "Deployed to https://glmorris1.github.io/WindowSmash/"