<template>
  <div class="fixed inset-0 z-[600] flex items-center justify-center bg-black/40" @mousedown.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-gray-800">Insert Link</h2>
        <button
          type="button"
          class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          @click="$emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
            <path d="M256-200l-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>

      <div class="flex border-b border-gray-100 px-5 gap-1 pt-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="px-3 py-2 text-sm font-medium rounded-t transition-colors relative"
          :class="
            activeTab === tab.value
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-t'
              : 'text-gray-500 hover:text-gray-700'
          "
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="px-5 pt-4 pb-5 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Text</label>
          <input
            v-model="linkText"
            type="text"
            placeholder="Link text"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div v-if="activeTab === 'url'">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">
            URL link
          </label>
          <div class="relative">
            <input
              v-model="urlValue"
              type="url"
              placeholder="https://example.com"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <a
              v-if="urlValue"
              :href="urlValue"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
              </svg>
            </a>
          </div>
        </div>

        <div v-else-if="activeTab === 'static'">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Page</label>
          <div class="relative">
            <select
              v-model="staticPageValue"
              class="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="" disabled>Select a page…</option>
              <option v-for="(path, name) in paths" :key="name" :value="path">
                {{ formatPathName(name) }} — {{ path }}
              </option>
            </select>
            <svg
              class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z" />
            </svg>
          </div>

          <p v-if="staticPageValue" class="mt-1.5 text-xs text-gray-400">
            Resolves to: <span class="font-mono text-gray-600">{{ staticPageValue }}</span>
          </p>
        </div>

        <div v-else-if="activeTab === 'category'">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
          <EditorCategorySelect
            :model-value="categoryValue"
            :base-search-params="{}"
            @update:model-value="categoryValue = $event"
          />
        </div>

        <div v-if="activeTab !== 'category'" class="flex items-center justify-between pt-1">
          <span class="text-sm text-gray-700">Open in new window</span>
          <button
            type="button"
            role="switch"
            :aria-checked="openInNewWindow"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="openInNewWindow ? 'bg-blue-600' : 'bg-gray-200'"
            @click="openInNewWindow = !openInNewWindow"
          >
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
              :class="openInNewWindow ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          Add link
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/core';

const props = defineProps<{
  editor: Editor | null | undefined;
}>();

const emit = defineEmits<{
  close: [];
  apply: [payload: { text: string; href: string; target: string }];
}>();

const paths = {
  home: '/',
  category: '/',
  product: '/product/',
  cart: '/cart',
  wishlist: '/wishlist',
  checkout: '/checkout',
  guestLogin: '/guest/login',
  readonlyCheckout: '/readonly-checkout',
  search: '/search',
  account: '/my-account/personal-data',
  confirmation: '/confirmation',
  accountPersonalData: '/my-account/personal-data',
  accountBillingDetails: '/my-account/billing-details',
  accountShippingDetails: '/my-account/shipping-details',
  accountMyOrders: '/my-account/my-orders',
  accountMyWishlist: '/my-account/wishlist',
  accountReturns: '/my-account/returns',
  accountNewReturn: '/my-account/new-return',
  authResetPassword: '/reset-password',
  authResetPasswordSuccess: '/reset-password-success',
  authLogin: '/login',
  termsAndConditions: '/terms-and-conditions',
  cancellationRights: '/cancellation-rights',
  legalDisclosure: '/legal-disclosure',
  privacyPolicy: '/privacy-policy',
  shipping: '/shipping',
  cancellationForm: '/cancellation-form',
  declarationOfAccessibility: '/declaration-of-accessibility',
  contact: '/contact',
  register: '/register',
  globalItemCategory: '/editor-layout-item-category',
  globalItemDetails: '/editor-layout-item-details_0',
} as const;

type TabValue = 'url' | 'static' | 'category';

const tabs: { value: TabValue; label: string }[] = [
  { value: 'url', label: 'URL' },
  { value: 'static', label: 'Static page' },
  { value: 'category', label: 'Category' },
];

const activeTab = ref<TabValue>('url');

const urlValue = ref('');
const staticPageValue = ref('');
const categoryValue = ref<string | null>(null);
const openInNewWindow = ref(false);

const selectedText = computed(() => {
  if (!props.editor) return '';
  const { from, to } = props.editor.state.selection;
  return props.editor.state.doc.textBetween(from, to, ' ');
});

const linkText = ref(selectedText.value);

onMounted(() => {
  if (!props.editor) return;

  const attrs = props.editor.getAttributes('link');
  if (attrs.href) {
    urlValue.value = attrs.href;
    openInNewWindow.value = attrs.target === '_blank';
  }
});

const computedHref = computed(() => {
  if (activeTab.value === 'url') return urlValue.value.trim();
  if (activeTab.value === 'static') return staticPageValue.value;
  if (activeTab.value === 'category') return categoryValue.value ?? '';
  return '';
});

const canSubmit = computed(() => Boolean(computedHref.value));

const formatPathName = (name: string) =>
  name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const handleSubmit = () => {
  if (!canSubmit.value || !props.editor) return;

  const href = computedHref.value;
  const target = openInNewWindow.value ? '_blank' : '_self';
  const text = linkText.value.trim();

  const chain = props.editor.chain().focus();

  const { from, to } = props.editor.state.selection;
  const currentText = props.editor.state.doc.textBetween(from, to, ' ');

  if (text && text !== currentText) {
    chain.insertContent(`<a href="${href}" target="${target}">${text}</a>`);
  } else {
    chain.setLink({ href, target });
  }

  chain.run();

  emit('apply', { text, href, target });
  emit('close');
};
</script>
