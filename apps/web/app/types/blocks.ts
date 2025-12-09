import type { Block } from '@plentymarkets/shop-api';

/**
 * Generic block properties that extend the base Block interface.
 *
 * @template TContent - The content type for this specific block
 * @template TConfig - Optional configuration type (defaults to unknown)
 *
 * @remarks
 * This generic type provides type-safe extension of the base Block interface
 * while maintaining backward compatibility with existing block implementations.
 *
 * All blocks should use this pattern via intersection:
 * ```ts
 * export type MyBlockProps = BlockProps<MyBlockContent, MyBlockConfig>;
 * ```
 *
 * For blocks with runtime-injected properties, use intersection:
 * ```ts
 * export type MyBlockProps = BlockProps<MyBlockContent> & {
 *   products?: Product[];
 *   shouldLoad?: boolean;
 * };
 * ```
 *
 * @see normalizePadding() for handling legacy string-based padding values
 */
export type BlockProps<TContent, TConfig = unknown> = Block & {
  content: TContent;
  configuration?: TConfig;
  index?: number;
};

/**
 * Padding layout configuration for blocks.
 *
 * @remarks
 * Uses number values for consistent padding calculation.
 * Legacy blocks may have string values that need runtime normalization.
 *
 * @see normalizePadding() for migration from legacy string format
 */
export interface PaddingLayout {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  fullWidth?: boolean;
}

/**
 * Button configuration shared across blocks.
 *
 * @remarks
 * Provides consistent button structure for blocks that include CTAs.
 */
export interface ButtonSection {
  label?: string;
  link?: string;
  variant?: ButtonVariant;
}

/**
 * Text content configuration shared across blocks.
 *
 * @remarks
 * Provides consistent text structure for blocks with textual content.
 * Properties are optional to allow flexible composition.
 */
export interface TextSection {
  pretitle?: string;
  title?: string;
  subtitle?: string;
  htmlDescription?: string;
  textAlignment?: TextAlignment;
  color?: string;
}

/**
 * Button style variants used across the application.
 */
export type ButtonVariant = 'primary' | 'secondary';

/**
 * Text alignment options for content.
 */
export type TextAlignment = 'left' | 'center' | 'right';

/**
 * Image fill modes for controlling how images are displayed.
 */
export type FillMode = 'fill' | 'fit';

/**
 * Vertical alignment options for content positioning.
 */
export type VerticalAlignment = 'top' | 'center' | 'bottom';
