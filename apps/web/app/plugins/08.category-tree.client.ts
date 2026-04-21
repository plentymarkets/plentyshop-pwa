export default defineNuxtPlugin({
  name: 'category-tree',
  parallel: true,
  dependsOn: ['session'],
  async setup () {
    const { data, getCategoryTree } = useCategoryTree();
    if (data.value.length === 0) await getCategoryTree();
  },
});
