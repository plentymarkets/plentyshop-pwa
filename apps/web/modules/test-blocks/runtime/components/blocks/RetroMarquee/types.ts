export type RetroMarqueeProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration?: {
    visible: boolean;
  };
  content: {
    text: string;
    backgroundColor: string;
    textColor: string;
    speed: number;
  };
};

export type RetroMarqueeFormProps = {
  uuid?: string;
};
