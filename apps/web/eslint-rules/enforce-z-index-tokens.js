// eslint-rules/enforce-z-index-tokens.js
/**
 * Flags z-index Tailwind classes that are not in the project's semantic token allowlist.
 *
 * Catches both arbitrary values (z-[200]) and plain Tailwind numerics (z-10, z-50) that
 * haven't been mapped to a named token.
 */

/**
 * List of allowed z-index tokens.
 *
 * Scale defined in apps/web/app/configuration/tailwind.config.ts → theme.extend.zIndex
 */
const Z_INDEX_TOKENS = new Set([
  'z-base', // 0  — default, grounded
  'z-raised', // 1  — slightly above base (e.g. carousel arrows, MultiGrid col)
  'z-overlap', // 2  — badges, breadcrumb chevron, gallery arrows
  'z-editor-drawer', // 10 — SiteConfigurationDrawer, LocalizationDrawer
  'z-editor-inline', // 30 — BlockActions, drag handles, add-block buttons in canvas
  'z-sticky', // 40 — headers, NavbarBottom, sticky MegaMenu panel
  'z-dropdown', // 50 — account dropdown, language list, MegaMenu panel, tooltips default
  'z-notifications', // 60 — toast/notification strip
  'z-drawer-backdrop', // 70 — MegaMenu mobile overlay
  'z-drawer', // 80 — slide-in navigation drawer
  'z-cookiebar', // 90 — cookie consent bar
  'z-editor-toolbar', // 100 — SettingsToolbar on lg
  'z-modal-backdrop', // 200 — modal overlays / backdrops
  'z-modal', // 210 — modal panels
  'z-popover', // 220 — AddBlockPopover, RichText sub-menus
  'z-loader', // 300 — page-blocking spinners
  'z-picker', // 400 — ColorPicker, IconEmojiPicker (above modals)
  'z-toast', // 500 — toasts invoked inside modals
  'z-max', // 9999 — escape hatch (lint-discouraged)
]);

/** Regex that matches any Tailwind class that looks like a z-index utility. */
const Z_CLASS_RE = /(?:^|\s)(!?(?:[\w@-]+:)*z-\S+)/g;

/**
 * Given a raw class string (which may contain multiple space-separated tokens),
 * returns every token that matches the z-* pattern but whose bare suffix is NOT in
 * the allowlist.
 *
 * Stripping logic:
 *   - Remove leading `!` (important modifier)
 *   - Remove all `prefix:` segments (responsive / variant prefixes like `md:`, `@md:`, `lg:`, `hover:`, etc.)
 *   - What remains is the bare utility token, e.g. `z-50`, `z-[200]`, `z-dropdown`
 */
function collectViolations(classStr) {
  const violations = [];
  let match;
  Z_CLASS_RE.lastIndex = 0;
  while ((match = Z_CLASS_RE.exec(classStr)) !== null) {
    const rawToken = match[1];

    const withoutBang = rawToken.startsWith('!') ? rawToken.slice(1) : rawToken;
    const colonIdx = withoutBang.lastIndexOf(':');
    const bareToken = colonIdx === -1 ? withoutBang : withoutBang.slice(colonIdx + 1);

    if (!Z_INDEX_TOKENS.has(bareToken)) {
      violations.push(rawToken);
    }
  }
  return violations;
}

/**
 * Collects all literal class strings from a :class expression (handles string,
 * ternary, array, object, template-literal shapes — mirrors the approach in
 * no-bare-responsive-in-container.js).
 */
function collectClassStrings(expr) {
  if (!expr) return [];
  if (expr.type === 'Literal') {
    return typeof expr.value === 'string' ? [{ value: expr.value, node: expr }] : [];
  }
  if (expr.type === 'TemplateLiteral') {
    return expr.quasis.map((q) => ({ value: q.value.raw, node: q }));
  }
  if (expr.type === 'ConditionalExpression') {
    return [...collectClassStrings(expr.consequent), ...collectClassStrings(expr.alternate)];
  }
  if (expr.type === 'ArrayExpression') {
    return (expr.elements ?? []).flatMap(collectClassStrings);
  }
  if (expr.type === 'ObjectExpression') {
    return (expr.properties ?? [])
      .filter((p) => p.key?.type === 'Literal' && typeof p.key.value === 'string')
      .map((p) => ({ value: p.key.value, node: p.key }));
  }
  return [];
}

function checkElement(vElement, context) {
  for (const attr of vElement.startTag?.attributes ?? []) {
    const isStaticClass = !attr.directive && attr.key?.name === 'class';
    const isDynamicClass =
      attr.directive &&
      attr.key?.name?.name === 'bind' &&
      attr.key?.argument?.name === 'class';

    if (isStaticClass) {
      const violations = collectViolations(attr.value?.value ?? '');
      for (const token of violations) {
        context.report({ node: attr, messageId: 'useZToken', data: { token } });
      }
    }

    if (isDynamicClass) {
      for (const { value, node } of collectClassStrings(attr.value?.expression)) {
        const violations = collectViolations(value);
        for (const token of violations) {
          context.report({ node, messageId: 'useZToken', data: { token } });
        }
      }
    }
  }
}

function walkTemplate(node, context) {
  if (!node || node.type !== 'VElement') return;
  checkElement(node, context);
  for (const child of node.children ?? []) walkTemplate(child, context);
}

function isInWalkedTemplate(node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'VExpressionContainer') return true;
    current = current.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
export const enforceZIndexTokens = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce semantic z-index tokens instead of arbitrary values or plain Tailwind numerics.',
    },
    messages: {
      useZToken:
        '"{{ token }}" is not a semantic z-index token. Use one of the named tokens from the project scale (z-base, z-raised, z-overlap, z-editor-inline, z-sticky, z-dropdown, z-notifications, z-drawer-backdrop, z-drawer, z-cookiebar, z-editor-toolbar, z-editor-drawer, z-modal-backdrop, z-modal, z-popover, z-loader, z-picker, z-toast, z-max). See apps/web/eslint-rules/z-index-tokens.js.',
    },
    schema: [],
  },

  create(context) {
    return {
      Program() {
        const templateBody = context.sourceCode.ast.templateBody;
        if (!templateBody) return;
        for (const child of templateBody.children ?? []) {
          walkTemplate(child, context);
        }
      },

      Literal(node) {
        if (typeof node.value !== 'string') return;
        if (isInWalkedTemplate(node)) return;
        const violations = collectViolations(node.value);
        for (const token of violations) {
          context.report({ node, messageId: 'useZToken', data: { token } });
        }
      },

      TemplateLiteral(node) {
        if (isInWalkedTemplate(node)) return;
        for (const quasi of node.quasis) {
          const violations = collectViolations(quasi.value.raw);
          for (const token of violations) {
            context.report({ node: quasi, messageId: 'useZToken', data: { token } });
          }
        }
      },
    };
  },
};
