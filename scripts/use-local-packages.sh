#!/usr/bin/env bash
# =============================================================================
# use-local-packages.sh
#
# Links local builds of @plentymarkets/shop-api (SDK) and
# @plentymarkets/shop-core into this PWA repository.
#
# Workflow
# --------
#   1. Build the local SDK repository.
#   2. Point shop-core's package.json at the freshly built SDK tarball.
#   3. Build the local shop-core repository.
#   4. Point this PWA's root package.json at both tarballs.
#   5. Run npm install in the PWA root.
#
# Usage
# -----
#   ./scripts/use-local-packages.sh \
#     --sdk-path  /path/to/shop-api \
#     --core-path /path/to/shop-core
#
#   Both flags are required on first run.
#   The paths are saved to scripts/.local-packages-config so you can
#   re-run without flags afterwards:
#
#   ./scripts/use-local-packages.sh
#
# Options
# -------
#   --sdk-path   <dir>   Absolute path to the local shop-api (SDK) repo.
#   --core-path  <dir>   Absolute path to the local shop-core repo.
#   --skip-sdk           Skip rebuilding the SDK (use last packed tarball).
#   --skip-core          Skip rebuilding shop-core (use last packed tarball).
#   -h | --help          Show this help text.
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

PWA_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="${PWA_ROOT}/scripts/.local-packages-config"

log()  { echo "▶  $*"; }
ok()   { echo "✔  $*"; }
err()  { echo "✖  $*" >&2; exit 1; }

usage() {
  sed -n '/^# Usage/,/^# =\{3\}/p' "${BASH_SOURCE[0]}" | grep -v '^# ===\|^# ---' | sed 's/^# \{0,3\}//'
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

SDK_PATH=""
CORE_PATH=""
SKIP_SDK=false
SKIP_CORE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sdk-path)
      SDK_PATH="${2:-}"
      [[ -z "$SDK_PATH" ]] && err "--sdk-path requires a value."
      shift 2
      ;;
    --core-path)
      CORE_PATH="${2:-}"
      [[ -z "$CORE_PATH" ]] && err "--core-path requires a value."
      shift 2
      ;;
    --skip-sdk)
      SKIP_SDK=true
      shift
      ;;
    --skip-core)
      SKIP_CORE=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      err "Unknown option: $1"
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Load / save config
# ---------------------------------------------------------------------------

if [[ -f "$CONFIG_FILE" ]]; then
  # shellcheck source=/dev/null
  source "$CONFIG_FILE"
fi

[[ -n "${SDK_PATH_CFG:-}"  && -z "$SDK_PATH"  ]] && SDK_PATH="$SDK_PATH_CFG"
[[ -n "${CORE_PATH_CFG:-}" && -z "$CORE_PATH" ]] && CORE_PATH="$CORE_PATH_CFG"

[[ -z "$SDK_PATH"  ]] && err "No SDK path provided. Pass --sdk-path or run once with it to cache the path."
[[ -z "$CORE_PATH" ]] && err "No shop-core path provided. Pass --core-path or run once with it to cache the path."

SDK_PATH="$(cd "$SDK_PATH" && pwd)"
CORE_PATH="$(cd "$CORE_PATH" && pwd)"

cat > "$CONFIG_FILE" <<CFG
SDK_PATH_CFG="${SDK_PATH}"
CORE_PATH_CFG="${CORE_PATH}"
CFG

ok "Using SDK path:       $SDK_PATH"
ok "Using shop-core path: $CORE_PATH"

# ---------------------------------------------------------------------------
# nvm bootstrap (mirrors the pattern used in spawn-worktree.sh)
# ---------------------------------------------------------------------------

load_nvm() {
  local nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "${nvm_dir}/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    source "${nvm_dir}/nvm.sh"
  else
    return 0  # nvm not present – rely on system node
  fi
}

ensure_node() {
  local dir="$1"
  load_nvm
  if command -v nvm &>/dev/null; then
    if [[ -f "${dir}/.nvmrc" ]]; then
      log "Switching Node.js version for $(basename "$dir") …"
      (cd "$dir" && nvm use 2>/dev/null || nvm install)
    fi
  fi
}

# ---------------------------------------------------------------------------
# Step 1 – Build the SDK
# ---------------------------------------------------------------------------

log "=== Step 1: SDK ==="

ensure_node "$SDK_PATH"

SDK_TARBALL=""

if $SKIP_SDK; then
  log "Skipping SDK build (--skip-sdk)."
  SDK_TARBALL="$(ls "${SDK_PATH}"/*.tgz 2>/dev/null | sort -V | tail -1)"
  [[ -z "$SDK_TARBALL" ]] && err "No existing SDK tarball found in ${SDK_PATH}. Remove --skip-sdk to rebuild."
  ok "Using existing tarball: $SDK_TARBALL"
else
  log "Installing SDK dependencies …"
  (cd "$SDK_PATH" && npm install)

  log "Building SDK …"
  (cd "$SDK_PATH" && npm run build)

  log "Packing SDK …"
  # Remove old tarballs so we always pick the freshest one.
  rm -f "${SDK_PATH}"/*.tgz
  SDK_TARBALL="$(cd "$SDK_PATH" && npm pack --pack-destination . | tail -1)"
  SDK_TARBALL="${SDK_PATH}/${SDK_TARBALL}"
  ok "SDK packed → $SDK_TARBALL"
fi

# ---------------------------------------------------------------------------
# Step 2 – Wire SDK tarball into shop-core's package.json
# ---------------------------------------------------------------------------

log "=== Step 2: Patching shop-core package.json with local SDK ==="

SDK_PKG_NAME="@plentymarkets/shop-api"
SDK_FILE_REF="file:${SDK_TARBALL}"

# Use node to do a safe in-place JSON edit (avoids jq dependency)
node - "$CORE_PATH/package.json" "$SDK_PKG_NAME" "$SDK_FILE_REF" <<'NODE_SCRIPT'
const fs   = require('fs');
const [,, file, pkgName, fileRef] = process.argv;
const pkg  = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (pkg[section]?.[pkgName] !== undefined) {
    pkg[section][pkgName] = fileRef;
    console.log(`  patched ${section}.${pkgName} → ${fileRef}`);
  }
}
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
NODE_SCRIPT

ok "shop-core/package.json updated."

# ---------------------------------------------------------------------------
# Step 3 – Build shop-core
# ---------------------------------------------------------------------------

log "=== Step 3: shop-core ==="

ensure_node "$CORE_PATH"

CORE_TARBALL=""

if $SKIP_CORE; then
  log "Skipping shop-core build (--skip-core)."
  CORE_TARBALL="$(ls "${CORE_PATH}"/*.tgz 2>/dev/null | sort -V | tail -1)"
  [[ -z "$CORE_TARBALL" ]] && err "No existing shop-core tarball found in ${CORE_PATH}. Remove --skip-core to rebuild."
  ok "Using existing tarball: $CORE_TARBALL"
else
  log "Installing shop-core dependencies …"
  (cd "$CORE_PATH" && npm install)

  log "Building shop-core …"
  (cd "$CORE_PATH" && npm run build)

  log "Packing shop-core …"
  rm -f "${CORE_PATH}"/*.tgz
  CORE_TARBALL="$(cd "$CORE_PATH" && npm pack --pack-destination . | tail -1)"
  CORE_TARBALL="${CORE_PATH}/${CORE_TARBALL}"
  ok "shop-core packed → $CORE_TARBALL"
fi

# ---------------------------------------------------------------------------
# Step 4 – Wire both tarballs into the PWA root package.json
# ---------------------------------------------------------------------------

log "=== Step 4: Patching PWA root package.json ==="

CORE_PKG_NAME="@plentymarkets/shop-core"
CORE_FILE_REF="file:${CORE_TARBALL}"

node - "${PWA_ROOT}/package.json" \
      "$SDK_PKG_NAME"  "$SDK_FILE_REF"  \
      "$CORE_PKG_NAME" "$CORE_FILE_REF" <<'NODE_SCRIPT'
const fs   = require('fs');
const [,, file, sdkName, sdkRef, coreName, coreRef] = process.argv;
const pkg  = JSON.parse(fs.readFileSync(file, 'utf8'));
const patches = { [sdkName]: sdkRef, [coreName]: coreRef };
for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
  for (const [name, ref] of Object.entries(patches)) {
    if (pkg[section]?.[name] !== undefined) {
      pkg[section][name] = ref;
      console.log(`  patched ${section}.${name} → ${ref}`);
    }
  }
}
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
NODE_SCRIPT

ok "PWA root package.json updated."

# ---------------------------------------------------------------------------
# Step 5 – npm install in the PWA
# ---------------------------------------------------------------------------

log "=== Step 5: npm install in PWA ==="

ensure_node "$PWA_ROOT"
(cd "$PWA_ROOT" && npm install)

ok "Done! Local SDK and shop-core are now wired into the PWA."
echo ""
echo "  SDK tarball:       $SDK_TARBALL"
echo "  shop-core tarball: $CORE_TARBALL"
echo ""
echo "To restore the original published versions, run:"
echo "  git checkout -- package.json"
echo "  npm install"

