<template>
  <b-container fluid>
    <h1>Register</h1> or <router-link to="/login">sign in</router-link>
    <b-form @submit="onSubmit">
      <b-row class="justify-content-md-center">
        <b-col cols="12" md="auto">
          <label>{{ $t('profil.firstname') }}*:</label>
          <b-form-input v-model="form.firstname" required/>
          <label>{{ $t('profil.lastname') }}*:</label>
          <b-form-input v-model="form.lastname" required/>
          <label>{{ $t('profil.sex') }}:</label>
          <b-form-select v-model="form.gender" :options="sex_options" required />
          <label>{{ $t('profil.email') }}*:</label>
          <b-form-input v-model="form.email" type="email" required />
          <label>{{ $t('profil.password') }}*:</label>
          <b-form-input v-model="form.password" type="password" required />
          <label>{{ $t('profil.confirm_password') }}*:</label>
          <b-form-input v-model="form.confirm_password" type="password" required />
        </b-col>
      </b-row>
      <br />
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Register',
  components: {
  },
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
        gender: 'U',
      },
      sex_options: [
        { value: 'F', text: 'Male' },
        { value: 'M', text: 'Female' },
        { value: 'U', text: 'Not applicable' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  methods: {
    ...mapActions({
      register: 'auth/register',
    }),
    async onSubmit(event) {
      event.preventDefault();
      const { form } = this;
      try {
        await this.register(form);
        this.showToast({ message: 'dialogs.register_success', variant: 'success' });
      } catch (e) {
        this.showToast({ message: 'errors.register_error', variant: 'danger' });
      }
    },
  },
};
</script>
