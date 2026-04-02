import type { TextCardContent } from '@/components/blocks/TextCard/types';
import type { TextContentProps } from '../components/TextContent/types';

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

export const migrateTextCardContent = (
  content: Partial<TextCardContent>,
  isFirstTextContentBlock: boolean,
): Partial<TextCardContent> => {
  if (!hasOldStructure(content)) return content;

  const migrated = {
    ...content,
    text: { ...content.text },
  };

  if (!migrated.text) return migrated;

  const { pretitle, title, subtitle, htmlDescription } = migrated.text;
  const parts: string[] = [];

  if (pretitle?.trim()) {
    parts.push(`<p>${escapeHtml(pretitle.trim())}</p>`);
  }

  if (title?.trim()) {
    const titleTag = isFirstTextContentBlock ? 'h1' : 'h2';
    parts.push(`<${titleTag}>${escapeHtml(title.trim())}</${titleTag}>`);
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

export const mapToTextContentProps = (mapping: {
  pretitle?: string;
  title?: string;
  subtitle?: string;
  htmlDescription?: string;
  color?: string;
  textAlignment?: 'left' | 'center' | 'right';
  buttonLabel?: string;
  buttonLink?: string;
  buttonVariant?: 'primary' | 'secondary';
  index?: number;
}): TextContentProps => {
  const {
    pretitle,
    title,
    subtitle,
    htmlDescription,
    color,
    textAlignment,
    buttonLabel,
    buttonLink,
    buttonVariant,
    index,
  } = mapping;

  return {
    ...(index !== undefined && { index }),
    text: {
      pretitle,
      title,
      subtitle,
      htmlDescription,
      color,
      textAlignment,
    },
    button: {
      label: buttonLabel,
      link: buttonLink,
      variant: buttonVariant,
    },
  };
};
