import { emojis } from '@tiptap/extension-emoji';
import { userIcons } from './icons';
import type { UserIconCategory } from './icons';

export const getIconCategories = (): UserIconCategory[] => {
  const seen = new Set<UserIconCategory>();
  for (const icon of Object.values(userIcons)) {
    seen.add(icon.category);
  }
  return [...seen];
};

export const getIconsByCategory = (category: UserIconCategory) =>
  Object.entries(userIcons)
    .filter(([_name, icon]) => icon.category === category)
    .map(([name, icon]) => ({ name, icon }));

export const filterEmojis = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return emojis.filter((e) => e.emoji);
  return emojis.filter((e) => {
    if (!e.emoji) return false;
    if (e.name.toLowerCase().includes(normalized)) return true;
    if (e.shortcodes?.some((s) => s.toLowerCase().includes(normalized))) return true;
    if (e.tags?.some((t) => t.toLowerCase().includes(normalized))) return true;
    return false;
  });
};
