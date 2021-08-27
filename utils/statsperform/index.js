import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';

// https://cors-anywhere.herokuapp.com/ added as proxy to bypass cors error. Might not be necessary during production.
const baseURL = 'https://cors-anywhere.herokuapp.com/http://api.stats.com/v1/stats/basketball/nba/';
//const baseURL = 'http://api.stats.com/v1/stats/basketball/nba/';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.defaults.headers['Content-Type'] = 'application/json';
axiosInstance.defaults.headers['Access-Control-Allow-Origin'] = '*';
//axiosInstance.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
//axiosInstance.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';
axiosInstance.defaults.withCredentials = false;

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
  const public_key = process.env.NEXT_PUBLIC_API_KEY;
  const private_key = process.env.NEXT_PUBLIC_SECRET_KEY;
  return '/?api_key=' + public_key + '&sig=' + CryptoJS.SHA256(public_key + private_key + moment().utc().unix()).toString(CryptoJS.enc.Hex)
}

export { axiosInstance, generateAuth };
