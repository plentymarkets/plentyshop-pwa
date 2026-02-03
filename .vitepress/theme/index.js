import DefaultTheme from "vitepress/theme";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import CustomHero from "./CustomHero.vue";
import StackBlitzDemo from "./components/StackBlitzDemo.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app);
    app.component("StackBlitzDemo", StackBlitzDemo);
  },
  Layout: CustomHero,
};
