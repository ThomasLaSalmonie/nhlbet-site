<template>
  <b-container fluid>
    <h1>{{ $t('login.sign_in') }}:</h1>
    {{ $t('global.or') }}
    <router-link to="/register">{{ $t('login.register') }}</router-link>
    <b-form @submit="onSubmit">
      <b-row class="justify-content-sm-center">
        <b-col cols="12" sm="auto">
          <label>{{ $t('profil.email') }}*:</label>
          <b-form-input v-model="form.email" type="email" required/>
          <label>{{ $t('profil.password') }}*:</label>
          <b-form-input v-model="form.password" type="password" required/>
          <b-form-checkbox v-model="form.checked" class="mb-2 mr-sm-2 mb-sm-0">
            {{ $t('login.stay_logged_in') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <router-link to="/forgot-password">{{ $t('login.forgot_password') }}</router-link>
      <br />
      <b-button type="submit" variant="primary">{{ $t('login.login') }}</b-button>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
        checked: false,
      },
      show: true,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
    }),
    async onSubmit(event) {
      event.preventDefault();
      const { form } = this;
      try {
        await this.login(form);
        this.showToast({ message: 'dialogs.login_success', variant: 'success' });
      } catch (e) {
        this.showToast({ message: 'errors.login_error', title: 'Here', variant: 'danger' });
      }
    },
  },
};
</script>
