export type GridSettings = { mobile?: number | null; tablet?: number | null; desktop?: number | null }

const BASE = [
  'grid-cols-1','grid-cols-2','grid-cols-3','grid-cols-4','grid-cols-5','grid-cols-6',
  'grid-cols-7','grid-cols-8','grid-cols-9','grid-cols-10','grid-cols-11','grid-cols-12'
];

const MD = [
  'md:grid-cols-1','md:grid-cols-2','md:grid-cols-3','md:grid-cols-4','md:grid-cols-5','md:grid-cols-6',
  'md:grid-cols-7','md:grid-cols-8','md:grid-cols-9','md:grid-cols-10','md:grid-cols-11','md:grid-cols-12'
];

const LG = [
  'lg:grid-cols-1','lg:grid-cols-2','lg:grid-cols-3','lg:grid-cols-4','lg:grid-cols-5','lg:grid-cols-6',
  'lg:grid-cols-7','lg:grid-cols-8','lg:grid-cols-9','lg:grid-cols-10','lg:grid-cols-11','lg:grid-cols-12'
];

const colBase = Object.fromEntries(BASE.map((c, i) => [i + 1, c])) as Record<number, (typeof BASE)[number]>
const colMd = Object.fromEntries(MD.map((c, i) => [i + 1, c])) as Record<number, (typeof MD)[number]>
const colLg = Object.fromEntries(LG.map((c, i) => [i + 1, c])) as Record<number, (typeof LG)[number]>

export function gridClassFor(settings: GridSettings, extras: string[] = []) {
  const mobile = settings.mobile || 1
  const tablet = settings.tablet || 2
  const desktop = settings.desktop || 3
  return [
    'grid',
    ...extras,
    colBase[mobile],
    colMd[tablet],
    colLg[desktop],
  ]
}
