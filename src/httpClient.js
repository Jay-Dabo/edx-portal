import axios from 'axios';

import store from './data/store';
import { logout } from './data/actions/authentication';
import AuthService from './data/services/AuthService';

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'sandbox-csrftoken';

const httpClient = axios;

httpClient.interceptors.request.use((config) => {
  let originalRequest = config;
  if (AuthService.isAccessTokenExpired()) {
    AuthService.refreshAccessToken()
      .then(() => {
        return Promise.resolve(originalRequest);
      })
      .catch(() => {
        store.dispatch(logout());
      });
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Configure axios with response interceptor
httpClient.interceptors.response.use(response => response, (error) => {
  const errorStatus = error && error.response && error.response.status;
  if (errorStatus === 401 || errorStatus === 403) {
    store.dispatch(logout());
  }
  return Promise.reject(error);
});

export default httpClient;
