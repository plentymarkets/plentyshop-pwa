import dotenv from 'dotenv';
dotenv.config();

const config = {
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api/server',
      configuration: {
        api: {
          url: 'https://mevofvd5omld.c01-14.plentymarkets.com'
        }
      },
    }
  },
};

export default config;
