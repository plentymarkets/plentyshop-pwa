// eslint-rules/no-bare-responsive-in-container.js
/**
 * Flags bare Tailwind responsive prefixes (md:, lg:, etc.) that should use the
 * @-prefixed container-query variant (@md:, @lg:, etc.) instead.
 *
 * File scoping (which directories this applies to) is configured in eslint.config.mjs.
 */

const BREAKPOINTS = ['2xl', 'xl', 'xs', 'sm', 'md', 'lg'];

/** True if classStr contains a bare responsive prefix, e.g. "md:" or "max-md:" but not "@md:" or "@max-md:". */
function hasBareBreakpoint(classStr) {
  // The lookbehind (?<![\w@-]) ensures we don't match inside already-prefixed variants like @sm: or @max-sm:
  return BREAKPOINTS.some((bp) => new RegExp(`(?<![\\w@-])(max-|min-)?${bp}:`).test(classStr));
}

/**
 * Collects all literal class strings from a :class expression.
 * Handles: "string", ternary ("a" : "b"), array (["a", "b"]), object keys ({ "md:x": true }).
 */
function collectClassStrings(expr) {
  if (!expr) return [];
  if (expr.type === 'Literal') return typeof expr.value === 'string' ? [{ value: expr.value, node: expr }] : [];
  if (expr.type === 'TemplateLiteral') return expr.quasis.map((q) => ({ value: q.value.raw, node: q }));
  if (expr.type === 'ConditionalExpression') return [...collectClassStrings(expr.consequent), ...collectClassStrings(expr.alternate)];
  if (expr.type === 'ArrayExpression') return (expr.elements ?? []).flatMap(collectClassStrings);
  if (expr.type === 'ObjectExpression') {
    return (expr.properties ?? [])
      .filter((p) => p.key?.type === 'Literal' && typeof p.key.value === 'string')
      .map((p) => ({ value: p.key.value, node: p.key }));
  }
  return [];
}

/** Checks all class attributes on one element and reports any violations. */
function checkElement(vElement, context) {
  for (const attr of vElement.startTag?.attributes ?? []) {
    const isStaticClass = !attr.directive && attr.key?.name === 'class';
    const isDynamicClass =
      attr.directive &&
      attr.key?.name?.name === 'bind' &&
      attr.key?.argument?.name === 'class';

    if (isStaticClass && hasBareBreakpoint(attr.value?.value ?? '')) {
      context.report({ node: attr, messageId: 'useContainerVariant' });
    }

    if (isDynamicClass) {
      for (const { value, node } of collectClassStrings(attr.value?.expression)) {
        if (hasBareBreakpoint(value)) context.report({ node, messageId: 'useContainerVariant' });
      }
    }
  }
}

/** Walks all elements in the template recursively. */
function walkTemplate(node, context) {
  if (!node || node.type !== 'VElement') return;
  checkElement(node, context);
  for (const child of node.children ?? []) walkTemplate(child, context);
}

/** @type {import('eslint').Rule.RuleModule} */
export const noBareTailwindResponsiveInContainer = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce @-prefixed container-query variants in files rendered inside a Tailwind @container.',
    },
    messages: {
      useContainerVariant:
        'Use "@sm:", "@md:", "@lg:" etc. instead of bare "sm:", "md:", "lg:" — this component is always rendered inside a Tailwind @container.',
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
    };
  },
};
