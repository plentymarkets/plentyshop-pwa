export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        src: 'https://eu1-config.doofinder.com/2.x/7dba4504-71aa-48f2-8b05-ceae7139176e.js',
        async: true,
      },
    ],
  });
});
