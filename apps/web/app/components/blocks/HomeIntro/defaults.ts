import type { HomeIntroContent } from './types';

export const DEFAULT_HOME_INTRO_TITLE =
  'Zuverlässiger Anbieter für Industriebedarf, Lagertechnik und Gebrauchtmaschinen in Deutschland';

export const getDefaultHomeIntroContent = (): HomeIntroContent => ({
  title: DEFAULT_HOME_INTRO_TITLE,
  lead:
    'Mit über 100.000 Produkten aus den Bereichen Industriebedarf, Automatisierungstechnik und Lagertechnik sind wir Ihr Komplettanbieter für alles, was Ihr Unternehmen benötigt. Bestellen Sie noch heute und profitieren Sie von einer schnellen, zuverlässigen Lieferung in ganz Deutschland und weltweit.',
  about:
    'Komplett Konzept ist seit 1997 tätig und unterstützt Unternehmen bei der Anlagenverwertung, bei Betriebsschließungen sowie beim Abbau und Wiederaufbau komplexer Industrieanlagen. Ob Sie Automatisierungstechnik oder komplette Lagertechniksysteme benötigen – wir bieten alles aus einer Hand. Unser Team beschafft und verkauft zudem Gebrauchtmaschinen zu fairen Preisen. Für jede Art von Industriebedarf sorgt unser engagiertes Logistikteam für eine flexible Abholung und Lieferung sowohl von Einzelteilen als auch von kompletten Anlagen – deutschlandweit und weltweit. Nehmen Sie Kontakt mit uns auf, wir sind für Sie da.',
});
