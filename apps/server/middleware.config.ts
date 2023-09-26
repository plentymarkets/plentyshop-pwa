import dotenv from 'dotenv';
dotenv.config();

const config = {
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api/server',
      configuration: {
        api: {
          url: process.env.API_URL ? `${process.env.API_URL}` : 'https://mevofvd5omld.c01-14.plentymarkets.com'
        }
      },
    }
  },
};

export default config;
