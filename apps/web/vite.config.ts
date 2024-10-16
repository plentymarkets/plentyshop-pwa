import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['swiper/vue', 'swiper/modules/navigation', 'swiper/modules/pagination'],
    exclude: [
      'swiper/modules/zoom',
      'swiper/modules/virtual',
      'swiper/modules/a11y',
      'swiper/modules/scrollbar',
      'swiper/modules/mousewheel',
    ],
  },
});
