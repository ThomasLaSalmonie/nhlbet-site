import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import ui from './ui';

export default function createStore() {
  Vue.use(Vuex);

  const store = new Vuex.Store({
    modules: {
      auth,
      ui,
    },
  });

  return store;
}
