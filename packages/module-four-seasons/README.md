# @plentymarkets/four-seasons

A PlentyONE Shop PWA module that adds an animated falling particle overlay (leaves, snow, cherry blossom, or sunflower petals) to every page. Built as a demo/test fixture for the `packages/module` publish workflow (`.github/workflows/publish-module.yml`).

## Usage

Add to `apps/web/nuxt.config.ts`:

```ts
modules: [
  '@plentymarkets/four-seasons',
],
plentymarketsFourSeasons: {
  enabled: true,
  particleType: 'leaves', // or 'snow' | 'blossom' | 'sunflower'
  flakeCount: 60,
},
```

See `meta/documents/user_guide_en.md` for full options.
