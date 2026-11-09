import { EXTENSION_DIR_PREFIX } from './constants';

/** Splits `@scope/some-name` into its parts. */
export function parseExtensionName(name: string): { scope: string; slug: string } {
  const [scope, slug] = name.slice(1).split('/');
  return { scope, slug };
}

export const toPascalCase = (value: string): string =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

export const toCamelCase = (value: string): string => {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

/** Directory name of the extension below `packages/`, e.g. `module-four-seasons`. */
export function getExtensionDirName(name: string): string {
  return `${EXTENSION_DIR_PREFIX}${parseExtensionName(name).slug}`;
}
