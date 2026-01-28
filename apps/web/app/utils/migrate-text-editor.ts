import type { TextCardContent } from '@/components/blocks/TextCard/types';

function hasHtmlTags(text: string): boolean {
  if (!text) return false;
  return /<\/?[a-z][\s\S]*>/i.test(text);
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

function isOldFormat(content: Partial<TextCardContent>): boolean {
  if (!content.text) return false;

  const { pretitle, title, subtitle, htmlDescription } = content.text;
  const hasSeparateFields = !!(pretitle?.trim() || title?.trim() || subtitle?.trim());
  const descIsPlainOrEmpty = !htmlDescription?.trim() || !hasHtmlTags(htmlDescription);

  return hasSeparateFields && descIsPlainOrEmpty;
}

export function migrateTextCardContent(content: Partial<TextCardContent>): Partial<TextCardContent> {
  if (!isOldFormat(content)) {
    return content;
  }

  const migrated = {
    ...content,
    text: { ...content.text },
  };

  if (!migrated.text) return migrated;

  const { pretitle, title, subtitle, htmlDescription } = migrated.text;
  const parts: string[] = [];

  if (pretitle?.trim()) {
    parts.push(`<p class="pretitle"><strong>${escapeHtml(pretitle.trim())}</strong></p>`);
  }

  if (title?.trim()) {
    parts.push(`<h2 class="title">${escapeHtml(title.trim())}</h2>`);
  }

  if (subtitle?.trim()) {
    parts.push(`<p class="subtitle"><strong>${escapeHtml(subtitle.trim())}</strong></p>`);
  }

  if (htmlDescription?.trim()) {
    const desc = hasHtmlTags(htmlDescription) ? htmlDescription : `<p>${htmlDescription}</p>`;
    parts.push(desc);
  }

  migrated.text.htmlDescription = parts.join('\n');

  migrated.text.pretitle = '';
  migrated.text.title = '';
  migrated.text.subtitle = '';

  return migrated;
}
