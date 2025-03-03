export const usePageMeta = () => {
  const { t } = useI18n();
  const route = useRoute();
  const pageMeta = useState('pageMeta', () => ({
    name: '',
    icon: '',
  }));

  watch(
    () => route.path,
    (newPath) => {
      if (newPath === '/de') {
        pageMeta.value.name = 'Starseite';
        pageMeta.value.icon = 'home';
        return;
      }

      let rawName = newPath.split('/').pop() || t('homepage.homepagetitle');

      const match = rawName.match(/[_-](\d+)$/);
      const number = match ? ` (${match[1]})` : '';

      rawName = rawName.replace(/[_-]\d+$/, '');

      pageMeta.value.name = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) + number;

      switch (newPath) {
        case '/':
          pageMeta.value.icon = 'home';
          break;
        default:
          pageMeta.value.icon = 'sell';
          break;
      }
    },
    { immediate: true },
  );

  return pageMeta;
};
