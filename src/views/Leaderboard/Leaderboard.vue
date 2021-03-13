<template>
  <div>
    <b-tabs
      v-if="this.userId > 0"
      content-class="mt-3"
      lazy
      align="center"
    >
      <b-tab title="Global leaderboard">
        <Leaderboard />
      </b-tab>
      <b-tab
        v-for="group in groups"
        :key="group.id"
        :title="group.name"
        :active="$route.hash === `#${group.id}` || $route.hash == `#${group.name.toLowerCase()}`"
      >
        <Leaderboard
          :groupId="group.id"
        />
      </b-tab>
      <!-- <b-tab
        title="Create new group"
      >
        <b-form @submit="onSubmit">
          <b-row class="justify-content-sm-center">
            <b-col cols="12" sm="auto">
              <label>{{ $t('group.name') }}*:</label>
              <b-form-input v-model="newGroupName" required/>
              </b-form-checkbox>
            </b-col>
          </b-row>
          <br />
          <b-button type="submit" variant="primary">{{ $t('group.create') }}</b-button>
        </b-form>
      </b-tab> -->
    </b-tabs>
    <Leaderboard v-else/>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

import Leaderboard from '@/components/Leaderboard/Leaderboard.vue';

export default {
  components: {
    Leaderboard,
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
        return !this.userId;
      }
    },
  },
  data() {
    return {
      newGroupName: null,
    };
  },
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const mutation = `mutation addGroup($item: GroupAdd!) {
        addGroup(item: $item) {
          id,
          name,
        }
      }`;
      try {
        const response = await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            item: {
              name: this.newGroupName,
              admin_id: this.userId,
            },
          },
        });
        this.user = { ...this.user, ...response.data.addGroup };
      } catch (error) {
        console.error(error);
        this.showToast({ message: error.message, variant: 'danger' });
      }
    },
  },
};
</script>
