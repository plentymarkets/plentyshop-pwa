#!/usr/bin/env bash
set -euo pipefail

EXTENSIONS_MANIFEST_FILE="${1:-extensions-manifest.json}"

command -v node > /dev/null 2>&1 || {
    echo >&2 "Node.js is required but it's not installed. Aborting."
    exit 1
}

command -v npm > /dev/null 2>&1 || {
    echo >&2 "npm is required but it's not installed. Aborting."
    exit 1
}

if [[ ! -f "$EXTENSIONS_MANIFEST_FILE" ]]; then
    echo "No $EXTENSIONS_MANIFEST_FILE found. Aborting."
    exit 1
fi

echo "Reading $EXTENSIONS_MANIFEST_FILE..."

EXTENSIONS_MANIFEST_FILE="$EXTENSIONS_MANIFEST_FILE" node << 'EOF'
  const fs = require('fs');
  const extensions = JSON.parse(fs.readFileSync(process.env.EXTENSIONS_MANIFEST_FILE, 'utf8'));

  if (!Array.isArray(extensions)) {
    process.stderr.write('Invalid extensions-manifest.json: must be an array.\n');
    process.exit(1);
  }

  const pkgPath = './package.json';
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};

  let added = 0;
  for (const ext of extensions) {
    if (!ext.entry) {
      process.stderr.write('Warning: extension missing "entry" field — skipping.\n');
      continue;
    }
    if (!pkg.dependencies[ext.entry]) {
      pkg.dependencies[ext.entry] = ext.version ?? 'latest';
      process.stdout.write('Added to package.json: ' + ext.entry + '@' + (ext.version ?? 'latest') + '\n');
      added++;
    } else {
      process.stdout.write('Already in package.json: ' + ext.entry + ' — skipping.\n');
    }
  }

  if (added > 0) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    process.stdout.write('package.json updated. Run npm install to sync node_modules.\n');
  }
EOF

echo "Done."
