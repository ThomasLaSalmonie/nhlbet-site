<template>
  <b-container fluid>
    <b-row class="justify-content-center">
      <b-card
        v-for="(group, index) in groups"
        :key="index"
        style="max-width: 170px;"
        class="m-2 mx-auto"
      >
        <b-card-title>{{ group.name }}</b-card-title>
        <img :alt="`${group.name}`" :src="getLogo(group)" style="width:100px;" class="mb-2">
        <div
          v-if="group.status > 0"
        >
          <b-button
            variant="primary"
            class="my-2"
            :to="`/group/${group.id}`">
            {{ $t('group.details') }}
          </b-button>
        </div>
        <div v-else>
          <b-button
            variant="success"
            class="my-2"
            @click="acceptInvitation(group.id)"
          >
            {{ $t('group.accept') }}
          </b-button>
          <b-button
            variant="danger"
            class="my-2"
            @click="declineInvitation(group.id)"
          >
            {{ $t('group.decline') }}
          </b-button>
        </div>
      </b-card>
      <b-card
        style="max-width: 170px;"
        class="m-2 mx-auto"
      >
        <img alt="Nhlbet" src="../../assets/logo.png" style="width:100px;">
        <b-button
          variant="primary"
          class="my-2"
          to="/groups/create">
          {{ $t('group.create') }}
        </b-button>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
/* eslint-disable no-param-reassign */
import gql from 'graphql-tag';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Groups',
  props: {},
  apollo: {
    groups: {
      query() {
        const query = `
          query groups($userId: Int!) {
            groups(userId: $userId) {
              id
              name
              image
              status
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
    ...mapActions({
      acceptInvitation: 'group/acceptInvitation',
      declineInvitation: 'group/declineInvitation',
    }),
    getLogo(group) {
      return group.image !== null ? group.image : require('../../assets/logo.png');
    }
  },
};
</script>
