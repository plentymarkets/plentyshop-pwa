import type { TextCardProps } from '../types';

export const mockTextCard: TextCardProps = {
  name: 'TextCard',
  type: 'block',
  content: {
    text: {
      pretitle: 'Welcome to PlentyShop',
      title: 'Your One-Stop Shop',
      subtitle: 'Find everything you need in one place',
      htmlDescription: '<p>Discover our wide range of products and enjoy exclusive deals.</p>',
      textAlignment: 'center',
      color: '#333333',
    },
    button: {
      label: 'Shop Now',
      link: '/shop',
      variant: 'primary',
    },
    layout: {
      backgroundColor: '#f9f9f9',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '15px',
      paddingRight: '15px',
    },
  },
  configuration: {
    showButton: true,
  },
  index: 0,
  meta: {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
  },
};
