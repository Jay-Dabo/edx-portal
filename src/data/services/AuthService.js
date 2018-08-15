import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import qs from 'query-string';

import configuration from '../../config';
import httpClient from '../../httpClient';

const cookies = new Cookies();

class AuthService {
  static baseUrl = configuration.LMS_BASE_URL;
  static clientId = configuration.LMS_CLIENT_ID;
  static accessTokenCookieName = configuration.ACCESS_TOKEN_COOKIE_NAME;
  static refreshTokenCookieName = configuration.REFRESH_TOKEN_COOKIE_NAME;

  static login(email, password) {
    return httpClient.get(`${this.baseUrl}/user_api/v1/account/login_session/`)
      .then((response) => {
        return httpClient.post(
          `${this.baseUrl}/user_api/v1/account/login_session/`,
          qs.stringify({
            email,
            password,
          }),
        );
      });
  }

  static logout() {
    return httpClient.post(`${this.baseUrl}/user_api/v1/account/logout_session/`);
  }

  static isAccessTokenExpired() {
    try {
      let token = jwtDecode(cookies.get(self.accessTokenCookieName));
      if (token.exp > Date.now() / 1000) {
        return false;
      }
    } catch(error) {}
    return true;
  }

  static refreshAccessToken() {
    let refreshToken = cookies.get(self.refreshTokenCookieName);
    if (refreshToken) {
      return httpClient.get(`${this.baseUrl}/user_api/v1/account/refresh_access_token/`);
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('Refresh token does not exist.'));
      });
    }
  }
}

export default AuthService;
