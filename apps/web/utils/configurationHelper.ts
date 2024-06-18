import axios from 'axios';

const getConfiguration = () => {
  const instance = axios.create({
    baseURL: process.env.API_ENDPOINT,
    headers: {
      'X-Security-Token': process.env.API_ENDPOINT,
    },
  });
  
  instance
    .get(`/storefront/settings/${process.env.API_ENDPOINT}`)
    // eslint-disable-next-line promise/always-return
    .then((res) => {
      process.env.ID = res.data.userId;
      process.env.TITLE = res.data.title;
      process.env.COMPLETED = res.data.completed;
      console.log(process.env.ID);
      console.log(process.env.TITLE);
      console.log(process.env.COMPLETED);
    })
    // eslint-disable-next-line unicorn/prefer-top-level-await
    .catch((error: unknown) => console.error(error));
  
}

export default getConfiguration;
