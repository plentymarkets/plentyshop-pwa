# Theme configuration

Most of the shop uses [Tailwind](https://tailwindcss.com/) for styling.
To edit your theme, open `tailwind.config.ts`.
Note that parts of the theme are imported from [Storefront UI](https://docs.storefrontui.io/v2/?path=%2Fstory%2Fwelcome--page).

In some cases, you can't directly apply classes to elements to style them, for example when using certain component libraries.
You may also prefer stylesheets over using Tailwind.
To style your shop without using Tailwind, you can either use the `<style>` tag of [Vue SFCs](https://vuejs.org/api/sfc-css-features.html) or add your stylesheets to [Nuxt's assets directory](https://nuxt.com/docs/4.x/directory-structure/app/assets).

## References

- [Tailwind Documentation](https://tailwindcss.com/docs/configuration)
- [Storefront UI: Theming](https://docs.storefrontui.io/v2/vue/customization/theming.html)
- [Storefront UI: Overriding Default Styles](https://docs.storefrontui.io/v2/vue/customization/overriding-default-styles.html)
- [Storefront UI: Typography](https://docs.storefrontui.io/v2/vue/customization/typography.html)
- [Colour Palette Generator](https://uicolors.app/create)
- [Nuxt Assets](https://nuxt.com/docs/4.x/getting-started/assets)
