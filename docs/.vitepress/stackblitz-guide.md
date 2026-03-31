# StackBlitz Integration Guide

This project now supports embedding interactive StackBlitz playgrounds in the documentation.

## Basic Usage

### Method 1: Using an Existing StackBlitz Project

```md
<StackBlitzDemo 
  projectId="your-project-id"
  openFile="src/index.ts"
  :height="600"
/>
```

### Method 2: Defining Files Inline

```md
<StackBlitzDemo
title="My Nuxt Module Example"
:files="{
'package.json': `{
  \"name\": \"nuxt-module-example\",
  \"type\": \"module\",
  \"dependencies\": {
    \"nuxt\": \"^3.0.0\"
  }
}`,
'nuxt.config.ts': `export default defineNuxtConfig({
  modules: ['./modules/custom-module']
})`,
'modules/custom-module/index.ts': `import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
setup() {
console.log('Module loaded!')
}
})`
}"
openFile="modules/custom-module/index.ts"
:height="500"
/>
```

## Props

| Prop             | Type                                 | Default                 | Description                                          |
| ---------------- | ------------------------------------ | ----------------------- | ---------------------------------------------------- |
| `projectId`      | `string`                             | -                       | ID of an existing StackBlitz project                 |
| `files`          | `Record<string, string>`             | -                       | Object with file paths as keys and content as values |
| `title`          | `string`                             | `'Nuxt Module Example'` | Title for the embedded project                       |
| `openFile`       | `string`                             | -                       | File path to open by default                         |
| `height`         | `number`                             | `500`                   | Height of the embedded frame in pixels               |
| `view`           | `'preview' \| 'editor' \| 'default'` | `'default'`             | Default view mode                                    |
| `hideExplorer`   | `boolean`                            | `false`                 | Hide the file explorer                               |
| `hideNavigation` | `boolean`                            | `false`                 | Hide the top navigation                              |

## Creating a StackBlitz Project

1. Go to [stackblitz.com](https://stackblitz.com)
2. Create a new Nuxt project or start from scratch
3. Set up your example code
4. Click "Share" → Get the project ID from the URL
5. Use the project ID in the `projectId` prop

## Tips

- Use `:height` binding (with colon) for numeric values
- Use `openFile` to guide users to the most important file
- Consider using `view="preview"` for demos or `view="editor"` for code tutorials
- For complex examples, create a full StackBlitz project instead of inline files
