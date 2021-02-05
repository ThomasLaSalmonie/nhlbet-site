<template>
  <b-container fluid class="my-5">
    <h1>{{ $t('global.hello') }}, {{ user.firstname }} {{ user.lastname }}:</h1>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto">
        <label>{{ $t('login.email') }}:</label>
          <b-form-input v-model="user.email" type="email" required />
          <b-button class="m-2 p-1" size="sm" variant="primary">{{ $t('profil.update_email') }}</b-button>
      </b-col>
    </b-row>
    <br />
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto">
        <label>Points:</label>
        <b-card-text>{{ user.gameonpoints }}</b-card-text>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
    };
  },
  apollo: {
    user: {
      query() {
        const query = `
          query user {
            user(id: ${this.userId}) {
              id,
              firstname,
              lastname,
              email,
              gameonpoints
            }
          }
        `;
        return gql(query);
      },
    },
  },
  created() {
    console.log(this);
  },
  computed: {
  },
  methods: {
  },
};
</script>
