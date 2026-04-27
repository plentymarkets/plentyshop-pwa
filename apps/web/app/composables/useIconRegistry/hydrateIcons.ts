import { useIconRegistry } from './index';

export function hydrateIcons(root: HTMLElement | null | undefined) {
  if (!root) return;

  const { renderToSvgString } = useIconRegistry();
  const markers = root.querySelectorAll<HTMLElement>('span[data-icon]');

  markers.forEach((el) => {
    const name = el.getAttribute('data-icon');
    if (!name) return;

    if (el.querySelector('svg')) return;

    const svg = renderToSvgString(name);
    if (svg) el.innerHTML = svg;
  });
}