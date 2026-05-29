export type HomeReviewItem = {
  id: string;
  name: string;
  initials?: string;
  when?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatar?: {
    bg: string;
    text: string;
  };
};

export type HomeReviewsContent = {
  title?: string;
  reviews?: HomeReviewItem[];
};

export type HomeReviewsProps = {
  name: string;
  type: string;
  content: HomeReviewsContent;
  meta: {
    uuid: string;
  };
};
