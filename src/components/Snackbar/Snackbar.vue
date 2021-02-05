<template>
  <b-toast
    :value="snackbar.id"
    :color="snackbar.type"
    :multi-line="true"
    :timeout="3000"
    :bottom="true"
    :right="true"
  >
    {{ $t(snackbar.message) }}
    <b-button
      @click="hideSnackbar()"
    >
      {{ $t('ui.close') }}
    </b-button>
  </b-toast>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SnackbarContainer',
  data: () => ({
    onLeaveCallback: null,
  }),
  computed: {
    ...mapState('ui', ['snackbar']),
  },
  methods: {
    ...mapActions({
      hideSnackbar: 'ui/hideSnackbar',
    }),
  },
};
</script>
