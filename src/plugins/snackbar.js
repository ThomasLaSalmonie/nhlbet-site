/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

function installSnackbar(App) {
  App.prototype.$reportMessage = function reportMessage({ message }) {
    this.showSnackbar({
      message,
      type: 'info',
    });
  };

  App.prototype.$reportError = function reportError({ message }) {
    this.showSnackbar({
      message,
      type: 'error',
    });
  };

  App.prototype.$reportSuccess = function reportSuccess({ message }) {
    this.showSnackbar({
      message,
      type: 'success',
    });
  };

  App.mixin({
    computed: {
      ...mapGetters({
        isLoggedIn: 'auth/isLoggedIn',
        canAccess: 'auth/canAccess',
        userName: 'auth/userName',
        userEmail: 'auth/userEmail',
        userId: 'auth/userId',
      }),
    },
    methods: {
      ...mapActions({
        showSnackbar: 'ui/showSnackbar',
      }),
    },
  });
}

export default function useSnackbar() {
  Vue.use(installSnackbar);
}
