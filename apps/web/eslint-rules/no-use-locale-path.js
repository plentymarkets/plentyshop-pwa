// eslint-rules/no-use-locale-path.js
/**
 * @fileoverview Rule to forbid useLocalePath() in favor of useLocalizedPath()
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noUseLocalePath = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useLocalePath() and suggest useLocalizedPath() instead',
    },
    messages: {
      noUseLocalePath: 'Avoid using useLocalePath(). Use useLocalizedPath() instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'useLocalePath') {
          context.report({ node, messageId: 'noUseLocalePath' });
        }
      },
    };
  },
};

export default noUseLocalePath;
