<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData } from 'vitepress';

const { frontmatter, page, theme } = useData();

const isOpen = ref(false);
const isSuccess = ref(false);
const issueType = ref('');
const comment = ref('');
const selectedText = ref('');
const openedIssueUrl = ref('');
const submitError = ref('');
const commentTextarea = ref(null);
const MIN_COMMENT_LENGTH = 8;
const MAX_COMMENT_LENGTH = 1200;
const issueTypeDocumentationLabel = 'documentation';

let successTimer = null;

const issueTypeOptions = [
  { value: 'content', label: 'Wrong / Missing Content', labelTag: 'bug' },
  { value: 'suggestion', label: 'Suggestion', labelTag: 'feature' },
];

const issueTypeLabel = computed(
  () => issueTypeOptions.find((option) => option.value === issueType.value)?.labelTag || 'feedback',
);

const issueBaseUrl = computed(() => {
  const explicitUrl = theme.value?.feedback?.issuesUrl?.trim();
  if (explicitUrl) {
    return normalizeIssueUrl(explicitUrl);
  }

  const githubLink = theme.value?.socialLinks?.find((link) => link?.icon === 'github')?.link;

  if (!githubLink) {
    return '';
  }

  return normalizeIssueUrl(githubLink);
});

const isVisible = computed(() => frontmatter.value?.layout !== 'home' && Boolean(issueBaseUrl.value));

const canSubmit = computed(() => {
  const length = comment.value.trim().length;
  return issueType.value && length >= MIN_COMMENT_LENGTH && length <= MAX_COMMENT_LENGTH;
});

const isCommentTooShort = computed(() => {
  const length = comment.value.trim().length;
  return length > 0 && length < MIN_COMMENT_LENGTH;
});

const commentLength = computed(() => comment.value.length);

function normalizeIssueUrl(url) {
  const trimmed = url.replace(/\/$/, '');

  if (/\/issues\/new(\/)?$/.test(trimmed)) {
    return trimmed;
  }

  if (/\/issues$/.test(trimmed)) {
    return `${trimmed}/new`;
  }

  return `${trimmed}/issues/new`;
}

function updateSelection() {
  const selection = globalThis.getSelection();

  if (!selection || !selection.rangeCount) {
    return;
  }

  const anchorNode = selection.anchorNode;
  const anchorElement = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;

  if (anchorElement && !anchorElement.closest('.vp-doc')) {
    return;
  }

  const rawText = selection.toString().trim();
  if (rawText.length < 8) {
    return;
  }

  const compactText = rawText.replaceAll(/\s+/g, ' ');
  selectedText.value = compactText.length > 240 ? `${compactText.slice(0, 240)}…` : compactText;
}

function buildIssueBody() {
  const pageUrl = globalThis.location.href;

  const bodyParts = ['## Feedback', comment.value.trim(), '', '## Context', `- Page: ${pageUrl}`];

  if (selectedText.value) {
    bodyParts.push('', '## Selected text', `> ${selectedText.value}`);
  }

  return bodyParts.join('\n').trim();
}

function buildIssueUrl() {
  const issueTitle = `[docs][${issueTypeLabel.value}] ${page.value?.title || page.value?.relativePath || 'Feedback'}`;

  const params = new URLSearchParams();
  params.set('title', issueTitle);
  params.set('body', buildIssueBody());
  params.set('labels', `${issueTypeDocumentationLabel},${issueTypeLabel.value}`);

  return `${issueBaseUrl.value}?${params.toString()}`;
}

function closeWidget() {
  isOpen.value = false;
  isSuccess.value = false;
  submitError.value = '';
}

function openWidget() {
  isOpen.value = true;
  isSuccess.value = false;
  submitError.value = '';

  nextTick(() => {
    commentTextarea.value?.focus();
  });
}

function resetForm() {
  issueType.value = '';
  comment.value = '';
  selectedText.value = '';
  submitError.value = '';
}

function submitFeedback() {
  if (!canSubmit.value || !issueBaseUrl.value) {
    return;
  }

  const url = buildIssueUrl();
  const popup = globalThis.open(url, '_blank', 'noopener,noreferrer');

  if (!popup) {
    submitError.value = 'Popup blocked. Please allow popups and try again.';
    return;
  }

  openedIssueUrl.value = url;
  isSuccess.value = true;
  resetForm();

  if (successTimer) {
    globalThis.clearTimeout(successTimer);
  }

  successTimer = globalThis.setTimeout(() => {
    isSuccess.value = false;
    isOpen.value = false;
  }, 3200);
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    closeWidget();
  }
}

watch(
  () => page.value?.relativePath,
  () => {
    closeWidget();
    resetForm();
  },
);

onMounted(() => {
  document.addEventListener('selectionchange', updateSelection);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', updateSelection);
  document.removeEventListener('keydown', handleKeydown);
  if (successTimer) {
    globalThis.clearTimeout(successTimer);
  }
});
</script>

<template>
  <div v-if="isVisible" class="feedback-widget" aria-live="polite">
    <button v-if="!isOpen" type="button" class="feedback-trigger" aria-label="Open feedback form" @click="openWidget">
      <span>💬</span>
      <span>Feedback</span>
    </button>

    <dialog v-else open class="feedback-panel" aria-label="Submit feedback">
      <header class="feedback-panel__header">
        <h2>Submit feedback</h2>
        <div class="feedback-panel__actions">
          <button type="button" aria-label="Close" @click="closeWidget">×</button>
        </div>
      </header>

      <div v-if="!isSuccess" class="feedback-panel__content">
        <label>
          <span>Issue type</span>
          <select v-model="issueType">
            <option disabled value="">Select type...</option>
            <option v-for="option in issueTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>

        <label>
          <span>Comment</span>
          <textarea
            ref="commentTextarea"
            v-model="comment"
            rows="4"
            maxlength="1200"
            placeholder="Describe the issue or suggestion..."
            :aria-invalid="isCommentTooShort"
            aria-describedby="feedback-comment-help feedback-comment-count"
          />
          <span v-if="isCommentTooShort" id="feedback-comment-help">
            Please enter at least {{ MIN_COMMENT_LENGTH }} characters.
          </span>
          <span id="feedback-comment-count" class="feedback-comment-count">
            {{ commentLength }}/{{ MAX_COMMENT_LENGTH }}
          </span>
        </label>

        <div class="feedback-context" :class="{ 'is-active': selectedText }">
          <p>
            {{ selectedText || 'Select text on the page to attach more context.' }}
          </p>
        </div>

        <div class="feedback-footer">
          <span>GitHub account required</span>
          <span v-if="submitError" class="feedback-error">{{ submitError }}</span>
          <button type="button" :disabled="!canSubmit" @click="submitFeedback">Open issue on GitHub ↗</button>
        </div>
      </div>

      <div v-else class="feedback-success">
        <div class="feedback-success__icon">✓</div>
        <h3>Issue draft opened</h3>
        <p>You can now submit it on GitHub.</p>
        <a :href="openedIssueUrl" target="_blank" rel="noopener noreferrer">View draft ↗</a>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.feedback-widget {
  position: fixed;
  inset: auto 0.75rem 0.75rem auto;
  z-index: 35;
}

.feedback-trigger,
.feedback-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  box-shadow: 0 0.75rem 2.25rem rgb(0 0 0 / 18%);
}

.feedback-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font: 600 0.8125rem/1.2 inherit;
  cursor: pointer;
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.feedback-trigger:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-0.0625rem);
}

.feedback-panel {
  display: block;
  position: static;
  width: min(22rem, calc(100vw - 1.5rem));
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.feedback-panel :is(select, textarea, button) {
  font: inherit;
}

.feedback-panel__header,
.feedback-panel__content,
.feedback-footer,
.feedback-success {
  display: grid;
  gap: 0.5rem;
}

.feedback-panel__header {
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.feedback-panel__header h2,
.feedback-success h3,
.feedback-context p {
  margin: 0;
}

.feedback-panel__header h2 {
  font-size: 0.9375rem;
  font-weight: 600;
}

.feedback-panel__actions {
  display: inline-flex;
  gap: 0.25rem;
}

.feedback-panel__actions button {
  width: 1.75rem;
  height: 1.75rem;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.feedback-panel__actions button:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.feedback-panel__content,
.feedback-success {
  padding: 0.75rem;
}

.feedback-panel label,
.feedback-footer {
  display: grid;
  gap: 0.375rem;
}

.feedback-panel :is(label > span, .feedback-footer > span, .feedback-context p) {
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
}

.feedback-panel :is(select, textarea) {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8125rem;
  padding: 0.5rem 0.625rem;
}

.feedback-panel select {
  height: 2.25rem;
  padding-block: 0;
}
.feedback-panel textarea {
  min-height: 5.25rem;
  resize: vertical;
}

.feedback-context {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 0.375rem;
  background: var(--vp-c-bg);
  padding: 0.5rem 0.625rem;
}

.feedback-context.is-active {
  border-style: solid;
  border-color: var(--vp-c-brand-1);
}

.feedback-footer > span {
  font-size: 0.6875rem;
  text-align: center;
}

.feedback-footer button {
  height: 2.375rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  cursor: pointer;
}

.feedback-footer button:hover:not(:disabled) {
  filter: brightness(1.05);
}
.feedback-footer button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.feedback-success {
  text-align: center;
}

.feedback-success__icon {
  width: 2.75rem;
  height: 2.75rem;
  margin: 0 auto 0.125rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999rem;
  color: var(--vp-c-brand-1);
  font-weight: 700;
  display: grid;
  place-items: center;
}

.feedback-success p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
}
.feedback-success a {
  color: var(--vp-c-brand-1);
  font-size: 0.8125rem;
  font-weight: 600;
}

.feedback-trigger:focus-visible,
.feedback-panel :is(select, textarea, button):focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
</style>
