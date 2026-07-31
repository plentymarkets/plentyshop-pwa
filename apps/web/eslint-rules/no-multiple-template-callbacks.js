// eslint-rules/no-multiple-template-callbacks.js
/**
 * @fileoverview Rule to forbid multiple statements/expressions in a single Vue template event handler.
 * Use a combined method instead: @click="method(), method2()" → @click="handleClick"
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noMultipleTemplateCallbacks = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid multiple statements/expressions in a single Vue template event handler. Extract them into a single combined method.',
    },
    messages: {
      noMultipleCallbacks:
        'Avoid multiple statements/expressions in a single template event handler. Extract them into a single combined method (e.g., @click="handleClick" where handleClick handles statements/expressions).',
    },
    schema: [],
  },

  create(context) {
    return {
      Program() {
        const sourceCode = context.sourceCode;
        const ast = sourceCode.ast;

        function checkNode(node) {
          if (!node || typeof node !== 'object') return;

          if (
            node.type === 'VAttribute' &&
            node.directive === true &&
            node.key?.name?.name === 'on' &&
            node.value?.type === 'VExpressionContainer'
          ) {
            const expr = node.value.expression;

            if (!expr || expr.type !== 'VOnExpression') return;

            const { body } = expr;

            // Case 1: multiple statements — @click="a(); b()"
            if (body.length > 1) {
              context.report({ node: node.value, messageId: 'noMultipleCallbacks' });
              return;
            }

            // Case 2: single SequenceExpression — @click="a(), b()"
            if (
              body.length === 1 &&
              body[0].type === 'ExpressionStatement' &&
              body[0].expression?.type === 'SequenceExpression' &&
              body[0].expression.expressions.length > 1
            ) {
              context.report({ node: node.value, messageId: 'noMultipleCallbacks' });
            }

            return;
          }

          for (const key of Object.keys(node)) {
            if (key === 'parent') continue;
            const child = node[key];
            if (Array.isArray(child)) {
              child.forEach(checkNode);
            } else if (child && typeof child === 'object' && child.type) {
              checkNode(child);
            }
          }
        }

        checkNode(ast);
      },
    };
  },
};

export default noMultipleTemplateCallbacks;
