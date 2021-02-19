<template>
  <div>
    <b-container fluid>
      <b-row class="justify-content-md-center">
      <b-card
        v-for="(team, index) in teams"
        :key="index"
        tag="article"
        style="max-width: 170px;"
        class="m-2 mx-auto"
      >
        <b-card-title>{{ team.name }}</b-card-title>
        <b-img
          :src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${team.id}_dark.svg`"
          :alt="`Logo équipe ${team.name}`"
          class="m-1"
        />
        <b-button :href="team.link" variant="primary" target="_blank">{{ $t('teams.official_site') }}</b-button>
      </b-card>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
    };
  },
  apollo: {
    teams: {
      query() {
        const query = `
          query teams {
            teams: teams {
              id,
              name,
              link
            }
          }
        `;
        return gql(query);
      },
    },
  },
  computed: {
  },
  methods: {
  },
};
</script>
