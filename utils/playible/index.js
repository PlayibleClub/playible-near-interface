import axios from 'axios';

//const baseURL = 'http://localhost:8000/';
// const baseURL = 'https://dev.api.playible.io/';
const baseURL = 'https://staging-api.playible.io/';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.defaults.headers['Content-Type'] = 'application/json';
//axiosInstance.defaults.headers['Access-Control-Allow-Origin'] = '*';
//axiosInstance.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
//axiosInstance.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';
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

export { axiosInstance };
