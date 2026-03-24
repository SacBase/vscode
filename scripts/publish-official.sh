#!/usr/bin/env bash
set -euo pipefail

message="${1:-chore: curated public sync}"
private_branch="${PRIVATE_BRANCH:-master}"
official_remote="${OFFICIAL_REMOTE:-official}"
official_branch="${OFFICIAL_BRANCH:-main}"
publish_branch="${PUBLISH_BRANCH:-publish/official}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Missing origin remote."
  exit 1
fi

if ! git remote get-url "$official_remote" >/dev/null 2>&1; then
  echo "Missing '$official_remote' remote. Add it first:"
  echo "  git remote add $official_remote https://github.com/SacBase/vscode.git"
  exit 1
fi

current_branch="$(git branch --show-current)"

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "chore: confirm pushed workspace"
fi

git push origin "$private_branch"

git fetch "$official_remote"
git fetch origin "$private_branch"

git checkout -B "$publish_branch" "$official_remote/$official_branch"

git merge --squash "origin/$private_branch"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to publish to $official_remote/$official_branch."
  git checkout "$current_branch"
  exit 0
fi

git commit -m "$message"
git push "$official_remote" "HEAD:$official_branch"

git checkout "$current_branch"

echo "Published squashed changes to $official_remote/$official_branch with message: $message"
