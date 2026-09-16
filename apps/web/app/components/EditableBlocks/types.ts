import type { Block } from '@plentymarkets/shop-api';
import type { Component } from 'vue';
import type { PageBlockEditorProps, PageBlockProps } from '../PageBlock/types';

export type BlockLayout = { narrowContainer?: boolean };

export type BlockWithLayout = Block & {
  content?: { layout?: BlockLayout };
  layout?: BlockLayout;
};

export interface DragEvent<T = Block> {
  added?: {
    element: T;
    newIndex: number;
  };
  removed?: {
    element: T;
    oldIndex: number;
  };
  moved?: {
    element: T;
    oldIndex: number;
    newIndex: number;
  };
}

export type EditableBlocksProps = {
  identifier?: string | number;
  type?: string;
  hasEnabledActions?: boolean;
  preventBlocksRequest?: boolean;
  readOnly?: boolean;
  blocks?: Block[];
};

export interface EditableBlockItemProps extends PageBlockProps {
  editorPageBlockProps?: PageBlockEditorProps;
  pageBlockComponent: Component | string;
  tabletEdit: (index: number) => void;
}
