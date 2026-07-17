import { filterEmojis, getIconCategories, getIconsByCategory } from '../utils/iconEmojiPickerUtils';
import { userIcons } from '../utils/icons';

vi.mock('@tiptap/extension-emoji', () => ({
  emojis: [
    {
      emoji: '😀',
      name: 'grinning',
      shortcodes: ['smiley'],
      tags: ['happy'],
      group: 'smileys',
      emoticons: [],
      version: 1,
    },
    { emoji: '😢', name: 'weep', shortcodes: ['cry'], tags: ['sad'], group: 'smileys', emoticons: [], version: 1 },
    {
      emoji: '🐶',
      name: 'canine',
      shortcodes: ['pooch'],
      tags: ['animal'],
      group: 'animals',
      emoticons: [],
      version: 1,
    },
    { emoji: '', name: 'empty', shortcodes: [], tags: [], group: '', emoticons: [], version: 0 },
  ],
}));

describe('filterEmojis', () => {
  it('should return all valid emojis when query is empty', () => {
    const result = filterEmojis('');

    expect(result).toHaveLength(3);
  });

  it('should return all valid emojis when query is whitespace only', () => {
    const result = filterEmojis('   ');

    expect(result).toHaveLength(3);
  });

  it('should filter by name', () => {
    const result = filterEmojis('grinning');

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(expect.objectContaining({ emoji: '😀' }));
  });

  it('should filter by shortcode', () => {
    const result = filterEmojis('smiley');

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(expect.objectContaining({ emoji: '😀' }));
  });

  it('should filter by tag', () => {
    const result = filterEmojis('animal');

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(expect.objectContaining({ emoji: '🐶' }));
  });

  it('should match case-insensitively', () => {
    const result = filterEmojis('HAPPY');

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(expect.objectContaining({ emoji: '😀' }));
  });

  it('should return empty array when no emoji matches', () => {
    const result = filterEmojis('xyznotexist');

    expect(result).toHaveLength(0);
  });

  it('should exclude emojis without an emoji character', () => {
    const result = filterEmojis('empty');

    expect(result).toHaveLength(0);
  });
});

describe('getIconCategories', () => {
  it('should return unique categories', () => {
    const categories = getIconCategories();
    const unique = [...new Set(categories)];

    expect(categories).toEqual(unique);
  });

  it('should only return valid UserIconCategory values', () => {
    const validCategories: string[] = ['social', 'utility'];
    const categories = getIconCategories();

    categories.forEach((c) => expect(validCategories).toContain(c));
  });
});

describe('getIconsByCategory', () => {
  it('should return only icons matching the given category', () => {
    const results = getIconsByCategory('utility');

    results.forEach(({ icon }) => expect(icon.category).toBe('utility'));
  });

  it('should return all icons for the given category', () => {
    const expected = Object.entries(userIcons).filter(([, icon]) => icon.category === 'utility');
    const results = getIconsByCategory('utility');

    expect(results).toHaveLength(expected.length);
  });

  it('should return each icon with its name', () => {
    const results = getIconsByCategory('utility');

    results.forEach(({ name, icon }) => {
      expect(userIcons[name]).toBeDefined();
      expect(icon).toEqual(userIcons[name]);
    });
  });

  it('should return only icons matching the social category', () => {
    const expected = Object.entries(userIcons).filter(([, icon]) => icon.category === 'social');
    const results = getIconsByCategory('social');

    expect(results).toHaveLength(expected.length);
    results.forEach(({ icon }) => expect(icon.category).toBe('social'));
  });
});
