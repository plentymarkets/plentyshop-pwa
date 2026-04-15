import type { Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { BannerProps } from '~/components/blocks/Banner/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';
import { migrateImageContent } from '~/utils/migrate-image-content';
import { migrateTextCardContent } from '~/utils/migrate-text-editor';
import { migrateRecommendedContent, type OldContent } from '~/utils/migrate-recommended-content';

const HEADER_BLOCK_NAME = 'Header';
const TEXT_CONTENT_BLOCKS = ['TextCard', 'Banner', 'ProductRecommendedProducts', 'NewsletterSubscribe'];

const isHeaderBlock = (block: Block): boolean => block?.name === HEADER_BLOCK_NAME;

/**
 * Applies all block content migrations in-place (image, text-card, recommended-products, banner).
 * Call this once after fetching / assembling the full block tree.
 */
export function migrateAllBlocks(blocks: Block[]): void {
  /**
   * TECH DEBT: Identify the first text content block (TextCard, Banner, ProductRecommendedProducts, or NewsletterSubscribe)
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
      if (TEXT_CONTENT_BLOCKS.includes(block.name)) return block;
      if (Array.isArray(block.content)) {
        const firstChild = block.content.find((child) => TEXT_CONTENT_BLOCKS.includes(child.name));
        if (firstChild) return firstChild;
      }
    }
    return undefined;
  })();

  const migrate = (blocks: Block[]) => {
    blocks.forEach((block) => {
      if (block.name === 'Image' && block.content) {
        block.content = migrateImageContent(block.content);
      }

      if (block.name === 'ProductRecommendedProducts' && block.content) {
        block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
      }

      if (TEXT_CONTENT_BLOCKS.includes(block.name) && block.content) {
        block.content = migrateTextCardContent(
          block.content as Partial<TextCardContent>,
          block === firstTextContentBlock,
        );
      }

      if (block.name === 'Banner' && block.content) {
        const content = (block as BannerProps).content;
        const textAlignment = content.text?.textAlignment;
        if (textAlignment && !content?.button?.alignment) {
          content.button = content.button ?? {};
          content.button.alignment = textAlignment;
        }
      }

      if (Array.isArray(block.content)) {
        migrate(block.content);
      }
    });
  };

  migrate(blocks);
}
