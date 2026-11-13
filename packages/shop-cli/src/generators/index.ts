/**
 * Generator loader for PlentyONE Shop generators
 */

import type { NodePlopAPI } from 'plop';
import type { PathResolver } from '../core';
import componentGenerator from './component';
import blockGenerator from './component/block';
import composableGenerator from './composable';
import extensionGenerator from './extension';

export default function (plop: NodePlopAPI, pathResolver: PathResolver): void {
  console.log('✅ Loading PlentyONE Shop generators...');

  componentGenerator(plop, pathResolver);
  console.log('🎉 Component generator loaded successfully!');

  blockGenerator(plop, pathResolver);
  console.log('🧱 Block generator loaded successfully!');

  composableGenerator(plop, pathResolver);
  console.log('⚡ Composables generator loaded successfully!');

  extensionGenerator(plop, pathResolver);
  console.log('📦 Extension generator loaded successfully!');
}
