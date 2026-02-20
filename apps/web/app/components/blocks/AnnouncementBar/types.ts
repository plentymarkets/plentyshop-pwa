export type AnnouncementBarProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration: {
    controls: {
      color: string;
    };
    layout: {
      paddingTop: number;
      paddingBottom: number;
      paddingLeft: number;
      paddingRight: number;
      fullWidth: boolean;
      backgroundColor: string;
    };
  };
  content: AnnouncementItem[];
};

export type AnnouncementItem = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  content: {
    text: string;
    visible: boolean;
  };
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
