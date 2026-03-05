export type AnnouncementBarProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration?: {
    visible: boolean;
  };
  content: {
    backgroundColor: string;
    text: string;
  };
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
