#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
rm -rf docs
mkdir -p docs
cp -r dist/* docs/
touch docs/.nojekyll

git add docs/
git diff --staged --quiet && echo "No changes to deploy" && exit 0
git commit -m "Deploy $(date +%Y-%m-%d)"
git push origin main

echo "Deployed to https://glmorris1.github.io/WindowSmash/"