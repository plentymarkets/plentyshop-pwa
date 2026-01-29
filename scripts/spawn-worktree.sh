#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/spawn-worktree.sh <branch> [<branch> ...] [--base <base-ref> | --head] [--worktree-jobs [<n>]]

Example:
  scripts/spawn-worktree.sh feat/awesome-feature
  scripts/spawn-worktree.sh feat/one feat/two feat/three
  scripts/spawn-worktree.sh feat/awesome-feature --base release/1.15
  scripts/spawn-worktree.sh feat/awesome-feature --head
  scripts/spawn-worktree.sh feat/one feat/two --worktree-jobs 4
  scripts/spawn-worktree.sh feat/one feat/two feat/three --worktree-jobs

This will create a git worktree under ../pwa-worktree/<branch-with-slashes-replaced>.
EOF
}

branches=()
base_ref_override=""
use_origin_head=false
worktree_jobs=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base)
      base_ref_override="${2:-}"
      if [[ -z "$base_ref_override" ]]; then
        echo "Error: --base requires a value." >&2
        exit 1
      fi
      shift 2
      ;;
    --head)
      use_origin_head=true
      shift
      ;;
    --worktree-jobs)
      worktree_jobs="auto"
      shift
      if [[ ${1:-} =~ ^[0-9]+$ ]]; then
        worktree_jobs="$1"
        if [[ "$worktree_jobs" -lt 1 ]]; then
          echo "Error: --worktree-jobs must be a positive integer." >&2
          exit 1
        fi
        shift
      fi
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      branches+=("$@")
      break
      ;;
    *)
      branches+=("$1")
      shift
      ;;
  esac
done

if [[ -n "$base_ref_override" ]] && [[ "$use_origin_head" == true ]]; then
  echo "Error: use either --base or --head, not both." >&2
  exit 1
fi

if [[ ${#branches[@]} -eq 0 ]]; then
  usage
  exit 1
fi

if [[ "$worktree_jobs" == "auto" ]]; then
  worktree_jobs="${#branches[@]}"
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"
if [[ -z "$repo_root" ]]; then
  echo "Error: not inside a git repository." >&2
  exit 1
fi

cd "$repo_root"

base_dir="$repo_root/../pwa-worktree"
mkdir -p "$base_dir"

git fetch --prune --quiet origin || true

prefetch_remote_branches() {
  local target_branch
  for target_branch in "${branches[@]}"; do
    if git show-ref --verify --quiet "refs/heads/$target_branch"; then
      continue
    fi

    if git show-ref --verify --quiet "refs/remotes/origin/$target_branch"; then
      continue
    fi

    # Handle non-standard fetch refspecs: if the branch exists on origin but
    # isn't present locally, fetch it explicitly before starting parallel work.
    if git ls-remote --exit-code --heads origin "$target_branch" >/dev/null 2>&1; then
      git fetch --quiet origin "$target_branch":"refs/remotes/origin/$target_branch" || true
    fi
  done
}

prefetch_remote_branches

ensure_branch_ref() {
  local target_branch="$1"

  if git show-ref --verify --quiet "refs/heads/$target_branch"; then
    return 0
  fi

  if git show-ref --verify --quiet "refs/remotes/origin/$target_branch"; then
    return 0
  fi

  return 1
}

worktree_exists() {
  local target_path="$1"
  git worktree list --porcelain | grep -Fqx "worktree $target_path"
}

git_worktree_add_with_retry() {
  local max_attempts=8
  local attempt=1

  while true; do
    local output
    if output="$(git "$@" 2>&1)"; then
      return 0
    fi

    local status=$?
    if echo "$output" | grep -Eqi 'index\.lock|worktree.*lock|another git process|could not lock|unable to create.*lock'; then
      if [[ "$attempt" -ge "$max_attempts" ]]; then
        echo "$output" >&2
        return "$status"
      fi

      attempt=$((attempt + 1))
      sleep 0.2
      continue
    fi

    echo "$output" >&2
    return "$status"
  done
}

create_worktree() {
  local target_branch="$1"
  local target_path="$2"

  if worktree_exists "$target_path"; then
    return 0
  fi

  if [[ -d "$target_path" ]]; then
    echo "[$target_branch] Error: $target_path exists but is not a registered worktree." >&2
    echo "[$target_branch] Hint: remove it or run: git worktree prune" >&2
    return 1
  fi

  if ensure_branch_ref "$target_branch"; then
    if git show-ref --verify --quiet "refs/heads/$target_branch"; then
      git_worktree_add_with_retry worktree add "$target_path" "$target_branch"
    else
      git_worktree_add_with_retry worktree add -b "$target_branch" "$target_path" "origin/$target_branch"
    fi
  else
    git_worktree_add_with_retry worktree add -b "$target_branch" "$target_path" "$base_ref"
  fi
}

load_nvm() {
  if command -v nvm >/dev/null 2>&1; then
    return 0
  fi

  if [[ -n "${NVM_DIR:-}" ]] && [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
    return 0
  fi

  if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    . "$HOME/.nvm/nvm.sh"
    return 0
  fi

  return 1
}

bootstrap_worktree() {
  local target_branch="$1"
  local target_path="$2"

  cd "$target_path"

  if ! load_nvm; then
    echo "[$target_branch] Error: nvm not found in this shell (expected 'nvm' or \$NVM_DIR/nvm.sh)." >&2
    return 1
  fi

  if ! nvm use; then
    nvm install
    nvm use
  fi

  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi

  npm run lint
  npm run test
}

default_base_ref() {
  local origin_head
  origin_head="$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null || true)"
  if [[ -n "$origin_head" ]]; then
    printf '%s' "${origin_head#origin/}"
  else
    printf '%s' "main"
  fi
}

current_branch_ref() {
  git symbolic-ref --quiet --short HEAD 2>/dev/null || true
}

normalize_base_ref() {
  local base="$1"
  if [[ "$base" == refs/* ]] || [[ "$base" == origin/* ]]; then
    printf '%s' "$base"
    return 0
  fi

  if git show-ref --verify --quiet "refs/heads/$base"; then
    printf '%s' "$base"
    return 0
  fi

  if git show-ref --verify --quiet "refs/remotes/origin/$base"; then
    printf '%s' "origin/$base"
    return 0
  fi

  printf '%s' "$base"
}

if [[ -n "$base_ref_override" ]]; then
  base_ref="$base_ref_override"
elif [[ "$use_origin_head" == true ]]; then
  base_ref="$(default_base_ref)"
else
  base_ref="$(current_branch_ref)"
  if [[ -z "$base_ref" ]]; then
    base_ref="$(default_base_ref)"
  fi
fi
base_ref="$(normalize_base_ref "$base_ref")"

pids=()
pid_indices=()

worktree_paths=()
for branch in "${branches[@]}"; do
  worktree_name="${branch//\//-}"
  worktree_paths+=("$base_dir/$worktree_name")
done

create_pids=()
create_pid_indices=()
create_failures=0

reap_finished_creates() {
  local next_pids=()
  local next_indices=()

  for i in "${!create_pids[@]}"; do
    local pid="${create_pids[$i]}"
    local idx="${create_pid_indices[$i]}"
    local b="${branches[$idx]}"

    if kill -0 "$pid" 2>/dev/null; then
      next_pids+=("$pid")
      next_indices+=("$idx")
      continue
    fi

    if ! wait "$pid"; then
      echo "[$b] Failed to create worktree." >&2
      create_failures=$((create_failures + 1))
    fi
  done

  create_pids=()
  create_pid_indices=()

  # Bash 3.2 + `set -u` treats `${empty_array[@]}` as "unbound".
  if [[ ${#next_pids[@]} -gt 0 ]]; then
    create_pids=("${next_pids[@]}")
    create_pid_indices=("${next_indices[@]}")
  fi
}

wait_for_create_slot() {
  while [[ "${#create_pids[@]}" -ge "$worktree_jobs" ]]; do
    reap_finished_creates
    if [[ "${#create_pids[@]}" -ge "$worktree_jobs" ]]; then
      sleep 0.1
    fi
  done
}

for i in "${!branches[@]}"; do
  branch="${branches[$i]}"
  worktree_path="${worktree_paths[$i]}"

  wait_for_create_slot
  (
    create_worktree "$branch" "$worktree_path"
  ) &
  create_pids+=("$!")
  create_pid_indices+=("$i")
done

while [[ ${#create_pids[@]} -gt 0 ]]; do
  reap_finished_creates
  if [[ ${#create_pids[@]} -gt 0 ]]; then
    sleep 0.1
  fi
done

if [[ "$create_failures" -ne 0 ]]; then
  echo "Error: $create_failures worktree(s) failed to create." >&2
  exit 1
fi

for i in "${!branches[@]}"; do
  branch="${branches[$i]}"
  worktree_path="${worktree_paths[$i]}"

  (
    bootstrap_worktree "$branch" "$worktree_path"
  ) &
  pids+=("$!")
  pid_indices+=("$i")
done

failures=0
for j in "${!pids[@]}"; do
  pid="${pids[$j]}"
  idx="${pid_indices[$j]}"
  b="${branches[$idx]}"
  if ! wait "$pid"; then
    echo "[$b] Failed" >&2
    failures=$((failures + 1))
  fi
done

if [[ "$failures" -ne 0 ]]; then
  echo "Error: $failures worktree(s) failed to bootstrap." >&2
  exit 1
fi
