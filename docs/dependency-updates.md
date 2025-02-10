# Dependency updates

## Nuxt

When updating the Nuxt package, additional steps may be necessary:

1. In `/package.json`, update `nuxt` and `typescript`.
2. In `/apps/web/package.json`, update `nuxt` and `vue-tsc`.
3. Run `npm ci`.
4. Run `npm dedupe`.

You may have to update additional Nuxt modules dependencies in `/apps/web/package.json`.
