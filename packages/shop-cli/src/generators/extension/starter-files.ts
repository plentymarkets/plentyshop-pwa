import { createPlaceholderPng } from './png';
import {
  AUTHOR_ICON_SIZES,
  DOCUMENT_LANGUAGES,
  INITIAL_VERSION,
  PLACEHOLDER_COLOR,
  PLUGIN_ICON_SIZES,
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
} from './constants';
import { getExtensionDirName, parseExtensionName, toPascalCase } from './naming';
import type { ExtensionAnswers, ExtensionFile } from './types';

export function buildPlugin(): string {
  return `import { defineExtensionPlugin } from '#imports';
import extensionConfig from '../extension.config';

// Only runs when the extension is activated for the shop.
export default defineExtensionPlugin(extensionConfig.name, () => {
  // TODO: add your extension logic
});
`;
}

export function buildComponent(answers: ExtensionAnswers): string {
  const { slug } = parseExtensionName(answers.name);
  return `<script setup lang="ts">
import extensionConfig from '../extension.config';
</script>

<template>
  <ExtensionBoundary :name="extensionConfig.name">
    <div data-testid="${slug}">${answers.displayNameEn}</div>
  </ExtensionBoundary>
</template>
`;
}

export function buildComposable(answers: ExtensionAnswers): string {
  const { slug } = parseExtensionName(answers.name);
  return `import extensionConfig from '../extension.config';

export function use${toPascalCase(slug)}() {
  if (!extensionConfig.isActive()) {
    return;
  }

  // TODO: add your extension logic
}
`;
}

export function buildPlayground(answers: ExtensionAnswers): ExtensionFile[] {
  return [
    {
      path: 'playground/nuxt.config.ts',
      content: `export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
});
`,
    },
    {
      path: 'playground/app.vue',
      content: `<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>${answers.displayNameEn} Playground</h1>
  </div>
</template>
`,
    },
    {
      path: 'playground/package.json',
      content: `${JSON.stringify(
        {
          private: true,
          name: `${getExtensionDirName(answers.name)}-playground`,
          type: 'module',
          scripts: { dev: 'nuxi dev', build: 'nuxi build' },
          dependencies: { nuxt: '^4.5.2' },
        },
        null,
        2,
      )}\n`,
    },
  ];
}

export function buildReadme(answers: ExtensionAnswers): string {
  return `# ${answers.name}

${answers.descriptionEn}

## Usage

Add to \`apps/web/nuxt.config.ts\`:

\`\`\`ts
modules: ['${answers.name}'],
\`\`\`

## Before publishing

- Replace the placeholder images in \`meta/images/\` (icons and previews).
- Fill in the documents in \`meta/documents/\` (changelog, support contact, user guide — EN and DE).
- Publish with the **Publish Module** workflow (use \`dryRun\` first).
`;
}

export function buildDocuments(answers: ExtensionAnswers): ExtensionFile[] {
  return DOCUMENT_LANGUAGES.flatMap((lang) => [
    {
      path: `meta/documents/changelog_${lang}.md`,
      content: `# Changelog\n\n## ${INITIAL_VERSION}\n\n- Initial release\n`,
    },
    {
      path: `meta/documents/support_contact_${lang}.md`,
      content: `## Email\n\n${answers.supportEmail}\n`,
    },
    {
      path: `meta/documents/user_guide_${lang}.md`,
      content: `# ${lang === 'de' ? answers.displayNameDe : answers.displayNameEn}\n\n${
        lang === 'de' ? answers.descriptionDe : answers.descriptionEn
      }\n\nTODO: describe how to install and configure the extension.\n`,
    },
  ]);
}

export function buildImages(): ExtensionFile[] {
  const fixedSize = [...AUTHOR_ICON_SIZES, ...PLUGIN_ICON_SIZES].map(({ name, size }) => ({
    path: `meta/images/${name}`,
    content: createPlaceholderPng(size, size, PLACEHOLDER_COLOR),
  }));

  return [
    ...fixedSize,
    {
      path: 'meta/images/preview_0.png',
      content: createPlaceholderPng(PREVIEW_WIDTH, PREVIEW_HEIGHT, PLACEHOLDER_COLOR),
    },
  ];
}
