import gql from 'graphql-tag';
import { get } from 'lodash';
import {
  setAuthorizationHeader,
  setCookie,
  removeCookie,
} from '@/helpers/utils';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '@/helpers/constants';
import { onLogin, onLogout } from '../../vue-apollo';

export default {
  updatePoints({ commit }, { points }) {
    commit('authUpdatePoints', { points });
  },
  /**
   * Basic login with email & password
   *
   * @param      {Object}    arg1           Vuex parameters
   * @param      {Function}  arg1.commit    Commit method
   * @param      {Object}    arg2           Action options
   * @param      {string}    arg2.email     The email
   * @param      {string}    arg2.password  The password
   * @return     {Promise}
   */
  login({ commit, state, getters }, { email, password, rememberMe = false }) {

    return new Promise(async (resolve, reject) => {
      try {
        const mutation = 'mutation login($item: UserLogin!) { login(item: $item) { id, token} }';
        const response = await this.$apollo.defaultClient.mutate({
          mutation: gql(mutation),
          variables: {
            item: { email, password },
          },
        });
        const { token } = response.data.login;
        const apolloClient = this.$apollo.defaultClient;
        await onLogin(apolloClient, token);
        const cookieOptions = {
          expires: rememberMe ? 7 : null,
        };

        // Must commit login success first, before finding where to redirect
        commit('authLoginSuccess', { token });
        setCookie(AUTH_TOKEN_LOCAL_STORAGE_KEY, token, cookieOptions);
        setAuthorizationHeader(this.$http, token);

        this.$router.push('/profil');
        resolve();
      } catch (error) {
        commit('authLoginError');
        reject(error);
      }
    });
  },
  register({ commit, state, getters }, form) {
    return new Promise(async (resolve, reject) => {
      try {
        const mutation = 'mutation register($item: UserAdd!) { register(item: $item) { id, token} }';
        const response = await this.$apollo.defaultClient.mutate({
          mutation: gql(mutation),
          variables: {
            item: form,
          },
        });
        const { token } = response.data.register;
        const apolloClient = this.$apollo.defaultClient;
        await onLogin(apolloClient, token);
        const cookieOptions = {
          expires: null,
        };

        // Must commit login success first, before finding where to redirect
        commit('authLoginSuccess', { token });
        setCookie(AUTH_TOKEN_LOCAL_STORAGE_KEY, token, cookieOptions);
        setAuthorizationHeader(this.$http, token);

        this.$router.push('/');
        resolve();
      } catch (error) {
        commit('authLoginError');
        reject(error);
      }
    });
  },
  /**
   * Attempt to automatically login using locally stored token
   *
   * @param      {Object}    arg1           Vuex parameters
   * @param      {Function}  arg1.commit    Commit method
   * @param      {Function}  arg1.dispatch  Dispatch method
   * @param      {Object}    arg1.getters   Getters object from store
   * @return     {Promise}
   */
  autoLogin({ commit, dispatch, getters }) {
    return new Promise(async (resolve, reject) => {
      const onLoginSuccess = (token) => {
        setAuthorizationHeader(this.$http, token);
        commit('authLoginSuccess', { token });
        resolve();
      };
      const onLoginFailure = (error = null) => {
        commit('authLoginError');
        dispatch('logout');
        if (error !== null) {
          reject(error);
        }
      };

      // Get token from cookies or local storage
      const { hasAuthToken } = getters;
      if (hasAuthToken === true) {
        const token = getters.getAuthToken;
        // We'll need an endpoint dedicated to verifying/refreshing access tokens
        try {
          const mutation = `mutation verify { verify(token: "${token}") { token } }`;
          const response = await this.$apollo.defaultClient.mutate({
            mutation: gql(mutation),
          });
          const newToken = get(response, 'data.verify.token', undefined);
          if (newToken !== undefined) {
            onLoginSuccess(newToken);
          }
        } catch (error) {
          if (error.response !== undefined && error.response.status === 400) {
            onLoginFailure(error);
          }
        }
      }
    });
  },
  /**
   * Logout current user
   *
   * @param      {Object}    arg1           Vuex parameters
   * @param      {Function}  arg1.commit    Commit method
   * @param      {Function}  arg1.dispatch  Dispatch method
   * @param      {Object}    arg1.getters   Getters object from auth store
   */
  logout(
    {
      commit, dispatch, getters,
    },
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the user was logged in before action begins.
        const shouldShowSnackbar = getters.isLoggedIn === true;
        removeCookie(AUTH_TOKEN_LOCAL_STORAGE_KEY);
        commit('authLogout');
        const apolloClient = this.$apollo.defaultClient;
        onLogout(apolloClient);
        if (shouldShowSnackbar === true) {
          dispatch('ui/showSnackbar', { message: 'dialogs.logout_success', type: 'success' }, { root: true });
        }
        resolve();
      } catch (error) {
        commit('authLogoutError');
        reject(error);
      }
    });
  },
};
