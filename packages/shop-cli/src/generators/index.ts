/**
 * Generator loader for PlentyONE Shop generators
 */

import type { NodePlopAPI } from 'plop';
import componentGenerator from './component';
import composableGenerator from './composable';

export default function (plop: NodePlopAPI): void {
  console.log('✅ Loading PlentyONE Shop generators...');

  componentGenerator(plop);
  console.log('🎉 Component generator loaded successfully!');

  composableGenerator(plop);
  console.log('⚡ Composables generator loaded successfully!');
}
