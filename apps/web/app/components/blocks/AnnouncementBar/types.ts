export type AnnouncementBarProps = {
  name: string;
  type: string;
  content: AnnouncementBarContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type AnnouncementBarContent = {
  text: {
    htmlDescription?: string;
  };
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
