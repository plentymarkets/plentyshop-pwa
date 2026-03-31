# Using Tailwind in your module

## Introduction

To use Tailwind classes in your module components, it is necessary to hook into the Tailwind configuration of the shop.
This guide will show you how to do that.
Otherwise, Tailwind classes that do not already exist will not be available in your module.
It is also possible to override the Tailwind configuration, e.g. to add custom colours.

::: info
You need to insert your module before the `@nuxtjs/tailwindcss` in the `modules` of your `nuxt.config.ts` in your Shop repository.
:::

## Prerequisites / Preparation

This guide requires that you already have created a module.
If you haven't created a module yet, you can follow the [How-to create a module](/guide/how-to/module/index.md) guide.

Add the `@nuxtjs/tailwindcss` module to your module repository as a dev-dependency and to the `compilerOptions` types array in the `tsconfig.json`.

## Scenarios

### 1. Use Tailwind classes in your module components

In order to enable the usage of Tailwind classes in your module components, you need to hook into the Tailwind configuration and add your components.

```typescript
// src/module.ts
// in the setup function

nuxt.hook('tailwindcss:config', (config) => {
  if (config.content) {
    (config.content as string[]).push(resolve('./runtime/components/**/*.{vue,mjs,ts}'));
    (config.content as string[]).push(resolve('./runtime/*.{mjs,js,ts}'));
  }
});
```

After that you can use Tailwind classes in your module components.

### 2. Override the Tailwind configuration

To override the Tailwind configuration, you can hook into the `tailwindcss:config` hook and modify the configuration.

```typescript
// src/module.ts
// in the setup function

nuxt.hook('tailwindcss:config', (config) => {
  if (config?.theme?.extend?.colors) {
    (config.theme.extend.colors as any)['primary']['500'] = '#000';
  }
});
```

This changes takes effect in every component, page, and layout, even in the main repository.
