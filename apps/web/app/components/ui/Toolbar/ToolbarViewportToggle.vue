<template>
  <div class="flex items-center space-x-0.5 bg-gray-100 rounded-md p-1">
    <SfTooltip label="Desktop" placement="bottom" :show-arrow="true">
      <button
        class="p-1.5 rounded transition-colors"
        :class="device === 'desktop' ? 'bg-white shadow-sm text-[#062633]' : 'text-gray-400 hover:text-gray-600'"
        data-testid="viewport-desktop"
        @click="setDevice('desktop')"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path
            d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
          />
        </svg>
      </button>
    </SfTooltip>

    <SfTooltip label="Tablet" placement="bottom" :show-arrow="true">
      <button
        class="p-1.5 rounded transition-colors"
        :class="device === 'tablet' ? 'bg-white shadow-sm text-[#062633]' : 'text-gray-400 hover:text-gray-600'"
        data-testid="viewport-tablet"
        @click="setDevice('tablet')"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path
            d="M18.5 0h-13C4.1 0 3 1.1 3 2.5v19C3 22.9 4.1 24 5.5 24h13c1.4 0 2.5-1.1 2.5-2.5v-19C21 1.1 19.9 0 18.5 0zm-6.5 23c-.83 0-1.5-.67-1.5-1.5S11.17 20 12 20s1.5.67 1.5 1.5S12.83 23 12 23zm6.5-4H5.5V3h13v16z"
          />
        </svg>
      </button>
    </SfTooltip>

    <SfTooltip label="Mobile" placement="bottom" :show-arrow="true">
      <button
        class="p-1.5 rounded transition-colors"
        :class="device === 'mobile' ? 'bg-white shadow-sm text-[#062633]' : 'text-gray-400 hover:text-gray-600'"
        data-testid="viewport-mobile"
        @click="setDevice('mobile')"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path
            d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"
          />
        </svg>
      </button>
    </SfTooltip>
  </div>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

const { device, setDevice } = useEditorPreview();
</script>
