import dotenv from 'dotenv';
dotenv.config();

const config = {
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api',
      configuration: {
        api: {
          url: 'https://mevofvd5omld.c01-14.plentymarkets.com'
        }
      },
    }
  },
};

export default config;
