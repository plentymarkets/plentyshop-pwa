# How to migrate site settings to the sub-category structure

::: info
The site settings architecture changed on 1 July 2025. If your custom settings were created before this date, follow this guide to update them.
:::

## Overview

This guide explains how to update existing site settings components to the current folder structure, which introduced a mandatory sub-category level between the main category and its groups.

## Before you start

Before you migrate your site settings, ensure:

- You are familiar with the current folder-layout convention described in [Site settings architecture](/guide/editor/site-settings-architecture.md).
- You have identified all custom settings folders that follow the old structure (groups nested directly inside a main category, without an intermediate sub-category folder).

## Update the folder structure

The only structural change is the addition of a sub-category folder between the main category and its groups. All existing setting components can be moved without modification.

1. Inside your main category folder, create a new sub-category folder. The sub-category folder name is typically the same as the main category name.

2. Move all existing group folders (e.g. `1.fonts/`, `2.colours/`) into the new sub-category folder.

3. Create a `View.vue` inside the new sub-category folder.

   ```vue
   <!-- components/settings/branding-and-design/branding-and-design/View.vue -->
   <template>
     <SiteConfigurationView>
       <template #setting-title>{{ getEditorTranslation('label') }}</template>
     </SiteConfigurationView>
   </template>

   <script setup lang="ts"></script>

   <i18n lang="json">
   {
     "en": { "label": "Branding & Design" },
     "de": { "label": "Branding & Design" }
   }
   </i18n>
   ```

4. Ensure the main category folder still contains its own `View.vue` and `ToolbarTrigger.vue` at the top level. These do not move.

## Result

Your folder structure should go from this:

```
components/settings/branding-and-design/
├─ 1.fonts/
│  └─ PrimaryFont.vue
├─ 2.colours/
│  ├─ PrimaryColour.vue
│  └─ SecondaryColour.vue
├─ ToolbarTrigger.vue
└─ View.vue
```

To this:

```
components/settings/branding-and-design/
├─ ToolbarTrigger.vue
├─ View.vue
└─ branding-and-design/             # new sub-category folder
   ├─ View.vue                      # new
   ├─ 1.fonts/
   │  └─ PrimaryFont.vue
   └─ 2.colours/
      ├─ PrimaryColour.vue
      └─ SecondaryColour.vue
```

## See also

- [Site settings architecture](/guide/editor/site-settings-architecture.md) — full explanation of the current folder convention
- [How to add a site setting](/guide/editor/site-settings.md) — end-to-end guide for adding a new setting
