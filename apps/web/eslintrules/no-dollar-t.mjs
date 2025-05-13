export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow using $t for translations',
      category: 'Best Practices',
      recommended: true
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    return {
      CallExpression(node) {
        // this.$t('foo')
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'ThisExpression' &&
          node.callee.property.name === '$t'
        ) {
          context.report({
            node,
            message: 'Using this.$t is not allowed. Use the t function from useI18n() instead.'
          });
        }
        // $t('foo') in template or script
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === '$t'
        ) {
          context.report({
            node,
            message: 'Using $t is not allowed. Use the t function from useI18n() instead.',
            fix: (fixer) => fixer.replaceText(node.callee, 't')
          });
        }
      }
    };
  }
};