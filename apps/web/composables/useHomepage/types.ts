export interface SlideControls {
  color: string;
}

export interface Block {
  name: string;
  type: string;
  configuration?: unknown;
  meta: {
    uuid: string;
  };
  content: unknown;
}
