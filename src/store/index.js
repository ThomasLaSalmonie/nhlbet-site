import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import ui from './ui';
import group from './group';

export default function createStore() {
  Vue.use(Vuex);

  const store = new Vuex.Store({
    modules: {
      auth,
      ui,
      group,
    },
  });

  return store;
}
