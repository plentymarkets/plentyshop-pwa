describe('slugless product route localization', () => {
  afterEach(async () => {
    await useNuxtApp().$i18n.setLocale('en');
    await useRouter().push('/');
  });

  it('should build a localized link for a slugless product path', async () => {
    const { $i18n } = useNuxtApp();
    const localePath = useLocalizedPath();

    expect(localePath('/a-42')).toBe('/a-42');

    await $i18n.setLocale('de');

    expect(localePath('/a-42')).toBe('/de/a-42');
  });

  it('should keep building localized links for slugged product paths', async () => {
    const { $i18n } = useNuxtApp();
    const localePath = useLocalizedPath();

    await $i18n.setLocale('de');

    expect(localePath('/shirt/a-42')).toBe('/de/shirt/a-42');
    expect(localePath('/shirt_42_7')).toBe('/de/shirt_42_7');
  });

  it('should switch the language on a slugless product page', async () => {
    const switchLocalePath = useSwitchLocalePath();

    await useRouter().push('/a-42');

    expect(switchLocalePath('de')).toBe('/de/a-42');
    expect(switchLocalePath('en')).toBe('/a-42');
  });

  it('should switch the language on a slugged product page', async () => {
    const switchLocalePath = useSwitchLocalePath();

    await useRouter().push('/shirt/a-42');

    expect(decodeLocalizedPathSlashes(switchLocalePath('de'), '/shirt/a-42')).toBe('/de/shirt/a-42');
  });
});
