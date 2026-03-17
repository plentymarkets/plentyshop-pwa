import { createResolver, defineNuxtModule, extendPages } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'blog',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);
    
    extendPages((pages) => {
        pages.push({
            name: 'blog',
            path: '/blog/:slug',
            file: resolver.resolve("./runtime/blog.vue") 
        })
    })
    
  },
});
