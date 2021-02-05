<template>

  <b-container fluid>
    <h1>Register</h1> or <router-link to="/login">sign in</router-link>
    <b-form @submit="onSubmit">
      <b-row class="justify-content-md-center">
        <b-col cols="12" md="auto">
          <label>{{ $t('login.firstname') }}*:</label>
          <b-form-input v-model="form.firstname" required/>
          <label>{{ $t('login.lastname') }}*:</label>
          <b-form-input v-model="form.lastname" required/>
          <label>{{ $t('login.sex') }}:</label>
          <b-form-select v-model="form.gender" :options="sex_options" required />
          <label>{{ $t('login.email') }}*:</label>
          <b-form-input v-model="form.email" type="email" required />
          <label>{{ $t('login.password') }}*:</label>
          <b-form-input v-model="form.password" type="password" required />
          <label>{{ $t('login.confirm_password') }}*:</label>
          <b-form-input v-model="form.confirm_password" type="password" required />
        </b-col>
      </b-row>
      <br />
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    <snackbar />
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Snackbar from '@/components/Snackbar/Snackbar.vue';

export default {
  components: {
    Snackbar,
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
        this.$reportSuccess({ message: 'dialogs.register_success' });
      } catch (e) {
        console.log(e);
        this.$reportError({ message: 'errors.register_error' });
      }
    },
  },
};
</script>
