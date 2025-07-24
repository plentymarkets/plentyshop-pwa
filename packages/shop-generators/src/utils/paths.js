import { join, resolve } from 'node:path';

/**
 * Path utilities for PlentyONE Shop generators
 */

/**
 * Gets the base path for the PlentyONE Shop PWA project
 * Assumes the generator is run from within the project
 */
export function getProjectBasePath() {
  // When run from packages/shop-generators, go up two levels to reach project root
  return resolve(process.cwd(), '../../');
}

/**
 * Gets the web app base path
 */
export function getWebAppPath() {
  return join(getProjectBasePath(), 'apps/web');
}

/**
 * Creates paths for component generation
 */
export function createComponentPaths(componentName) {
  const webAppPath = getWebAppPath();
  const componentDir = join(webAppPath, 'components', componentName);
  
  return {
    baseDir: componentDir,
    component: join(componentDir, `${componentName}.vue`),
    types: join(componentDir, 'types.ts'),
    index: join(componentDir, 'index.ts'),
    test: join(componentDir, '__tests__', `${componentName}.spec.ts`)
  };
}

/**
 * Creates paths for composable generation
 */
export function createComposablePaths(composableName) {
  const webAppPath = getWebAppPath();
  const composableDir = join(webAppPath, 'composables', composableName);
  
  return {
    baseDir: composableDir,
    composable: join(composableDir, `${composableName}.ts`),
    types: join(composableDir, 'types.ts'),
    index: join(composableDir, 'index.ts'),
    test: join(composableDir, '__tests__', `${composableName}.spec.ts`)
  };
}

/**
 * Creates paths for UI component generation
 */
export function createUIComponentPaths(componentName) {
  const webAppPath = getWebAppPath();
  const componentDir = join(webAppPath, 'components/ui', componentName);
  
  return {
    baseDir: componentDir,
    component: join(componentDir, `${componentName}.vue`),
    types: join(componentDir, 'types.ts'),
    index: join(componentDir, 'index.ts'),
    test: join(componentDir, '__tests__', `${componentName}.spec.ts`)
  };
}

/**
 * @todo Implement full structure
 * @todo Distinguish between individual settings and grouped categories
 * Creates paths for settings component generation
 */
export function createSettingsComponentPaths(categoryName, settingName) {
  const webAppPath = getWebAppPath();
  const componentDir = join(webAppPath, 'components/settings', categoryName, settingName);
  
  return {
    baseDir: componentDir,
    component: join(componentDir, `${settingName}.vue`),
    trigger: join(componentDir, 'ToolbarTrigger.vue'),
    types: join(componentDir, 'types.ts'),
    test: join(componentDir, '__tests__', `${settingName}.spec.ts`)
  };
}

/**
 * Creates paths for page generation
 */
export function createPagePaths(pageName, isDynamic = false) {
  const webAppPath = getWebAppPath();
  const fileName = isDynamic ? `[${pageName}].vue` : `${pageName}.vue`;
  
  return {
    page: join(webAppPath, 'pages', fileName)
  };
}
