export type AnnouncementBarProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  content: AnnouncementBarContent;
};

export type AnnouncementBarContent = {
  announcements: {
    meta: {
      uuid: string;
    };
    text: string;
  }[];
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    fullWidth: boolean;
    stickyOnTop: boolean;
    backgroundColor: string;
  };
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
