<template>
  <div id="app">
    <b-sidebar
      id="sidebar"
      bg-variant="dark"
      text-variant="light"
      backdrop
      shadow
    >
      <h4 id="sidebar-no-header-title"><router-link to="/">Home</router-link></h4>
      <div class="px-3 py-2">
        <b-card-title><router-link to="/teams">Teams</router-link></b-card-title>
        <b-card-title><router-link to="/games">Games</router-link></b-card-title>
        <b-card-title><router-link to="/leaderboard">Leaderboard</router-link></b-card-title>
        <b-card-title><router-link to="/about">About</router-link></b-card-title>
      </div>
    </b-sidebar>
    <b-navbar type="dark" variant="dark" class="header">
      <b-navbar-nav>
        <b-navbar-brand>
          <b-nav-item class="d-none d-md-flex"><router-link to="/">Home</router-link></b-nav-item>
          <b-button v-b-toggle.sidebar class="d-sm-block d-md-none"><b-icon icon="list"/></b-button>
        </b-navbar-brand>
      </b-navbar-nav>
      <b-navbar-nav class="d-none d-md-flex">
        <b-nav-item to="/teams">Teams</b-nav-item>
        <b-nav-item to="/games">Games</b-nav-item>
        <b-nav-item to="/leaderboard">Leaderboard</b-nav-item>
        <b-nav-item to="/about">About</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-button v-if="isLoggedIn === true" disabled class="my-2 my-sm-0" variant="warning">
          {{ gamePoints }} <b-icon icon="cash-stack" style="color: black;" />
        </b-button>
        <b-nav-item-dropdown v-if="isLoggedIn === true" right lazy>
          <template #button-content>
            <b-avatar >
              <b-icon icon="bell-fill" :style="unreadNotifications === true ? 'color: red;' : ''" />
            </b-avatar>
          </template>
          <b-card-header>
            Notifications
          </b-card-header>
          <b-card-body
            id="nav-scroller"
            ref="content"
            style="position:relative; height:200px; width:300px; overflow-y:scroll;"
          >
            <b-card
              v-for="(notification, index) in notifications"
              v-b-visible.once="visibleHandler(notification)"
              :key="index"
              bg-variant="dark"
              class="my-2"
            >
              <b-card-text :style="`color: ${notification.text_color}; margin: 0;`">
                <b-icon icon="bell-fill" v-if="notification.is_viewed === false"/>
                {{ notification.text }}
              </b-card-text>
              <p class="text-light" style="font-size: 10px; text-align: right; margin: 0;">
                {{ getDate(notification.created_at) }}
              </p>
            </b-card>
          </b-card-body>
        </b-nav-item-dropdown>
        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">FR</b-dropdown-item>
        </b-nav-item-dropdown> -->
        <b-nav-item v-if="isLoggedIn === false" to="/login">Login</b-nav-item>
        <b-nav-item-dropdown v-else right>
          <template #button-content>
            <b-avatar />
          </template>
          <b-dropdown-item to="/profil">Profil</b-dropdown-item>
          <b-dropdown-item @click="handleLogout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <router-view class="my-5"/>
    <b-navbar type="dark" variant="dark" class="footer">
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="text-center" disabled variant="light">
          {{ new Date().getFullYear() }} - My NFL Bet
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" small>
        <b-nav-item class="text-center" href="https://twitter.com/mysportsbet_" target="blank_">
          <b-icon icon="twitter"/>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import moment from 'moment';
import gql from 'graphql-tag';
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
  apollo: {
    notifications: {
      query() {
        const query = `
          query notifications {
            notifications: notifications {
              id,
              is_viewed,
              text,
              text_color,
              created_at
            }
          }
        `;
        return gql(query);
      },
    },
  },
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn', points: 'auth/points' }),
    gamePoints() {
      return this.nFormatter(this.points);
    },
    unreadNotifications() {
      if (this.notifications !== undefined) {
        return this.notifications
          .find((notification) => notification.is_viewed === false) !== undefined;
      }
      return false;
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
    getDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    visibleHandler(notification) {
      // notification.is_viewed = true;
      console.log(notification);
    },
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

.header{
  position: sticky;
  top: 0;
  z-index: 1000;
}
.footer{
  bottom: 0;
}
</style>
