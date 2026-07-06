import type { DirectiveBinding, ObjectDirective } from 'vue';
import { ISOLATE_LAYERS, Z_LAYERS } from './z-layer.constants';
import type { ZLayerName, ZLayerValue } from './z-layer.types';

function applyZLayer(el: HTMLElement, binding: DirectiveBinding<ZLayerValue>) {
  const value = binding.value;
  if (!value) return;

  let layerName: ZLayerName;
  let isolateOverride: boolean | undefined;

  if (typeof value === 'string') {
    layerName = value;
  } else {
    layerName = value.layer;
    isolateOverride = value.isolate;
  }

  const zIndex = Z_LAYERS[layerName];
  if (zIndex === undefined) {
    console.warn(`[v-z-layer] Unknown layer: "${layerName}". Valid layers: ${Object.keys(Z_LAYERS).join(', ')}`);
    return;
  }

  el.style.zIndex = String(zIndex);

  // Ensure element is positioned (z-index requires it)
  const position = getComputedStyle(el).position;
  if (position === 'static') {
    el.style.position = 'relative';
  }

  // Apply isolation based on layer rules or explicit override
  const shouldIsolate = isolateOverride ?? ISOLATE_LAYERS.has(layerName);
  if (shouldIsolate) {
    el.style.isolation = 'isolate';
  } else {
    el.style.isolation = '';
  }
}

export const vZLayer: ObjectDirective<HTMLElement, ZLayerValue> = {
  mounted(el, binding) {
    applyZLayer(el, binding);
  },
  updated(el, binding) {
    applyZLayer(el, binding);
  },
};
