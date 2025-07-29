/**
 * Generator loader for PlentyONE Shop generators
 */

import type { NodePlopAPI } from 'plop';
import componentGenerator from './component';
import uiComponentGenerator from './ui-component';

export default function (plop: NodePlopAPI): void {
  console.log('✅ Loading PlentyONE Shop generators...');

  // Load component generator (Task 2.1)
  componentGenerator(plop);
  console.log('🎉 Component generator loaded successfully!');

  // Load UI component generator (Task 2.2)
  uiComponentGenerator(plop);
  console.log('🎨 UI Component generator loaded successfully!');

  // Future generators will be loaded here:
  // - Settings Component generator (Task 2.3)
  // - Composables generator (Task 3.1)
  // - Pages generator (Task 3.2)
  // - Block Component generator (Task 3.3)
}
