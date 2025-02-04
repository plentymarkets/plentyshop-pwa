export default defineNuxtPlugin(() => {
  const colors = {
    primary50:  { type: 'primary', weight: 50, rgb: '239 246 255' },
    primary100: { type: 'primary', weight: 100, rgb: '219 234 254' },
    primary200: { type: 'primary', weight: 200, rgb: '191 219 254' },
    primary300: { type: 'primary', weight: 300, rgb: '147 197 253' },
    primary400: { type: 'primary', weight: 400, rgb: '96 165 250' },
    primary500: { type: 'primary', weight: 500, rgb: '59 130 246' },
    primary600: { type: 'primary', weight: 600, rgb: '37 99 35' },
    primary700: { type: 'primary', weight: 700, rgb: '29 78 16' },
    primary800: { type: 'primary', weight: 800, rgb: '30 64, 75' },
    primary900: { type: 'primary', weight: 900, rgb: '30 58 38' },
    secondary50:  { type: 'secondary', weight: 50, rgb: '238 242 255' },
    secondary100: { type: 'secondary', weight: 100, rgb: '224 231 255' },
    secondary200: { type: 'secondary', weight: 200, rgb: '199 210 254' },
    secondary300: { type: 'secondary', weight: 300, rgb: '165 180 252' },
    secondary400: { type: 'secondary', weight: 400, rgb: '129 140 248' },
    secondary500: { type: 'secondary', weight: 500, rgb: '99 102 241' },
    secondary600: { type: 'secondary', weight: 600, rgb: '79 70 29' },
    secondary700: { type: 'secondary', weight: 700, rgb: '67 56 02' },
    secondary800: { type: 'secondary', weight: 800, rgb: '55 48 63' },
    secondary900: { type: 'secondary', weight: 900, rgb: '49 46 29' },
  }
  

  if (process.server) {
    const styleString = Object.entries(colors).reduce((acc, [key, val]) => {
      return acc + `--colors-2-${val.type}-${val.weight}: ${val.rgb};`
    }, '')
    

    useHead({
      style: [
        {
          children: `:root { ${styleString} }`,
          type: 'text/css',
        }
      ]
    })
  }
})
