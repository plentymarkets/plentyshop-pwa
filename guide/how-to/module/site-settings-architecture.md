# Extensible Site‑Settings Architecture

This document explains how the settings drawer works, why the folder structure looks the way it does, and how one can plug in new settings or completely override existing ones without touching core code.

---

### Folder Layout Conventions

The folder-layout convention defines a single, predictable path for every settings component, enabling automatic discovery, clean overrides, and zero manual registration. By adhering to `settings/<section>/<group>/<Setting>.vue` with `View.vue` and `ToolbarTrigger.vue`, core code, Nuxt modules, and client customisations integrate seamlessly.

![Site settings diagram](images/site-settings.png)

```
components/
└─ settings/
   └─ design/                     # section (one Toolbar button)
      ├─ 1.fonts/                 # group (order via prefix)
      │  └─ PrimaryFont.vue       # individual setting
      ├─ 2.colors/
      │  ├─ PrimaryColor.vue
      │  └─ SecondaryColor.vue
      ├─ View.vue                 # wrapper for the whole section
      └─ ToolbarTrigger.vue       # how the button looks in the side bar
```
---

### Working with Settings in modules

Any Nuxt module or customer package can replicate the same path inside `runtime/components/…/settings/**` to extend or override core files. If multiple modules try to use the same path, the first match is displayed.

Each time a new setting is plugged in, it needs to be registered manually in the runtime configuration. To register a setting inside a module, `updateRuntimeConfig` in the module's `index.ts`.

```ts
// modules/my-module/runtime/index.ts
import { defineNuxtModule, updateRuntimeConfig } from '@nuxt/kit';

export default defineNuxtModule({
    setup() {
        updateRuntimeConfig({
            public: {
                primaryColor: '#fff',
            },
        });
    },
});
```

To work with the settings in the individual components use a [Writable computed](https://vuejs.org/guide/essentials/computed#writable-computed) which overrides a setter and getter for the setting value. This allows for a clean separation of concerns and makes it easy to manage the state of each setting.

```ts
// components/settings/design/2.colors/PrimaryColor.vue
import { getPaletteFromColor, setColorProperties } from '~/utils/tailwindHelper';

const { updateSetting, getSetting } = useSiteSettings('primaryColor');

const updatePrimaryColor = (hexColor: string) => {
    const tailwindColors = getPaletteFromColor('primary', hexColor).map((color) => ({
        ...color,
    }));

    setColorProperties('primary', tailwindColors);
};

const primaryColor = computed({
    get: () => getSetting(),
    set: (value) => {
        updateSetting(value);
        updatePrimaryColor(value);
    },
});
```

---

### `useSiteSettings.ts` composable

`useSiteSettings.ts` centralises all state management for site-level settings. It exposes a minimal API - staging, reading, dirty-checking, and committing changes - so UI components can update settings without duplicating logic.

```ts
const {
  updateSetting,
  getSetting,
  isDirty,
  saveSiteSettings,
} = useSiteSettings('primaryColor');

updateSetting('#ff0000');
console.log(getSetting());     // → '#ff0000'
if (isDirty.value) await saveSiteSettings();
```

- **`data`** – live (unsaved) key → value map.
- **`initialData`** – snapshot of the last saved state (sourced from `useRuntimeConfig().public`).
- **`updateSetting(key, value)`** – stage a change locally.
- **`getSetting(key)`** – read the staged *or* saved value (staged takes precedence).
- **`isDirty`** – `true` when staged data differs from saved data; useful for change notifications.
- **`saveSiteSettings()`** – commit staged data to `initialData`; long-term persistence is handled in `useSiteConfiguration.ts`.

---

### Further Reading
* [Writable computed](https://vuejs.org/guide/essentials/computed#writable-computed)
