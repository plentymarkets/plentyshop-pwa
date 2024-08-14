<template>
  <div class="w-full">
    <div class="flex justify-center w-full">
      <slot name="above"></slot>
    </div>

    <div class="flex items-center justify-center w-full my-2">
      <div class="border-t-2 flex-grow"></div>
      <p class="px-2 text-sm uppercase text-gray-400">{{ $t('or') }}</p>
      <div class="border-t-2 flex-grow"></div>
    </div>

    <div class="flex justify-center w-full">
      <slot name="below"></slot>
    </div>
  </div>
</template>
