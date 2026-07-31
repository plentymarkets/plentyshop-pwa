#!/usr/bin/env node
/**
 * Z-index token migration codemod
 *
 * Replaces raw z-index Tailwind classes (e.g. z-[200], z-50) with the semantic
 * tokens defined in apps/web/app/configuration/tailwind.config.ts.
 *
 * Usage:
 *   node scripts/zindex-codemod/migrate.mjs [--dry-run]
 *
 * Flags:
 *   --dry-run   Print changed files without writing them.
 *
 * After running, review the git diff.  Several cases are intentionally left for
 * manual follow-up (see MANUAL_FIXES at the bottom of this file).
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = new URL('../../', import.meta.url);
const SEARCH_DIRS = [
  fileURLToPath(new URL('apps/web/app', ROOT)),
  fileURLToPath(new URL('apps/web/modules/paypal', ROOT)),
];

// ─── Replacement table ───────────────────────────────────────────────────────
// ORDER MATTERS: longer/more-specific patterns must come before shorter ones
// to prevent partial matches (e.g. z-[999] before z-[99] before z-[9]).
//
// Each entry is [searchRegex, replacement].
// Word-boundary (\b) is used for bare Tailwind numerics; bracket variants are
// exact-token patterns so boundaries are not needed.
// ─────────────────────────────────────────────────────────────────────────────
const REPLACEMENTS = [
  // ── Special attribute: modal overlay-classes ──────────────────────────────
  // These props contain ONLY a z-class, so an exact attribute value replacement
  // is safe and avoids interfering with the next generic pass.
  [/overlay-classes="z-\[1000\]"/g, 'overlay-classes="z-modal-backdrop"'],
  [/overlay-classes="z-\[200\]"/g,  'overlay-classes="z-modal-backdrop"'],

  // ── Arbitrary values: largest first ──────────────────────────────────────
  [/\bz-\[99999\]/g,  'z-max'],
  [/\bz-\[9999\]/g,   'z-max'],
  [/\bz-\[1000\]/g,   'z-drawer'],        // remaining after overlay-classes pass
  [/\bz-\[999\]/g,    'z-loader'],
  [/\bz-\[700\]/g,    'z-popover'],        // PageSelect multiselect dropdown
  [/\bz-\[600\]/g,    'z-toast'],          // RichTextEditorLinkModal (high editor modal)
  [/\bz-\[500\]/g,    'z-toast'],
  [/\bz-\[300\]/g,    'z-popover'],        // RichText sub-menus
  [/\bz-\[202\]/g,    'z-popover'],        // AddBlockPopoverArrow
  [/\bz-\[201\]/g,    'z-modal'],          // PageBlock popover target override
  [/\bz-\[200\]/g,    'z-modal-backdrop'], // backdrop overlays / PageBlock selected outline
  [/\bz-\[150\]/g,    'z-editor-toolbar'], // SettingsToolbar @lg (manual: @md also needs fixing)
  [/\bz-\[100\]/g,    'z-editor-toolbar'], // CategorySidebar mobile
  [/\bz-\[60\]/g,     'z-editor-toolbar'],  // EditorLocalizationDrawer
  [/\bz-\[51\]/g,     'z-notifications'],  // Notifications strip
  [/\bz-\[50\]/g,     'z-dropdown'],
  [/\bz-\[40\]/g,     'z-editor-inline'],  // BlockActions/PageBlock @lg chrome (NOT sticky)
  [/\bz-\[25\]/g,     'z-editor-drawer'],  // LocalizationView drawer
  [/\bz-\[20\]/g,     'z-editor-inline'],  // drag handles, editor inline elements
  [/\bz-\[15\]/g,     'z-editor-drawer'],  // SiteConfigurationDrawer panels
  [/\bz-\[10\]/g,     'z-sticky'],         // SettingsToolbar @md — manual: should be z-editor-toolbar
  [/\bz-\[5\]/g,      'z-raised'],         // MultiGrid column resize handle
  [/\bz-\[2\]/g,      'z-overlap'],
  [/\bz-\[1\]/g,      'z-raised'],
  [/\bz-\[0\]/g,      'z-base'],

  // ── PageSearch uses z-1000 without brackets (not standard Tailwind) ───────
  [/\bz-1000\b/g,     'z-popover'],
  // z-100 without brackets (not in Tailwind v3 default, used as a pseudo-arbitrary)
  [/\bz-100\b/g,      'z-editor-toolbar'],

  // ── Plain Tailwind numerics ───────────────────────────────────────────────
  // z-50 = 50 → z-dropdown = 50  (same rendered value, semantic rename)
  // z-40 = 40 → z-sticky   = 40  (same rendered value — Navigation/MegaMenu panel)
  // z-20 = 20 → z-editor-inline = 30 (slight increase; editor/image overlays)
  // z-10 = 10 → z-dropdown = 50  (bulk: mostly tooltips — headers need manual z-sticky fix)
  // z-1  = ?? → z-raised   = 1   (not in Tailwind v3 default; CategoryCard uses it)
  // z-0  = 0  → z-base     = 0   (same rendered value)
  //
  // !z-50 in PayPal overlays → !z-loader (full-screen payment processing mask)
  [/\b!z-50\b/g,      '!z-loader'],
  [/\b!z-0\b/g,       '!z-base'],
  [/\bz-50\b/g,       'z-dropdown'],
  [/\bz-40\b/g,       'z-sticky'],
  [/\bz-20\b/g,       'z-editor-inline'],
  [/\bz-10\b/g,       'z-dropdown'],
  [/\bz-1\b/g,        'z-raised'],
  [/\bz-0\b/g,        'z-base'],
];

// ─── File walker ─────────────────────────────────────────────────────────────

function* walkVue(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // Skip hidden dirs and node_modules
      if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== '__tests__') {
        yield* walkVue(full);
      }
    } else if (entry.endsWith('.vue')) {
      yield full;
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let totalFiles = 0;
let changedFiles = 0;

for (const dir of SEARCH_DIRS) {
  for (const file of walkVue(dir)) {
    const original = readFileSync(file, 'utf8');
    let updated = original;

    for (const [pattern, replacement] of REPLACEMENTS) {
      updated = updated.replace(pattern, replacement);
    }

    if (updated !== original) {
      changedFiles++;
      const rel = relative(fileURLToPath(ROOT), file);
      console.log(`  ${DRY_RUN ? '[dry-run] would update' : 'updated'}: ${rel}`);
      if (!DRY_RUN) {
        writeFileSync(file, updated, 'utf8');
      }
    }
    totalFiles++;
  }
}

console.log(`\nScanned ${totalFiles} Vue files. ${changedFiles} ${DRY_RUN ? 'would be' : 'were'} updated.`);

// ─── Manual fixes required after this codemod ────────────────────────────────
console.log(`
MANUAL FIXES STILL NEEDED
──────────────────────────
1. apps/web/app/components/ui/Toolbar/Toolbar.vue (line ~101)
   drawerZIndexClass computed: 'lg:z-20 md:z-10' / 'md:z-20'
   → Replace with semantic tokens, e.g.:
     isDrawerOpen ? 'lg:z-editor-drawer md:z-editor-toolbar' : 'md:z-editor-drawer'

2. apps/web/app/components/NotifyMe/NotifyMe.vue (line 24)
   Inline style: style="z-index: 9999"
   → Replace with a Tailwind class: class="z-max"  (remove inline style)

3. apps/web/app/components/ui/Breadcrumbs/Breadcrumbs.vue (line 4)
   Typo class z-9 (not a valid Tailwind utility)
   → Replace with z-raised (z-index: 1) or z-overlap (z-index: 2) as appropriate

4. apps/web/app/components/SettingsToolbar/SettingsToolbar.vue (line 3)
   After codemod: z-raised @md:z-sticky @lg:z-editor-toolbar
   → Fix @md: to be z-editor-toolbar: z-editor-inline @md:z-editor-toolbar @lg:z-editor-toolbar

5. apps/web/app/components/MegaMenu/MegaMenu.vue (~line 275)
   Computed class: { 'z-sticky': isOpen.value }   (was { 'z-[10]': isOpen.value })
   → This is already correct (z-sticky = 40 is appropriate for sticky MegaMenu header)
   → VERIFY it looks correct after the codemod runs.

6. apps/web/app/components/ui/NavbarBottom.vue and blocks/NavbarBottom/NavbarBottom.vue
   z-dropdown → z-sticky  (bottom nav bars should be sticky, not dropdown)

7. apps/web/app/components/blocks/UtilityBar/UtilityBar.vue
   z-sticky -> z-raised (non-sticky header; stickiness determined via block setting)
   
8. apps/web/app/components/ui/SimplifiedHeader.vue
   z-dropdown → z-sticky  (sticky header)

9. apps/web/app/components/ui/Overlay/Overlay.vue
   z-dropdown → z-drawer-backdrop  (this is a backdrop, not a dropdown)

10. apps/web/app/components/ui/ImageSelectorModal/ImageSelectorModal.vue
    z-dropdown → z-modal-backdrop  (this is a modal backdrop)

11. apps/web/app/components/Cookiebar/Cookiebar.vue
    z-dropdown → z-cookiebar (floating element, not a dropdown)

12. apps/web/app/components/editor/ColorPicker/ColorPicker.vue
    z-max → z-picker (doesn't require escape hatch)

13. apps/web/app/components/editor/RichTextEditor/IconEmojiPicker.vue
    z-max → z-picker (doesn't require escape hatch)
`);
