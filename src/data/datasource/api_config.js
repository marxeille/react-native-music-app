const httpAdapter = require('axios/lib/adapters/http');
const settle = require('axios/lib/core/settle');
import { rootStore } from '../repository/root_store';

const axios = require('axios').default;

console.log('DEBUG => api_context axios', axios);

export const instanceAxios = axios.create({
  baseURL: 'https://5e5dd20f725f320014ed0df9.mockapi.io/api',
  timeout: 15 * 1000,
});

const getAuthToken = () => {
  return rootStore?.userStore?.token ?? null;
};

instanceAxios.interceptors.request.use(
  function(config) {
    if (getAuthToken() !== null)
      config.headers = { ...config.headers, auth_token: getAuthToken() };
    // you can also do other modification in config
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

instanceAxios.interceptors.response.use(
  function(response) {
    if (response.status === 401) {
      // your failure logic
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  },
);
