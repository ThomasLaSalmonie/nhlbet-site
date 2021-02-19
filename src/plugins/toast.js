import Vue from 'vue';

import toastMixin from '../mixins/toast';

// eslint-disable-next-line no-shadow
function installToast(Vue) {
  Vue.mixin(toastMixin);
}

export default function useToast() {
  Vue.use(installToast);
}
