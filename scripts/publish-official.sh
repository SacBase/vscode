#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "Usage: npm run publish:official -- [optional message]"
  echo ""
  echo "Behavior:"
  echo "  1) Commit dirty workspace as 'chore: confirm pushed workspace'"
  echo "  2) Push private branch to origin"
  echo "  3) Mirror origin/private_branch to official/official_branch using --force-with-lease"
  echo ""
  echo "Notes:"
  echo "  - No merge is performed, so publish cannot get merge conflicts."
  echo "  - Optional message is accepted for compatibility but not used in mirror mode."
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

if [[ -n "$(git ls-files -u)" ]]; then
  echo "Unresolved merge conflicts detected. Resolve or abort merge before publishing."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "chore: confirm pushed workspace"
fi

git push origin "$private_branch"

git fetch "$official_remote"
git fetch origin "$private_branch"

if ! git show-ref --verify --quiet "refs/remotes/$official_remote/$official_branch"; then
  if git show-ref --verify --quiet "refs/remotes/$official_remote/master"; then
  official_branch="master"
  fi
fi

git push --force-with-lease="$official_branch" "$official_remote" "origin/$private_branch:$official_branch"

restore_branch=false

echo "Mirrored origin/$private_branch -> $official_remote/$official_branch (force-with-lease)."
echo "Message accepted (mirror mode): $message"
