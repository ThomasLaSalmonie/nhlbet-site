import Cookies from 'js-cookie';

export const setGlobalHttpHeader = ($http, header, value) => {
  $http.defaults.headers[header] = value;
};

export const setAuthorizationHeader = ($http, token) => {
  setGlobalHttpHeader($http, 'Authorization', `Bearer ${token}`);
};

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options);
};

export const getCookie = name => Cookies.get(name);

export const removeCookie = (name, options = {}) => {
  Cookies.remove(name, options);
};
