#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "Usage: npm run publish:official -- [optional commit message]"
  echo "Tip: wrap message in single quotes if it contains special shell chars (e.g. &, backticks)."
  echo ""
  echo "Behavior:"
  echo "  1) Commit dirty workspace as 'chore: confirm pushed workspace'"
  echo "  2) Push private branch to origin"
  echo "  3) Publish one squashed commit to official remote"
  exit 0
fi

default_message="chore: curated public sync"
message="$default_message"
if [[ "$#" -gt 0 ]]; then
  message="$*"
fi
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
restore_branch=true
cleanup() {
  if [[ "$restore_branch" == "true" && -n "$current_branch" ]]; then
    git checkout "$current_branch" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "chore: confirm pushed workspace"
fi

git push origin "$private_branch"

git fetch "$official_remote"
git fetch origin "$private_branch"

base_ref=""
if git show-ref --verify --quiet "refs/remotes/$official_remote/$official_branch"; then
  base_ref="$official_remote/$official_branch"
elif git show-ref --verify --quiet "refs/remotes/$official_remote/master"; then
  official_branch="master"
  base_ref="$official_remote/master"
fi

if [[ -n "$base_ref" ]]; then
  git checkout -B "$publish_branch" "$base_ref"
  git merge --squash --allow-unrelated-histories "origin/$private_branch"

  if [[ -z "$(git status --porcelain)" ]]; then
    echo "No changes to publish to $official_remote/$official_branch."
    if [[ -n "$current_branch" ]]; then
      git checkout "$current_branch"
    fi
    restore_branch=false
    exit 0
  fi
else
  echo "No existing branch found on $official_remote. Creating first squashed publish commit."
  git checkout --orphan "$publish_branch"
  git rm -rf . >/dev/null 2>&1 || true
  git checkout "origin/$private_branch" -- .
fi

git commit -m "$message"
git push "$official_remote" "HEAD:$official_branch"

if [[ -n "$current_branch" ]]; then
  git checkout "$current_branch"
fi
restore_branch=false

echo "Published squashed changes to $official_remote/$official_branch with message: $message"
