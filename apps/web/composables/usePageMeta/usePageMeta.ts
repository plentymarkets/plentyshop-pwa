export const usePageMeta = () => {
  const route = useRoute();
  const pageMeta = useState('pageMeta', () => ({
    name: '',
  }));

  watchEffect(() => {
    if (route.path === '/de') {
      pageMeta.value.name = 'Startseite';
      return;
    }

    let rawName = route.path.split('/').pop() || 'Homepage';

    const match = rawName.match(/[_-](\d+)$/);
    const number = match ? ` (${match[1]})` : '';

    rawName = rawName.replace(/[_-]\d+$/, '');

    pageMeta.value.name = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) + number;
  });

  return pageMeta;
};
