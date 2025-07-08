import { v4 as uuid } from 'uuid';
import type { FooterSettings } from '~/components/blocks/Footer/types';
import { useI18n } from '#imports';

export function useFooterBlock(content?: FooterSettings | null) {
  const { t } = useI18n();
  const cachedFooter = useState<FooterSettings | null>('footer-block-cache', () => null);
  const resolvedContent = ref<FooterSettings | null>(content ?? null);
  let footerBlockPromise: Promise<void> | null = null;

  onMounted(async () => {
    if (!resolvedContent.value) {
      if (cachedFooter.value) {
        resolvedContent.value = cachedFooter.value;
        return;
      }
      if (!footerBlockPromise) {
        footerBlockPromise = (async () => {
          const { data, getBlocks } = useCategoryTemplate();
          await getBlocks('index', 'immutable', 'Footer');
          const footerBlock = data.value.find((block) => block.name === 'Footer');
          if (footerBlock) {
            cachedFooter.value = footerBlock.content as FooterSettings;
          } else {
            cachedFooter.value = {
              meta: {
                uuid: uuid(),
                isGlobalTemplate: true,
              },
              column1: { title: t('categories.legal.label') },
              column2: { title: t('categories.contact.label'), description: '', showContactLink: true },
              column3: { title: '', description: '' },
              column4: { title: '', description: '' },
              footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
              footnoteAlign: 'right',
              colors: {
                background: '#cfe4ec',
                text: '#1c1c1c',
                footnoteBackground: '#161a16',
                footnoteText: '#959795',
              },
            };
          }
        })();
      }
      await footerBlockPromise;
      resolvedContent.value = cachedFooter.value;
      footerBlockPromise = null;
    }
  });

  return { resolvedContent, cachedFooter };
}
