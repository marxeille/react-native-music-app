
const httpAdapter = require('axios/lib/adapters/http');
const settle = require('axios/lib/core/settle');

const axios = require('axios').default;

console.log('DEBUG => api_context axios', axios);

export const instanceAxios = axios.create(
  {
    baseURL: 'https://5e5dd20f725f320014ed0df9.mockapi.io/api/v1',
    timeout: 15 * 1000,
  }
);

