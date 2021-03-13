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
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('../components/Login/Login.vue'),
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../components/Login/Register.vue'),
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('../components/Login/ResetPassword.vue'),
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('../components/Login/ForgotPassword.vue'),
      },
    ],
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('../views/Profil/Profil.vue'),
    meta: {
      auth: true,
    },
    children: [
      {
        path: '',
        name: 'profil',
        component: () => import('../components/Profil/Profil.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: '/groups',
        name: 'groups',
        component: () => import('../components/Profil/Groups.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: '/group/:id',
        name: 'group-details',
        component: () => import('../components/Profil/GroupDetails.vue'),
        meta: {
          auth: true,
        },
      },
      {
        path: '/groups/create',
        name: 'group-create',
        component: () => import('../components/Profil/GroupsCreate.vue'),
        meta: {
          auth: true,
        },
      },
    ],
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
