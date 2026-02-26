export type AnnouncementBarProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration: {
    layout: { backgroundColor: string };
    visible: boolean;
  };
  content: {
    text: string;
  };
};

export type AnnouncementBarFormProps = {
  uuid?: string;
};
