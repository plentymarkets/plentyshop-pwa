import axios from 'axios';

const getConfiguration = () => {
  const instance = axios.create({
    baseURL: process.env.API_ENDPOINT,
    headers: {
      'X-Security-Token': process.env.API_SECURITY_TOKEN,
    },
  });
  
  instance
    .get(`/storefront/settings/${process.env.API_CONFIG_ID}`)
    // eslint-disable-next-line promise/always-return
    .then((res) => {
     console.log(res.data);
    })
    // eslint-disable-next-line unicorn/prefer-top-level-await
    .catch((error: unknown) => console.error(error));
  
}

export default getConfiguration;
