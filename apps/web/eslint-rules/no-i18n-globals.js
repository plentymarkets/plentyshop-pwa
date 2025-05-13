// eslint-rules/no-i18n-globals.js
/**
 * @fileoverview Rule to forbid usage of global i18n functions ($t, $n, n) and suggest alternatives
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noI18nGlobals = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Forbid usage of global i18n functions and suggest alternatives",
        },
        messages: {
            noGlobalT: "Avoid using global $t function. Import the t function from the i18n composable instead (e.g., `const { t } = useI18n();`).",
            noGlobalN: "Avoid using global $n function. Import the n function from the i18n composable instead (e.g., `const { n } = useI18n();`).",
            noI18nN: "Avoid using {{ name }} i18n currency formatter function. Use the usePriceFormatter composable instead (e.g., `const { format } = usePriceFormatter();`)."
        },
        schema: []
    },

    create(context) {
        return {
            Program() {
                const sourceCode = context.getSourceCode();
                const ast = sourceCode.ast;

                // Checking for $t and $n in template expressions
                // n-function only with 'currency' argument
                function checkSourceCode(node) {
                    if (node.type === 'VExpressionContainer' || node.type === 'VDirectiveKey') {
                        const text = sourceCode.getText(node);

                        if (text.startsWith('{{ $t(')) {
                            context.report({
                                node,
                                messageId: "noGlobalT"
                            });
                        }


                        if (text.startsWith('{{ $n(')) {
                            context.report({
                                node,
                                messageId: "noGlobalN"
                            });
                        } else if (text.includes('n(') && text.includes(', \'currency\')')) {
                            context.report({
                                node,
                                messageId: "noI18nN",
                                data: {
                                    name: text.includes('$n(') ? "$n" : "n"
                                }
                            });
                        }
                    }

                    for (const key in node) {
                        if (typeof node[key] === 'object' && node[key] !== null && key !== 'parent') {
                            if (Array.isArray(node[key])) {
                                node[key].forEach(checkSourceCode);
                            } else {
                                checkSourceCode(node[key]);
                            }
                        }
                    }
                }

                checkSourceCode(ast);
            },

            // Check for $n & n in script with 'currency' argument
            CallExpression(node) {
                const isTargetFunction = (name) => {
                    return ['n', '$n'].includes(name)
                        || (name === 'n' && !node.callee.computed)
                        || (
                            node.callee.type === 'MemberExpression' &&
                            node.callee.object.name === '$i18n' &&
                            node.callee.property.name === 'n'
                        );
                };

                const calleeName = node.callee.name || (node.callee.property && node.callee.property.name);

                if (!isTargetFunction(calleeName)) return;

                if (node.arguments.length >= 2) {
                    const secondArg = node.arguments[1];
                    if (secondArg.type === 'Literal' && secondArg.value === 'currency') {
                        context.report({
                            node,
                            messageId: 'noI18nN',
                            data: {
                                name: calleeName,
                            },
                        });
                    }
                }
            }
        }
    }
};

export default noI18nGlobals;