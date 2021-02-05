export default {
  showSnackbar({ commit }, { message, type = 'info' }) {
    commit('uiSnackbarShow', { id: Date.now(), message, type });
  },
  hideSnackbar({ commit }) {
    commit('uiSnackbarHide');
  },
};
