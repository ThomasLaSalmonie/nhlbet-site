import Vue from 'vue';
import createApp from './app';

Vue.config.productionTip = false;

const { app, router } = createApp();

router.onReady(() => {
  app.$mount('#app');
});
