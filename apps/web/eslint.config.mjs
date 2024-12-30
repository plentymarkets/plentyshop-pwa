import withNuxt from './.nuxt/eslint.config.mjs';
import { architecture } from "@vue-storefront/eslint-config";

export default withNuxt(
  architecture({
    maxComplexity: 10,
    maxDepth: 5,
    maxStatementsPerLine: 1,
    maxLines: 500,
    maxLinesPerFunction: 100,
    maxStatements: 15,
    maxNestedCallbacks: 3,
    maxParams: 4
  }),
  {
    rules: {
      // Custom rules TBD
    }
  }
);
