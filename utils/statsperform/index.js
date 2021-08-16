import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';

// const baseURL = 'http://localhost:9000/'
const baseURL = 'http://api.stats.com/v1/stats/basketball/nba/';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
// instance.defaults.headers.get['Content-Type'] = 'application/json'
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((request) => {
  return request;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    try {
      return error.response;
    } catch (e) {
      return Promise.reject(error);
    }
  }
);

const generateAuth = () => {
    return '/?api_key=' + process.env.NEXT_PUBLIC_API_KEY 
        + '&sig=' + CryptoJS.SHA256(process.env.NEXT_PUBLIC_API_KEY + process.env.NEXT_PUBLIC_SECRET_KEY + moment().utc().unix()).toString(CryptoJS.enc.Hex)
}

export { axiosInstance, generateAuth };
