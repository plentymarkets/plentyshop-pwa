<template>
  <div class="flex-1 overflow-y-auto py-2" data-testid="version-history-list">
    <div v-if="loading" class="py-16 flex justify-center">
      <SfLoaderCircular class="animate-spin w-6 h-6 text-editor-button" />
    </div>
    <template v-else-if="groupedSnapshots.length">
      <div v-for="group in groupedSnapshots" :key="group.label">
        <div
          class="sticky top-0 bg-white px-6 pt-3.5 pb-1.5 text-2xs font-bold tracking-wider uppercase text-editor-text-muted"
        >
          {{ group.label }}
        </div>
        <div
          v-for="snapshot in group.items"
          :key="snapshot.id"
          class="flex items-center gap-3 px-6 py-2.5 mx-1.5 rounded-lg hover:bg-editor-surface"
          :data-testid="`version-history-item-${snapshot.id}`"
        >
          <span class="w-2 h-2 rounded-full flex-none" :class="isToday(snapshot) ? 'bg-success-500' : 'bg-gray-200'" />
          <div class="flex-1 min-w-0">
            <span class="text-sm font-semibold text-editor-text-strong break-words">{{ versionName(snapshot) }}</span>
            <div class="text-xs text-editor-text-muted mt-0.5 break-words">{{ subtitleFor(snapshot) }}</div>
          </div>
          <button
            type="button"
            class="flex-none px-3 py-1.5 rounded-md border border-editor-border bg-white text-xs font-semibold text-editor-text-default hover:border-editor-button hover:text-editor-button"
            :data-testid="`version-history-restore-${snapshot.id}`"
            @click="requestRestore(snapshot.id)"
          >
            {{ getEditorTranslation('restore') }}
          </button>
        </div>
      </div>
      <div v-if="hasMore" class="py-4 flex justify-center">
        <button
          type="button"
          class="px-3 py-1.5 rounded-md border border-editor-border bg-white text-xs font-semibold text-editor-text-default hover:border-editor-button hover:text-editor-button disabled:opacity-50"
          data-testid="version-history-load-more"
          :aria-label="getEditorTranslation('load-more')"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <SfLoaderCircular v-if="loadingMore" class="animate-spin w-4 h-4 text-editor-button" />
          <template v-else>{{ getEditorTranslation('load-more') }}</template>
        </button>
      </div>
    </template>
    <div v-else class="py-16 px-6 text-center text-sm text-editor-text-muted">
      {{ getEditorTranslation('no-results') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { BlockSnapshot } from '@plentymarkets/shop-api';
import { getSnapshotVersionName } from '~/utils/snapshotLabelHelper';

const ENTITY_TYPE_LABEL: Record<string, string> = {
  immutable: getEditorTranslation('entity-immutable'),
  category: getEditorTranslation('entity-category'),
  product: getEditorTranslation('entity-product'),
};

const { loading, loadingMore, hasMore, groupedSnapshots, requestRestore, loadMore } = useBlockSnapshots();

const entityTypeFor = (snapshot: BlockSnapshot): string =>
  ENTITY_TYPE_LABEL[snapshot.snapshotableType] || snapshot.snapshotableType;

const versionName = (snapshot: BlockSnapshot): string => getSnapshotVersionName(snapshot);

const subtitleFor = (snapshot: BlockSnapshot): string => `${entityTypeFor(snapshot)} · #${snapshot.id}`;

const isToday = (snapshot: BlockSnapshot): boolean => {
  const created = new Date(snapshot.createdAt);
  const now = new Date();
  return (
    created.getFullYear() === now.getFullYear() &&
    created.getMonth() === now.getMonth() &&
    created.getDate() === now.getDate()
  );
};
</script>

<i18n lang="json">
{
  "en": {
    "restore": "Restore",
    "no-results": "No versions found in this date range.",
    "load-more": "Load more",
    "entity-immutable": "Homepage",
    "entity-category": "Category page",
    "entity-product": "Product page"
  },
  "de": {
    "restore": "Restore",
    "no-results": "No versions found in this date range.",
    "load-more": "Load more",
    "entity-immutable": "Homepage",
    "entity-category": "Category page",
    "entity-product": "Product page"
  }
}
</i18n>
