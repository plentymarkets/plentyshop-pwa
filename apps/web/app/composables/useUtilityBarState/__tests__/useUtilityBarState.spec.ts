import { describe, expect, it } from 'vitest';

import { useUtilityBarState } from '../useUtilityBarState';

describe('useUtilityBarState', () => {
  it('should initialize with default content', () => {
    const { content, paddingStyles, orderedVisibleSections, orderedActions, isFullSearchMode } =
      useUtilityBarState('utility-defaults');

    expect(content.value.layout).toEqual({
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
    });
    expect(content.value.sectionOrder?.sections).toEqual(['logo', 'search', 'actions']);
    expect(content.value.actions?.order).toEqual(['language', 'wishlist', 'cart', 'account']);
    expect(paddingStyles.value).toEqual({
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '40px',
      paddingRight: '40px',
    });
    expect(orderedVisibleSections.value).toEqual([
      { sectionId: 'logo', order: 0 },
      { sectionId: 'search', order: 1 },
      { sectionId: 'actions', order: 2 },
    ]);
    expect(orderedActions.value).toEqual([
      { actionId: 'language', order: 0 },
      { actionId: 'wishlist', order: 1 },
      { actionId: 'cart', order: 2 },
      { actionId: 'account', order: 3 },
    ]);
    expect(isFullSearchMode.value).toBe(true);
  });

  it('should merge partial content with defaults when setContent is called', () => {
    const { content, setContent } = useUtilityBarState('utility-merge');

    setContent({
      layout: { paddingTop: 0 },
      sectionOrder: { sections: ['actions', 'logo', 'search'] },
      sectionVisibility: { logo: false, search: true, actions: true },
      search: { displayMode: 'icon-only' },
      actions: {
        order: ['cart', 'account', 'language', 'wishlist'],
        visibility: {
          language: true,
          wishlist: false,
          cart: true,
          account: true,
        },
      },
    });

    expect(content.value.layout).toEqual({
      paddingTop: 0,
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
    });
    expect(content.value.sectionOrder?.sections).toEqual(['actions', 'logo', 'search']);
    expect(content.value.sectionVisibility).toEqual({
      logo: false,
      search: true,
      actions: true,
    });
    expect(content.value.search?.displayMode).toBe('icon-only');
    expect(content.value.actions?.order).toEqual(['cart', 'account', 'language', 'wishlist']);
    expect(content.value.actions?.visibility).toEqual({
      language: true,
      wishlist: false,
      cart: true,
      account: true,
    });
  });

  it('should provide section order and visibility helpers based on current state', () => {
    const { setContent, orderedVisibleSections, getSectionFlexOrder, isSectionVisible } =
      useUtilityBarState('utility-sections');

    setContent({
      sectionOrder: { sections: ['search', 'logo', 'actions'] },
      sectionVisibility: { logo: false, search: true, actions: true },
    });

    expect(orderedVisibleSections.value).toEqual([
      { sectionId: 'search', order: 0 },
      { sectionId: 'actions', order: 1 },
    ]);
    expect(getSectionFlexOrder('search')).toBe(0);
    expect(getSectionFlexOrder('actions')).toBe(1);
    expect(getSectionFlexOrder('logo')).toBe(999);
    expect(isSectionVisible('search')).toBe(true);
    expect(isSectionVisible('logo')).toBe(false);
  });

  it('should update section order and visibility when sections computed setter is used', () => {
    const { sections, content } = useUtilityBarState('utility-sections-setter');

    sections.value = [
      { id: 'actions', name: 'UtilityBarActions', visible: true },
      { id: 'logo', name: 'UtilityBarLogo', visible: false },
      { id: 'search', name: 'UtilityBarSearch', visible: true },
    ];

    expect(content.value.sectionOrder?.sections).toEqual(['actions', 'logo', 'search']);
    expect(content.value.sectionVisibility).toEqual({
      logo: false,
      search: true,
      actions: true,
    });
  });

  it('should provide action order and visibility helpers based on current state', () => {
    const { setContent, orderedActions, isActionVisible, getActionOrder } = useUtilityBarState('utility-actions');

    setContent({
      actions: {
        order: ['account', 'cart', 'wishlist', 'language'],
        visibility: {
          account: true,
          cart: false,
          wishlist: true,
          language: true,
        },
      },
    });

    expect(orderedActions.value).toEqual([
      { actionId: 'account', order: 0 },
      { actionId: 'wishlist', order: 1 },
      { actionId: 'language', order: 2 },
    ]);
    expect(isActionVisible('account')).toBe(true);
    expect(isActionVisible('cart')).toBe(false);
    expect(getActionOrder('wishlist')).toBe(1);
    expect(getActionOrder('cart')).toBe(999);
  });

  it('should keep state isolated across different uuid keys', () => {
    const first = useUtilityBarState('utility-isolated-1');
    const second = useUtilityBarState('utility-isolated-2');

    first.setContent({ search: { displayMode: 'icon-only' } });

    expect(first.content.value.search?.displayMode).toBe('icon-only');
    expect(second.content.value.search?.displayMode).toBe('full');
  });
});
