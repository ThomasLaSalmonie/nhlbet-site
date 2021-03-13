<template>
  <b-container fluid>
    <h1>{{ $t('login.reset_password') }}</h1>
    <b-form v-if="isSubmitted === false" @submit="onSubmit">
      <b-row class="justify-content-sm-center">
        <b-col cols="12" sm="auto">
          <label>{{ $t('profil.new_password') }}*:</label>
          <b-form-input v-model="form.password" type="password" required />
          <label>{{ $t('profil.confirm_password') }}*:</label>
          <b-form-input v-model="form.confirm_password" type="password" required />
        </b-col>
      </b-row>
      <br />
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    <div v-else>
      {{ $t('login.reset_password_success') }}
      <br />
      <b-button to="/login" variant="primary">Back to Login</b-button>
    </div>
  </b-container>
</template>

<script>
import gql from 'graphql-tag';

export default {
  name: 'ResetPassword',
  components: {
  },
  data() {
    return {
      isSubmitted: false,
      form: {
        password: '',
        confirm_password: '',
      },
    };
  },
  computed: {
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const { form } = this;
      try {
        const mutation = `mutation resetpasswordUser($token: String!, $password: String!, $passwordConfirmation: String!) {
          resetpasswordUser(token: $token, password: $password, passwordConfirmation: $passwordConfirmation)
        }`;
        await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            token: this.$route.query.token,
            password: form.password,
            passwordConfirmation: form.confirm_password,
          },
        });
        this.isSubmitted = true;
      } catch (e) {
        this.showToast({ message: 'errors.login_error', variant: 'danger' });
      }
    },
  },
};
</script>
