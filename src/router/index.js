import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Profil/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Profil/Register.vue'),
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('../views/Profil/Profil.vue'),
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('../views/Team/Team.vue'),
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Game/Game.vue'),
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/Leaderboard/Leaderboard.vue'),
  },
];

export default function createRouter() {
  Vue.use(Router);

  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
  });

  return router;
}
