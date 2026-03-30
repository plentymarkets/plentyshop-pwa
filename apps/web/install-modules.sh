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

mapfile -t PACKAGES < <(
  MANIFEST_FILE="$MANIFEST_FILE" node << 'EOF'
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync(process.env.MANIFEST_FILE, 'utf8'));
    if (!manifest.modules || !Array.isArray(manifest.modules)) {
      console.error('Invalid manifest: "modules" must be an array');
      process.exit(1);
    }
    for (const mod of manifest.modules) {
      if (!mod.package) {
        console.error('Invalid manifest: each module must have a "package" field');
        process.exit(1);
      }
      console.log(mod.version ? `${mod.package}@${mod.version}` : mod.package);
    }
EOF
)

if [[ ${#PACKAGES[@]} -eq 0 ]]; then
    echo "No packages found in manifest. Aborting."
    exit 1
fi

echo "Checking for conflicts in nuxt.config.ts..."

MANIFEST_FILE="$MANIFEST_FILE" NUXT_CONFIG="$NUXT_CONFIG" node << 'EOF'
  const fs = require('fs');
  const manifest = JSON.parse(fs.readFileSync(process.env.MANIFEST_FILE, 'utf8'));
  const config = fs.readFileSync(process.env.NUXT_CONFIG, 'utf8');

  const conflicts = manifest.modules
    .filter(m => m.nuxtModule)
    .map(m => m.nuxtModule)
    .filter(m => config.includes("'" + m + "'"));

  if (conflicts.length > 0) {
    console.error('Error: the following modules are already registered in nuxt.config.ts:');
    conflicts.forEach(m => console.error('  - ' + m));
    console.error('Remove them from nuxt.config.ts before running this script.');
    process.exit(1);
  }

  console.log('No conflicts found.');
EOF

echo "Installing packages:"
printf ' - %s\n' "${PACKAGES[@]}"

npm install "${PACKAGES[@]}"

echo "Updating nuxt.config.ts..."

MANIFEST_FILE="$MANIFEST_FILE" NUXT_CONFIG="$NUXT_CONFIG" node << 'EOF'
  const fs = require('fs');
  const manifest = JSON.parse(fs.readFileSync(process.env.MANIFEST_FILE, 'utf8'));
  const configPath = process.env.NUXT_CONFIG;
  let config = fs.readFileSync(configPath, 'utf8');

  const nuxtModules = manifest.modules
    .filter(m => m.nuxtModule)
    .map(m => m.nuxtModule);

  const toInsert = nuxtModules
    .filter(m => !config.includes("'" + m + "'"))
    .map(m => "    '" + m + "',")
    .join('\n');

  if (toInsert) {
    config = config.replace('modules: [', 'modules: [\n' + toInsert);
    fs.writeFileSync(configPath, config);
    console.log('Added to nuxt.config.ts modules: ' + nuxtModules.join(', '));
  } else {
    console.log('All modules already present in nuxt.config.ts — skipping.');
  }
EOF

echo "Done."






