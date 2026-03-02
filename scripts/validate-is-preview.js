#!/usr/bin/env node

// Simple CI guard to ensure Nuxt Nitro output never ships with isPreview=true
// Path is relative to repo root

const fs = require('fs');
const path = require('path');

const nitroPath = path.resolve(__dirname, '../apps/web/.output/server/chunks/nitro/nitro.mjs');

if (!fs.existsSync(nitroPath)) {
  console.error('[isPreview check] Nitro output not found at', nitroPath);
  process.exit(1);
}

const content = fs.readFileSync(nitroPath, 'utf8');

if (/"isPreview"\s*:\s*true/.test(content)) {
  // Hard-reset any isPreview=true to false in the built Nitro bundle
  const fixed = content.replace(/"isPreview"\s*:\s*true/g, '"isPreview": false');
  fs.writeFileSync(nitroPath, fixed, 'utf8');

  console.error('\n[isPreview check] Build contained "isPreview": true in Nitro output.');
  console.error('[isPreview check] It has been rewritten to "isPreview": false to protect the shop.');
  console.error('Please ensure nuxt.config / environment do not enable preview mode before building.');

  // Still fail CI so the misconfiguration gets fixed at the source
  process.exit(1);
}

console.log('[isPreview check] OK: no "isPreview": true found in Nitro output.');
