export interface UseScrollHandlerState {
  baselineTop: number;
  baselineScrollY: number;
  currentTop: number;
  bottomValue: number;
  attachScroll: () => void;
  detachScroll: () => void;
}

export type HandleScroll = () => void;
export type AttachScroll = () => void;
export type DetachScroll = () => void;

export interface UseScrollHandler {
  baselineTop: Ref<UseScrollHandlerState['baselineTop']>;
  baselineScrollY: Ref<UseScrollHandlerState['baselineScrollY']>;
  currentTop: Ref<UseScrollHandlerState['currentTop']>;
  bottomValue: Ref<UseScrollHandlerState['bottomValue']>;
  handleScroll: HandleScroll;
  attachScroll: AttachScroll;
  detachScroll: DetachScroll;
}

export type UseScrollHandlerReturn = (uuid: string) => UseScrollHandler;
