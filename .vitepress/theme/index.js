import DefaultTheme from 'vitepress/theme'
import CustomHero from './CustomHero.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: CustomHero
}
