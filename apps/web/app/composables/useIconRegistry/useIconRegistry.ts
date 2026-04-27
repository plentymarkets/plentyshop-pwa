import { iconRegistry, type IconDefinition, type IconCategory } from './icons';

export function useIconRegistry() {
  const getIcon = (name: string): IconDefinition | undefined => iconRegistry[name];

  const getAllIcons = (): Array<{ name: string; icon: IconDefinition }> =>
    Object.entries(iconRegistry).map(([name, icon]) => ({ name, icon }));

  const getByCategory = (category: IconCategory) =>
    getAllIcons().filter(({ icon }) => icon.category === category);

  const getCategories = (): IconCategory[] => {
    const seen = new Set<IconCategory>();
    for (const { icon } of getAllIcons()) seen.add(icon.category);
    return [...seen];
  };

  const renderToSvgString = (name: string): string | null => {
    const icon = getIcon(name);
    if (!icon) return null;

    const paths = icon.paths.map((d) => `<path d="${d}"/>`).join('');
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" ` +
      `fill="currentColor" width="1em" height="1em" aria-hidden="true">${paths}</svg>`
    );
  };

  return {
    getIcon,
    getAllIcons,
    getByCategory,
    getCategories,
    renderToSvgString,
  };
}

export type { IconDefinition, IconCategory };
export { hydrateIcons } from './hydrateIcons';