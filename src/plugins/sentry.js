import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

function installSentry(App) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new Integrations.Vue({
        App,
        attachProps: true,
      }),
    ],
  });
}

export default function useSentry() {
  if (process.env.VUE_APP_SENTRY_DSN) {
    Vue.use(installSentry);
  }
}
