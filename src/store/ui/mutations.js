export default {
  uiSnackbarShow(state, { id, message, type }) {
    state.snackbar = { id, message, type };
  },
  uiSnackbarHide(state) {
    state.snackbar = {};
  },
};
