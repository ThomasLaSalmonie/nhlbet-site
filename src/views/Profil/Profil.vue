<template>
  <div>
    <b-row align-h="end">
      <b-col cols="2">
        <b-button v-b-toggle.menu_profil class="d-md-none"><b-icon icon="list"/></b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="9">
        <router-view />
      </b-col>
      <b-col cols="3" class="border-left d-none d-md-block">
        <b-card-title><router-link to="/profil">Profil</router-link></b-card-title>
        <b-card-title><router-link to="/groups">Your groups</router-link></b-card-title>
        <b-list-group
          class="pr-3"
        >
          <b-list-group-item
            v-for="group in groups"
            :key="group.id"
            :to="`/group/${group.id}`"
          >
            {{ group.name }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-sidebar
        id="menu_profil"
        right
        backdrop
        shadow
      >
        <b-col cols="12">
          <b-card-title><router-link to="/profil">Profil</router-link></b-card-title>
          <b-list-group>
            <b-card-title><router-link to="/groups">Your groups</router-link></b-card-title>
            <b-list-group-item
              v-for="group in groups"
              :key="group.id"
              :to="`/group/${group.id}`"
            >
              {{ group.name }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-sidebar>
    </b-row>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
    };
  },
  apollo: {
    groups: {
      query() {
        const query = `
          query groups($userId: Int!) {
            groups(userId: $userId) {
              id,
              name,
            }
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          userId: this.userId,
        };
      },
      skip() {
        return this.userId === null;
      },
    },
  },
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
  },
  methods: {
  },
};
</script>
