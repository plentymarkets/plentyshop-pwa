/**
 * Generator loader for PlentyONE Shop generators
 */

import type { NodePlopAPI } from 'plop';
import componentGenerator from './component';

export default function (plop: NodePlopAPI): void {
  console.log('✅ Loading PlentyONE Shop generators...');

  // Load component generator (Task 2.1)
  componentGenerator(plop);

  console.log('🎉 Component generator loaded successfully!');

  // Future generators will be loaded here:
  // - UI Component generator (Task 2.2)
  // - Settings Component generator (Task 2.3)
  // - Composables generator (Task 3.1)
  // - Pages generator (Task 3.2)
  // - Block Component generator (Task 3.3)
}
