import { get } from 'lodash';
import { getCookie } from '@/helpers/utils';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '@/helpers/constants';

export default {
  isLoggedIn: (state) => state.token !== null,
  points: (state) => get(state, 'user.points', null),
  userEmail: (state) => get(state, 'user.email', null),
  userName: (state) => {
    const firstname = get(state, 'user.firstname', null);
    const lastname = get(state, 'user.lastname', null);
    return `${firstname} ${lastname}`;
  },
  userId: (state) => get(state, 'user.id', null),
  /**
   * User's auth token from cookies or localStorage
   *
   * @return {String} Auth token
   */
  getAuthToken: () => {
    const token = getCookie(AUTH_TOKEN_LOCAL_STORAGE_KEY) || localStorage.getItem('AUTH_TOKEN');
    return token;
  },
  /**
   * Does user have token in cookies or localStorage
   *
   * @return {Boolean} Presence of auth token
   */
  hasAuthToken: (getters) => {
    const { getAuthToken } = getters;
    return getAuthToken !== null;
  },
};
