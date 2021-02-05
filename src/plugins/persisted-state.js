import createPersistedState from 'vuex-persistedstate';

export default function usePersistedState({ store, persistedStateOptions }) {
  // Create persisted state plugin from context options
  const persistedStatePlugin = createPersistedState(persistedStateOptions);

  // Apply plugin to store
  persistedStatePlugin(store);
}
