<template>
  <div class="flex items-center rounded-md border border-gray-200 overflow-hidden">
    <SfTooltip label="Mobile (375px)" placement="right" :show-arrow="true">
      <button
        data-testid="device-toggle-mobile"
        type="button"
        aria-label="Mobile (375px)"
        class="px-2 py-1.5 transition-colors"
        :class="currentDevice === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
        @click="setDevice('mobile')"
      >
        <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-current">
          <path
            d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"
          />
        </SfIconBase>
      </button>
    </SfTooltip>
    <SfTooltip label="Tablet (768px)" placement="right" :show-arrow="true">
      <button
        data-testid="device-toggle-tablet"
        type="button"
        aria-label="Tablet (768px)"
        class="px-2 py-1.5 transition-colors border-l border-gray-200"
        :class="currentDevice === 'tablet' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
        @click="setDevice('tablet')"
      >
        <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-current">
          <path
            d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5S10.67 20 11.5 20s1.5.67 1.5 1.5S12.33 23 11.5 23zm7.5-3H4V3h15v17z"
          />
        </SfIconBase>
      </button>
    </SfTooltip>
    <SfTooltip label="Desktop" placement="right" :show-arrow="true">
      <button
        data-testid="device-toggle-desktop"
        type="button"
        aria-label="Desktop"
        class="px-2 py-1.5 transition-colors border-l border-gray-200"
        :class="currentDevice === 'desktop' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
        @click="setDevice('desktop')"
      >
        <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-current">
          <path
            d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
          />
        </SfIconBase>
      </button>
    </SfTooltip>
  </div>
</template>

<script setup lang="ts">
import { SfIconBase, SfTooltip } from '@storefront-ui/vue';

const { device: currentDevice, setDevice } = useEditorDevice();
</script>
