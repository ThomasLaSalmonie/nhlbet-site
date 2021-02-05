import Vue from 'vue';
import VueAnalytics from 'vue-analytics';

export default function useAnalytics() {
  Vue.use(VueAnalytics, {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS_UA_CODE,
    checkDuplicatedScript: true,
    debug: {
      sendHitTask: true,
    },
  });
}
