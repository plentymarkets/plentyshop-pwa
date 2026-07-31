import type { Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { BannerProps } from '~/components/blocks/Banner/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import type { ItemGridContent, ItemGridFieldsVisibility } from '~/components/blocks/ItemGrid/types';
import type { ImageContent } from '~/components/blocks/Image/types';
import { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';
import { migrateImageContent } from '~/utils/migrate-image-content';
import { migrateTextCardContent } from '~/utils/migrate-text-editor';
import { migrateRecommendedContent } from '~/utils/migrate-recommended-content';
import type { OldContent } from '~/utils/migrate-recommended-content/types';
import type { NewsletterSubscribeContent } from '~/components/blocks/NewsletterSubscribe/types';
import { HEADER_BLOCK_NAME } from '~/utils/blocks/block-names';

const TEXT_CONTENT_BLOCKS = new Set(['TextCard', 'Banner', 'ProductRecommendedProducts']);

const isHeaderBlock = (block: Block): boolean => block?.name === HEADER_BLOCK_NAME;

const migrateImageBlock = (block: Block): void => {
  if (block.name === 'Image' && block.content) {
    block.content = migrateImageContent(block.content);
    const content = block.content as ImageContent;
    if (content.button && !content.button.alignment) {
      content.button.alignment = 'center';
    }
  }
};

const migrateProductRecommendedProductsBlock = (block: Block): void => {
  if (block.name === 'ProductRecommendedProducts' && block.content) {
    block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
  }
};

const migrateTextContentBlock = (block: Block, firstTextContentBlock?: Block): void => {
  if (TEXT_CONTENT_BLOCKS.has(block.name) && block.content) {
    block.content = migrateTextCardContent(block.content as Partial<TextCardContent>, block === firstTextContentBlock);
  }
};

const migrateNewsletterSubscribeBlock = (block: Block): void => {
  if (block.name === 'NewsletterSubscribe' && block.content) {
    const content = block.content as Partial<NewsletterSubscribeContent>;
    const title = content.text?.title || 'Newsletter';
    const description = content.text?.htmlDescription ?? '';
    const hasHeading = /<h[1-6]\b/i.test(description);

    content.text = {
      bgColor: '#f5f5f5',
      textAlignment: 'center',
      ...content.text,
      htmlDescription: hasHeading
        ? description
        : `<h2 style="text-align: center;"><strong>${title}</strong></h2>${description}`,
    };

    block.content = content;
  }
};

const migrateBannerBlock = (block: Block): void => {
  if (block.name === 'Banner' && block.content) {
    const content = (block as BannerProps).content;
    const textAlignment = content.text?.textAlignment;
    if (textAlignment && !content?.button?.alignment) {
      content.button = content.button ?? {};
      content.button.alignment = textAlignment;
    }
  }
};

const migrateTextCardBlock = (block: Block): void => {
  if (block.name === 'TextCard' && block.content) {
    const content = block.content as TextCardContent;
    if (content.button && !content.button.alignment) {
      content.button.alignment = 'center';
    }
  }
};

const migrateItemGridBlock = (block: Block): void => {
  if (block.name === 'ItemGrid' && block.content) {
    const content = block.content as ItemGridContent;
    const fields = (content.fields ?? {}) as ItemGridFieldsVisibility;

    content.fields = fields;
    content.fieldsOrder ??= [];

    if (fields['manufacturer'] === undefined) {
      fields['manufacturer'] = true;
    }
    if (!content.fieldsOrder.includes('manufacturer')) {
      content.fieldsOrder.push('manufacturer');
    }

    delete (fields as Record<string, unknown>)['shippingBadge'];
    content.fieldsOrder = content.fieldsOrder.filter((f) => (f as string) !== 'shippingBadge');
  }
};

/**
 * Applies all block content migrations in-place (image, text-card, recommended-products, banner).
 * Call this once after fetching / assembling the full block tree.
 */
export const migrateAllBlocks = (blocks: Block[]): void => {
  /**
   * TECH DEBT: Identify the first text content block (TextCard, Banner, ProductRecommendedProducts)
   * that appears outside of the header/navigation area. This block receives special migration handling to ensure
   * proper text formatting initialization. The logic skips header-related blocks and nested content within the header
   * container to focus on main page content blocks.
   *
   * @refactor Consider extracting this into a dedicated utility function with clearer naming and documentation
   * of why the first text block specifically needs differentiated treatment.
   */
  const firstTextContentBlock = (() => {
    let headerContainerBlock: Block = {} as Block;
    for (const block of blocks) {
      if (isHeaderContainerBlock(block)) headerContainerBlock = block;
      if (
        (Array.isArray(headerContainerBlock.content) && headerContainerBlock.content.includes(block)) ||
        isHeaderBlock(block) ||
        isHeaderContainerBlock(block)
      )
        continue;
      if (TEXT_CONTENT_BLOCKS.has(block.name)) return block;
      if (Array.isArray(block.content)) {
        const firstChild = block.content.find((child) => TEXT_CONTENT_BLOCKS.has(child.name));
        if (firstChild) return firstChild;
      }
    }
    return undefined;
  })();

  const migrate = (blocks: Block[]) => {
    blocks.forEach((block) => {
      migrateImageBlock(block);
      migrateProductRecommendedProductsBlock(block);
      migrateTextContentBlock(block, firstTextContentBlock);
      migrateNewsletterSubscribeBlock(block);
      migrateBannerBlock(block);
      migrateTextCardBlock(block);
      migrateItemGridBlock(block);

      if (Array.isArray(block.content)) {
        migrate(block.content);
      }
    });
  };

  migrate(blocks);
};
