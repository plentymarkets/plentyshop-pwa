#!/usr/bin/env bash
set -euo pipefail

MANIFEST_FILE="${1:-module-manifest.json}"
NUXT_CONFIG="$(dirname "$0")/nuxt.config.ts"

command -v node > /dev/null 2>&1 || {
    echo >&2 "Node.js is required but it's not installed. Aborting."
    exit 1
}

command -v npm > /dev/null 2>&1 || {
    echo >&2 "npm is required but it's not installed. Aborting."
    exit 1
}

if [[ ! -f "$MANIFEST_FILE" ]]; then
    echo "Manifest file '$MANIFEST_FILE' not found. Aborting."
    exit 1
fi

if [[ ! -f "$NUXT_CONFIG" ]]; then
    echo "nuxt.config.ts not found at '$NUXT_CONFIG'. Aborting."
    exit 1
fi

echo "Reading manifest file: $MANIFEST_FILE"

echo "Checking for conflicts in nuxt.config.ts..."

mapfile -t PACKAGES_TO_INSTALL < <(
  MANIFEST_FILE="$MANIFEST_FILE" NUXT_CONFIG="$NUXT_CONFIG" node << 'EOF'
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync(process.env.MANIFEST_FILE, 'utf8'));
    const config = fs.readFileSync(process.env.NUXT_CONFIG, 'utf8');

    const conflicts = [];
    const toInstall = [];

    for (const m of manifest.modules) {
      if (m.nuxtModule && config.includes("'" + m.nuxtModule + "'")) {
        conflicts.push(m.nuxtModule);
      } else {
        toInstall.push(m.version ? `${m.package}@${m.version}` : m.package);
      }
    }

    if (conflicts.length > 0) {
      conflicts.forEach(m => process.stderr.write('Warning: "' + m + '" is already registered in nuxt.config.ts — skipping.\n'));
    }

    toInstall.forEach(p => process.stdout.write(p + '\n'));
EOF
)

if [[ ${#PACKAGES_TO_INSTALL[@]} -eq 0 ]]; then
    echo "All modules from manifest are already registered in nuxt.config.ts. Nothing to do."
    exit 0
fi

echo "Installing packages:"
printf ' - %s\n' "${PACKAGES_TO_INSTALL[@]}"

npm install "${PACKAGES_TO_INSTALL[@]}"

echo "Updating nuxt.config.ts..."

MANIFEST_FILE="$MANIFEST_FILE" NUXT_CONFIG="$NUXT_CONFIG" node << 'EOF'
  const fs = require('fs');
  const manifest = JSON.parse(fs.readFileSync(process.env.MANIFEST_FILE, 'utf8'));
  const configPath = process.env.NUXT_CONFIG;
  let config = fs.readFileSync(configPath, 'utf8');

  const toInsert = manifest.modules
    .filter(m => m.nuxtModule && !config.includes("'" + m.nuxtModule + "'"))
    .map(m => "    '" + m.nuxtModule + "',")
    .join('\n');

  if (toInsert) {
    config = config.replace('modules: [', 'modules: [\n' + toInsert);
    fs.writeFileSync(configPath, config);
    console.log('nuxt.config.ts updated successfully.');
  } else {
    console.log('nuxt.config.ts already up to date — skipping.');
  }
EOF

echo "Done."






