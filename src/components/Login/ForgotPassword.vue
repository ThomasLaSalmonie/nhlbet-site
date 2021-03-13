<template>
  <b-container fluid>
    <b-form v-if="isSubmitted === false" @submit="onSubmit">
      <h1>{{ $t('login.forgot_password_title1') }}</h1>
      {{ $t('login.forgot_password_desc1') }}
      <b-row class="justify-content-sm-center">
        <b-col cols="12" sm="auto">
          <label>{{ $t('profil.email') }}*:</label>
          <b-form-input v-model="form.email" type="email" required />
        </b-col>
      </b-row>
      <br />
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    <div v-else>
      <h1>{{ $t('login.forgot_password_title2') }}</h1>
      {{ $t('login.forgot_password_desc2') }}
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
        email: '',
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
        const mutation = 'mutation forgotpasswordUser($email: String!) { forgotpasswordUser(email: $email) }';
        const response = await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            email: form.email,
          },
        });
        console.log(response);
        this.isSubmitted = true;
      } catch (e) {
        this.showToast({ message: 'errors.reset_password', variant: 'danger' });
      }
    },
  },
};
</script>
