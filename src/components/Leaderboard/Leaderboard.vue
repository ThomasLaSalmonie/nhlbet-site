<template>
  <b-container fluid>
    <h2>Leaderboard:</h2>
    <b-container class="justify-content-md-center">
      <b-table small :fields="headers" :items="users" responsive>
        <template #cell(rank)="data">
          <h2 v-if="data.item.rank === 1">
            <b-icon icon="award-fill" class="h1" style="color: #EDCE29;"/>
          </h2>
          <h3 v-else-if="data.item.rank === 2">
            <b-icon icon="award-fill" class="h2" style="color: #CBCBCB;"/>
          </h3>
          <h4 v-else-if="data.item.rank === 3">
            <b-icon icon="award-fill" class="h3" style="color: #B47B44;"/>
          </h4>
          <div v-else> {{ data.item.rank }} </div>
        </template>
        <template #cell(name)="data">
          <h3 v-if="data.item.id === userId">
            {{ data.item.name }} (you)
          </h3>
          <div v-else>
            {{ data.item.name }}
          </div>
        </template>
      </b-table>
    </b-container>
  </b-container>
</template>

<script>
/* eslint-disable no-param-reassign */
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

export default {
  name: 'Leaderboard',
  props: {
    groupId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  apollo: {
    users: {
      query() {
        const query = `
          query users($groupId: Int) {
            users(groupId: $groupId) {
              id,
              name,
              points,
              amount_won,
              bets_won,
              bets_lost,
            }
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          groupId: this.groupId,
        };
      },
      result(data) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.data.users.length; i++) {
          data.data.users[i].rank = i + 1;
          if (i > 0 && data.data.users[i].points === data.data.users[i - 1].points) {
            data.data.users[i].rank = data.data.users[i - 1].rank;
          }
        }
      },
    },
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
    headers() {
      return [
        'rank',
        'name',
        'points',
        'bets_won',
        'bets_lost',
        'amount_won',
      ];
    },
  },
  methods: {
  },
};
</script>
