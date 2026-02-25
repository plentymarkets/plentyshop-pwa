export type AnnouncementBarProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration: {
    layout?: {
      fullWidth?: boolean;
      paddingTop?: number;
      paddingBottom?: number;
      paddingLeft?: number;
      paddingRight?: number;
      backgroundColor?: string;
    };
    visible?: boolean;
  };
  content: {
    text: string;
  };
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
