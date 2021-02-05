<template>
  <div id="app">
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand href="#">
          <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
        </b-navbar-brand>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/teams">Teams</b-nav-item>
        <b-nav-item to="/games">Games</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-button v-if="isLoggedIn === true" disabled size="sm" class="my-2 my-sm-0" variant="warning">{{ gamePoints }} points</b-button>
        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">FR</b-dropdown-item>
        </b-nav-item-dropdown> -->
        <b-nav-item v-if="isLoggedIn === false" to="/login">Login</b-nav-item>
        <b-nav-item-dropdown v-else right>
          <template #button-content>
            <b-avatar/>
          </template>
          <b-dropdown-item to="/profil">Profil</b-dropdown-item>
          <b-dropdown-item @click="handleLogout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// import LoggedOutLayout from './layouts/LoggedOutLayout/LoggedOutLayout';
// import MainLayout from './layouts/MainLayout/MainLayout';

export default {
  name: 'App',
  components: {
    // LoggedOutLayout,
    // MainLayout
  },
  metaInfo() {
    return {
      titleTemplate: `Nhlbet`,
      // link: [
      //   { rel: 'icon', href: require('./../project/assets/img/favicon.png') }
      // ],
    };
  },
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn', points: 'auth/points' }),
    gamePoints() {
      return this.nFormatter(this.points);
    },
  },
  watch: {
    $route(from, to) {
      // Watch navigation & send pageView analytics
      this.$ga.page(to);
    },
  },
  async created() {
    try {
      await this.autoLogin();
    } catch (error) {
      console.log(error);
      // We expect to receive 400 errors if the token has expired
      if (!error.message.includes('400')) {
        this.$reportError({ message: 'errors.login_error' });
      }
    }

    this.applyRedirectsOnStart();
  },
  methods: {
    ...mapActions({
      autoLogin: 'auth/autoLogin',
      logout: 'auth/logout',
    }),
    nFormatter(num) {
      if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(2).replace(/\.0$/, '')}B`;
      }
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2).replace(/\.0$/, '')}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(2).replace(/\.0$/, '')}K`;
      }
      return num;
    },
    handleLogout() {
      this.logout();
    },
    /*
     * Navigation guards for the first Server-side navigation
     * @returns {void}
     */
    applyRedirectsOnStart() {
      // Redirect to dashboard if accessing login page logged in & accessing login page
      if (this.$route.name === 'login' && this.isLoggedIn) {
        this.$router.push('/');
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
