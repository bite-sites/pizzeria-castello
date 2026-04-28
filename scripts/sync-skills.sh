#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CANONICAL_DIR="$ROOT_DIR/skills"
CLAUDE_DIR="$ROOT_DIR/.claude/skills"
COPILOT_DIR="$ROOT_DIR/.github/skills"

usage() {
  cat <<'EOF'
Usage: scripts/sync-skills.sh [--check]

Syncs canonical skills from ./skills into:
- ./.claude/skills
- ./.github/skills

Options:
  --check   Verify mirrors match canonical files without modifying them.
EOF
}

check_mode=false
if [[ "${1:-}" == "--check" ]]; then
  check_mode=true
elif [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
elif [[ $# -gt 0 ]]; then
  echo "Unknown argument: $1" >&2
  usage >&2
  exit 1
fi

if [[ ! -d "$CANONICAL_DIR" ]]; then
  echo "Canonical skills directory not found: $CANONICAL_DIR" >&2
  exit 1
fi

mkdir -p "$CLAUDE_DIR" "$COPILOT_DIR"

while IFS= read -r -d '' canonical_file; do
  rel_path="${canonical_file#"$CANONICAL_DIR"/}"
  claude_target="$CLAUDE_DIR/$rel_path"
  copilot_target="$COPILOT_DIR/$rel_path"

  if [[ "$check_mode" == true ]]; then
    if [[ ! -f "$claude_target" || ! -f "$copilot_target" ]]; then
      echo "Missing mirror file for $rel_path" >&2
      exit 1
    fi
    cmp -s "$canonical_file" "$claude_target" || {
      echo "Mismatch: $rel_path differs in .claude mirror" >&2
      exit 1
    }
    cmp -s "$canonical_file" "$copilot_target" || {
      echo "Mismatch: $rel_path differs in .github mirror" >&2
      exit 1
    }
  else
    mkdir -p "$(dirname "$claude_target")" "$(dirname "$copilot_target")"
    cp "$canonical_file" "$claude_target"
    cp "$canonical_file" "$copilot_target"
    echo "Synced: $rel_path"
  fi
done < <(find "$CANONICAL_DIR" -type f -name 'SKILL.md' -print0 | sort -z)

if [[ "$check_mode" == true ]]; then
  echo "Skill mirrors match canonical sources."
fi
