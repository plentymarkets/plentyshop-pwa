<template>
  <div role="status" class="flex w-full mt-6 items-center flex-col animate-pulse sm:flex-row">
    <div
      class="flex items-center justify-center w-40 h-40 flex-shrink-0 bg-gray-300 text-gray-600 rounded-sm mr-4 mb-2"
    >
      <svg
        class="w-10 h-10"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 18"
      >
        <path
          d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
        />
      </svg>
    </div>
    <div class="w-full flex flex-col items-center sm:items-start">
      <div class="h-8 bg-gray-300 rounded-sm w-full"></div>
      <div class="h-8 bg-gray-300 rounded-sm w-[140px] mt-2"></div>
      <div class="h-4 bg-gray-300 rounded-sm w-11/12 mt-2"></div>
      <div class="h-4 bg-gray-300 rounded-sm w-7/12 mt-1"></div>
      <div class="h-8 bg-gray-300 rounded-sm w-[150px] mt-2"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>
