<template>
  <Transition name="drawer-right" appear>
    <div
      class="flex-shrink-0 w-[420px] max-w-[92vw] min-w-[300px] bg-white shadow-[inset_0px_0px_20px_-20px_#111] z-editor-drawer flex flex-col h-full"
      data-testid="version-history-drawer"
    >
      <VersionHistoryHeader />
      <VersionHistoryFilters />
      <VersionHistoryList />
    </div>
  </Transition>
</template>

<style scoped>
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.drawer-right-enter-from {
  transform: translateX(100%);
}

.drawer-right-leave-to {
  transform: translateX(100%);
}
</style>
