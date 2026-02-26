export interface HomepageContent {
  carousel: {
    banner1: {
      pretitle: string;
      title: string;
      subtitle?: string;
      description: string;
      buttonLabel: string;
    };
    banner2: {
      pretitle: string;
      title: string;
      description: string;
      buttonLabel: string;
    };
  };
  textcard: {
    welcome: {
      pretitle: string;
      title: string;
      subtitle: string;
      description: string;
      buttonLabel: string;
    };
  };
  multigrid: {
    textcard: {
      pretitle: string;
      title: string;
      subtitle: string;
      description: string;
      buttonLabel: string;
    };
    image: {
      alt: string;
    };
  };
  productRecommended: {
    fashion: {
      pretitle: string;
      title: string;
      subtitle: string;
      description: string;
    };
  };
  newsletter: {
    title: string;
    description: string;
    buttonLabel: string;
  };
  footer: {
    column1: {
      title: string;
    };
    column2: {
      title: string;
    };
  };
}
