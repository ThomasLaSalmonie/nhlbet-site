import jwt from 'jsonwebtoken';

export default {
  authLoginSuccess(state, { token }) {
    const payload = jwt.decode(token);
    console.log(payload);
    const {
      id, email, firstname, lastname, points,
    } = payload;
    const user = {
      id, email, firstname, lastname, points,
    };
    state.user = user;
    state.token = token;
  },
  authLoginError(state) {
    state.user = {};
    state.token = null;
  },
  authLogout(state) {
    state.user = {};
    state.token = null;
  },
  authLogoutError(state) {
    state.user = {};
    state.token = null;
  },
  setRequestedPath(state, requestedPath) {
    state.requestedPath = requestedPath;
  },
};
