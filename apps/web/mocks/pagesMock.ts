export const generateMockPages = () => {
  const mockPages = [];

  for (let i = 1; i <= 101; i++) {
    mockPages.push({
      id: i,
      name: `Page ${i}`,
      path: `/page-${i}`,
      type: i % 2 === 0 ? 'content' : 'item',
      canonicalLink: '',
      children: i === 10 
        ? Array.from({ length: 101 }, (_, index) => ({
            id: i * 100 + index + 1,
            name: `Child ${index + 1} of Page ${i}`,
            path: `/page-${i}/child-${index + 1}`,
          }))
        : i % 5 === 0 
        ? [{ id: i * 10, name: `Child of Page ${i}`, path: `/page-${i}/child` }]
        : undefined,
      linklist: undefined,
      metaDescription: '',
      metaKeywords: '',
      metaRobots: '',
      parentCategoryId: undefined,
      position: '',
      right: 'all',
      sitemap: undefined,
    });
  }

  return mockPages;
};
