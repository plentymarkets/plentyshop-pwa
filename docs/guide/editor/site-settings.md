# How to add a site setting

## Overview

This guide explains how to add a new configurable value to the editor's settings drawer, so that merchants can adjust it without modifying code or environment variables directly.

A site setting is appropriate when you have a value — such as a colour, font, or toggle — that should be adjustable by a merchant at runtime and persisted in the PlentyONE system.

## Before you start

Before you add a site setting, ensure:

- You know what key name the setting will use (e.g. `primaryColor` maps to the environment variable `NUXT_PUBLIC_PRIMARY_COLOR`).
- You have decided whether the setting belongs in an existing settings category or requires a new one.
- You are familiar with the folder-layout convention described in [Site settings architecture](/guide/editor/site-settings-architecture.md).

## Register the setting value

Open `apps/web/app/configuration/settings.config.ts` and add a new property to the exported config object. Read from the corresponding environment variable and provide a sensible fallback.

```ts
// apps/web/app/configuration/settings.config.ts
primaryColor: process.env.NUXT_PUBLIC_PRIMARY_COLOR || '#062633',
```

The property name you choose here is the key you will pass to `useSiteSettings()` in later steps.

## Create the category wrapper files

::: info Placing a setting in an existing category
If you are adding a setting to an existing main category, place your component in the correct subfolder and skip this section. The folder convention handles discovery automatically — no registration is needed.
:::

### Create `ToolbarTrigger.vue`

`ToolbarTrigger.vue` defines the button shown in the editor's sidebar. Place it directly inside the main category folder. The `active` prop is provided automatically by the framework and indicates whether this category is currently open.

```vue
<!-- components/settings/branding-and-design/ToolbarTrigger.vue -->
<template>
  <SfTooltip label="Branding & Design" placement="right" class="inline-grid" :show-arrow="true">
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open design drawer"
    >
      <NuxtImg v-if="active" width="24" height="24" :src="paintBrushWhite" />
      <NuxtImg v-else width="24" height="24" :src="paintBrushBlack" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import paintBrushWhite from '~/assets/icons/paths/paint-brush-white.svg';
import paintBrushBlack from '~/assets/icons/paths/paint-brush-black.svg';

defineProps({
  active: Boolean,
});
</script>
```

### Create the main category `View.vue`

`View.vue` at the main category level is the wrapper shown when the toolbar button is clicked. It renders the section title.

```vue
<!-- components/settings/branding-and-design/View.vue -->
<template>
  <SiteConfigurationView>
    <template #setting-title>Branding & Design</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>
```

### Create the sub-category `View.vue`

Each sub-category also requires its own `View.vue`.

```vue
<!-- components/settings/branding-and-design/design/View.vue -->
<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": { "label": "Design" },
  "de": { "label": "Design" }
}
</i18n>
```

### Add `lang.json` translation files

`lang.json` files provide human-readable display names for folder names used in the drawer navigation. They are optional but recommended.

```json
// components/settings/branding-and-design/lang.json
{
  "branding-and-design": "Branding & Design"
}
```

Add a `lang.json` at any folder level where the folder name itself would be shown as a label in the drawer.

## Create the settings component

1. Create the component file inside the group folder you created above. Using numeric prefixes on group folder names controls the display order in the drawer (e.g. `2.colours/`).

2. In the component, call `useSiteSettings('<key>')` to get `getSetting` and `updateSetting`, then bind them via a writable computed property.

   ```vue
   <!-- components/settings/branding-and-design/design/2.colours/PrimaryColour.vue -->
   <template>
     <div class="py-2">
       <UiFormLabel>Primary colour</UiFormLabel>
       <SfInput v-model="primaryColor" type="text" />
     </div>
   </template>

   <script setup lang="ts">
   import { SfInput } from '@storefront-ui/vue';
   import { getPaletteFromColor, setColorProperties } from '~/utils/tailwindHelper';

   const { updateSetting, getSetting } = useSiteSettings('primaryColor');

   const updatePrimaryColor = (hexColor: string) => {
     const tailwindColors = getPaletteFromColor('primary', hexColor).map((color) => ({ ...color }));
     setColorProperties('primary', tailwindColors);
   };

   const primaryColor = computed({
     get: () => getSetting(),
     set: (value) => {
       updateSetting(value);
       updatePrimaryColor(value); // optional: apply a live preview side-effect
     },
   });
   </script>
   ```

   The live-preview side-effect in the setter (calling `updatePrimaryColor`) is optional. Include it only if the setting has a visible effect you want to preview in real time while the merchant is editing.

## Result

After completing the steps above, your folder structure should look like this:

```
components/
└─ settings/
   └─ branding-and-design/
      ├─ ToolbarTrigger.vue
      ├─ View.vue
      ├─ lang.json
      └─ design/
         ├─ View.vue
         └─ 2.colours/
            └─ PrimaryColour.vue
```

The new setting is now discoverable automatically. No manual component registration is required. The merchant will see the new toolbar button, navigate into the category, and find the setting in the correct group.

## See also

- [Site settings architecture](/guide/editor/site-settings-architecture.md) — explains the folder convention, auto-discovery, and how modules can add or override settings
- [Theme configuration](/guide/themes/styling.md) — relevant if your setting drives a Tailwind design token
