export const usePageMeta = () => {
  // const { t } = useI18n();
  // const route = useRoute();


  const pageMeta = useState('pageMeta', () => ({
    name: '',
    icon: '',
  }));

  // const newPageMeta = useState('newPageMeta', () => ({
  //   name: '',
  //   icon: '',
  // }));

  const setPageMeta = (name: string, icon: string) => {
    pageMeta.value.name = name;
    pageMeta.value.icon = icon;

  };

  // watch(
  //   () => route.path,
  //   (newPath) => {
  //     let rawName = newPath.split('/').pop() || t('homepage.homepagetitle');

  //     const match = rawName.match(/[_-](\d+)$/);
  //     const number = match ? ` (${match[1]})` : '';

  //     rawName = rawName.replace(/[_-]\d+$/, '');

  //     pageMeta.value.name = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) + number;

  //     switch (newPath) {
  //       case '/':
  //         pageMeta.value.name = 'Homepage';
  //         pageMeta.value.icon = 'home';
  //         break;
  //       case '/de':
  //         pageMeta.value.name = 'Startseite';
  //         pageMeta.value.icon = 'home';
  //         break;
  //       case '/de/shipping':
  //         pageMeta.value.name = 'Versand';
  //         break;
  //       case '/de/checkout':
  //         pageMeta.value.name = 'Kasse';
  //         break;
  //       default:
  //         pageMeta.value.icon = 'sell';
  //         break;
  //     }
  //   },
  //   { immediate: true },
  // );

 // return {newPageMeta, setNewPageMeta, pageMeta};
 return {setPageMeta, pageMeta}
};
