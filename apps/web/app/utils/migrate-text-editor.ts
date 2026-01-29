import type { TextCardContent } from '@/components/blocks/TextCard/types';

const hasOldStructure = (content: Partial<TextCardContent>): boolean => {
  if (!content.text) return false;

  const { pretitle, title, subtitle } = content.text;

  return !!(pretitle?.trim() || title?.trim() || subtitle?.trim());
};

const hasHtmlTags = (text: string): boolean => {
  if (!text) return false;
  return /<\/?[a-z][\s\S]*>/i.test(text);
};

const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
};

export const migrateTextCardContent = (content: Partial<TextCardContent>): Partial<TextCardContent> => {
  if (process.env?.ENABLE_RICH_TEXT_EDITOR_V2 === '1') return content;
  if (!hasOldStructure(content)) return content;

  const migrated = {
    ...content,
    text: { ...content.text },
  };

  if (!migrated.text) return migrated;

  const { pretitle, title, subtitle, htmlDescription } = migrated.text;
  const parts: string[] = [];

  if (pretitle?.trim()) {
    parts.push(`<h2>${escapeHtml(pretitle.trim())}</h2>`);
  }

  if (title?.trim()) {
    parts.push(`<h1>${escapeHtml(title.trim())}</h1>`);
  }

  if (subtitle?.trim()) {
    parts.push(`<h3>${escapeHtml(subtitle.trim())}</h3>`);
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
};
