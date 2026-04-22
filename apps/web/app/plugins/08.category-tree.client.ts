export default defineNuxtPlugin({
  name: 'category-tree',
  parallel: true,
  dependsOn: ['session'],
  setup() {
    const { data, getCategoryTree } = useCategoryTree();
    if (data.value.length === 0) getCategoryTree();
  },
});
