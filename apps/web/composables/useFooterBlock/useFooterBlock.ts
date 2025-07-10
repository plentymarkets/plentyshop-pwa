import { v4 as uuid } from 'uuid';
import { callOnce } from '#app';
import type { FooterSettings } from '~/components/blocks/Footer/types';
import type { FooterColumn } from '~/composables/useFooterBlock/types';

export function useFooterBlock(content?: FooterSettings | null) {
  const { t } = useI18n();
  const cachedFooter = useState<FooterSettings | null>('footer-block-cache', () => null);
  const resolvedContent = ref<FooterSettings | null>(content ?? null);
  let footerBlockPromise: Promise<void> | null = null;

  async function fetchFooterBlock(callOnceMode = true) {
    const { data, getBlocks } = useCategoryTemplate('footer-block');
    if (callOnceMode) {
      await callOnce(() => getBlocks('index', 'immutable', 'Footer'));
    } else {
      await getBlocks('index', 'immutable', 'Footer');
    }
    const footerBlock = data.value.find((block) => block.name === 'Footer');

    const normalizeColumn = (col: FooterColumn | undefined) => {
      if (!col) return { title: '', description: '', showContactLink: false };
      if ('text' in col && col.text) {
        const { title, description, showContactLink, showLinkToContact, ...restText } = col.text as Record<
          string,
          unknown
        >;
        return {
          ...col,
          ...restText,
          title: (title as string) || col.title || '',
          description: (description as string) || col.description || '',
          showContactLink: Boolean(
            showContactLink || showLinkToContact || col.showContactLink || col.showLinkToContact,
          ),
        };
      }
      return {
        ...col,
        title: col.title || '',
        description: col.description || '',
        showContactLink: Boolean(col.showContactLink || col.showLinkToContact),
      };
    };

    if (footerBlock && footerBlock.content) {
      const content = footerBlock.content as FooterSettings;
      cachedFooter.value = {
        ...content,
        column1: normalizeColumn(content.column1),
        column2: { ...normalizeColumn(content.column2), showContactLink: true },
        column3: normalizeColumn(content.column3),
        column4: normalizeColumn(content.column4),
      } as FooterSettings;
    } else {
      cachedFooter.value = {
        meta: {
          uuid: uuid(),
          isGlobalTemplate: true,
        },
        column1: normalizeColumn({ title: t('categories.legal.label') }),
        column2: normalizeColumn({ title: t('categories.contact.label'), description: '', showContactLink: true }),
        column3: normalizeColumn({ title: '', description: '' }),
        column4: normalizeColumn({ title: '', description: '' }),
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
    resolvedContent.value = cachedFooter.value;
  }

  if (!resolvedContent.value) {
    if (cachedFooter.value) {
      resolvedContent.value = cachedFooter.value;
    } else {
      if (!footerBlockPromise) {
        footerBlockPromise = fetchFooterBlock(true);
      }
      footerBlockPromise.then(() => {
        resolvedContent.value = cachedFooter.value;
        footerBlockPromise = null;
      });
    }
  }

  if (import.meta.client) {
    const handler = async () => {
      await fetchFooterBlock(false);
    };
    window.addEventListener('footer-block-refetch', handler);
    onBeforeUnmount(() => window.removeEventListener('footer-block-refetch', handler));
  }

  return { resolvedContent, cachedFooter };
}
