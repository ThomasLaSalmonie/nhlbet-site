<template>
  <b-container fluid>
    <h1>Leaderboard:</h1>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto" v-if="$apolloData.queries.users.loading === false">
        <b-table small :fields="headers" :items="usersData">
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
    };
  },
  apollo: {
    users: {
      query() {
        const query = `
          query users {
            users: users {
              id,
              name,
              points,
            }
          }
        `;
        return gql(query);
      },
    },
  },
  computed: {
    headers() {
      return [
        'rank',
        'name',
        'points',
      ];
    },
    usersData() {
      const results = this.users;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < results.length; i++) {
        results[i].rank = i + 1;
        if (i > 0 && results[i].points === results[i - 1].points) {
          results[i].rank = results[i - 1].rank;
        }
      }
      return results;
    },
  },
  methods: {
  },
};
</script>
