import type { HomeIntroContent } from './types';

export const DEFAULT_HOME_INTRO_TITLE =
  'Zuverlässiger Anbieter für Industriebedarf, Lagertechnik und Gebrauchtmaschinen in Deutschland';

export const getDefaultHomeIntroContent = (): HomeIntroContent => ({
  title: DEFAULT_HOME_INTRO_TITLE,
  lead:
    'Mit über 100.000 Produkten aus den Bereichen Industriebedarf, Automatisierungstechnik und Lagertechnik sind wir Ihr Komplettanbieter für alles, was Ihr Unternehmen benötigt. Bestellen Sie noch heute und profitieren Sie von einer schnellen, zuverlässigen Lieferung in ganz Deutschland und weltweit.',
});
