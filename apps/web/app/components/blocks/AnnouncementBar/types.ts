export type AnnouncementBarProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  content: AnnouncementBarContent[];
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    fullWidth?: boolean;
    stickyOnTop?: boolean;
    backgroundColor?: string;
  };
};

export type AnnouncementBarContent = {
  meta: {
    uuid: string;
  };
  text: string;
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
