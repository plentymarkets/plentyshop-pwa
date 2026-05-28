/**
 * Canonical list of allowed z-index tokens.
 * This is the single source of truth used by both the ESLint rule and the codemod.
 *
 * Scale defined in apps/web/app/configuration/tailwind.config.ts → theme.extend.zIndex
 */
export const Z_INDEX_TOKENS = new Set([
  'z-base',          // 0  — default, grounded
  'z-raised',        // 1  — slightly above base (e.g. carousel arrows, MultiGrid col)
  'z-overlap',       // 2  — badges, breadcrumb chevron, gallery arrows
  'z-editor-inline', // 30 — BlockActions, drag handles, add-block buttons in canvas
  'z-sticky',        // 40 — headers, NavbarBottom, sticky MegaMenu panel
  'z-dropdown',      // 50 — account dropdown, language list, MegaMenu panel, tooltips default
  'z-notifications', // 60 — toast/notification strip
  'z-drawer-backdrop', // 70 — MegaMenu mobile overlay
  'z-drawer',        // 80 — slide-in navigation drawer
  'z-cookiebar',     // 90 — cookie consent bar
  'z-editor-toolbar', // 100 — SettingsToolbar on lg
  'z-editor-drawer', // 110 — SiteConfigurationDrawer, LocalizationDrawer
  'z-modal-backdrop', // 200 — modal overlays / backdrops
  'z-modal',         // 210 — modal panels
  'z-popover',       // 220 — AddBlockPopover, RichText sub-menus
  'z-loader',        // 300 — page-blocking spinners
  'z-picker',        // 400 — ColorPicker, IconEmojiPicker (above modals)
  'z-toast',         // 500 — toasts invoked inside modals
  'z-max',           // 9999 — escape hatch (lint-discouraged)
]);
