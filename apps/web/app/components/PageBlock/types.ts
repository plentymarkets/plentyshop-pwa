import type { Block } from '@plentymarkets/shop-api';
import type { Component, HTMLAttributes } from 'vue';

export interface PageBlockProps {
  index: number;
  block: Block;
  enableActions?: boolean;
  root: boolean;
}

export interface PageBlockEditorProps {
  isClicked: boolean;
  readOnly?: boolean;
  clickedBlockIndex: number | null;
  isTablet: boolean;
  changeBlockPosition: (index: number, position: number) => void;
}

export interface EditorPageBlockProps extends PageBlockProps, PageBlockEditorProps {}

export interface PageBlockContentProps extends PageBlockProps {
  contentAttrs?: Record<string, unknown>;
  recursiveComponent: Component;
  recursiveProps?: Record<string, unknown>;
  wrapperClass?: HTMLAttributes['class'];
}

export interface LazyLoadConfig {
  propName: string;
  rootMargin?: string;
  threshold?: number;
}
