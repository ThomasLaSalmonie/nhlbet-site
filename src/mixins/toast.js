export default {
  methods: {
    showToast({
      title, message, variant = 'success', toaster = 'b-toaster-bottom-right',
    }) {
      this.$bvToast.toast(message, {
        toaster,
        title,
        variant,
        autoHideDelay: 5000,
        appendToast: false,
      });
    },
  },
};
