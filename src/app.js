/* eslint-disable no-param-reassign */
import 'core-js/stable';
import 'isomorphic-fetch';

import Vue from 'vue';

import createStore from './store';
import createRouter from './router';
import { createProvider } from './vue-apollo';

import useI18n from './plugins/i18n';
import useAxios from './plugins/axios';
import useSentry from './plugins/sentry';
import useMeta from './plugins/meta';
import usePersistedState from './plugins/persisted-state';
import useAnalytics from './plugins/analytics';
import useBootstrap from './plugins/bootstrap';
import useToast from './plugins/toast';
import useDatepicker from './plugins/datepicker';

import App from './App.vue';

/**
 * App Context.
 * Provides the app objects and params.
 * @typedef {Object} AppContext
 * @property {Vuex.Store} store - The app's Vuex store.
 * @property {Router} router - The app's router.
 * @property {VueApollo} apollo - The app's ApolloProvider
 * @property {VueI18n} i18n - The app's i18n instance
 * @property {Object} vueOptions - The options for the Vue constructor on creation.
 * @property {Object} persistedStateOptions - The options for the persisted state plugin
 */

/**
 * Create App.
 * Makes the app context available to most lifecycle areas,
 * allowing setup utilities to add to it or modify it.
 * @param {AppContext} [context] - Additional context before setup.
 * @return {{ app: Vue, store: Vuex.Store, router: Router, apollo: VueApollo }}
 */
export default function createApp(context = {}) {
  if (!context.vueOptions) {
    context.vueOptions = {};
  }

  context.vueOptions.render = (h) => h(App);

  // Create store
  const store = createStore(context);
  context.store = store;
  context.vueOptions.store = store;
  context.persistedStateOptions = {
    paths: [],
  };

  // Create router
  const router = createRouter(context);
  context.router = router;
  context.vueOptions.router = router;
  store.$router = router;

  // Create Apollo provider
  const apollo = createProvider(context);
  context.apollo = apollo;
  context.vueOptions.apolloProvider = apollo;
  store.$apollo = apollo;

  // Setup plugins
  useI18n(context);
  useAxios(context);
  useSentry(context);
  useMeta(context);
  useAnalytics(context);
  useBootstrap(context);
  useToast(context);
  useDatepicker(context);

  // Set store additional properties
  store.$http = Vue.prototype.$http;

  // Initialize persisted state
  usePersistedState(context);

  // Create app using Vue Options
  const app = new Vue(context.vueOptions);

  // Expose the app, the store, the router, and apollo
  return {
    app,
    store,
    router,
    apollo,
  };
}
