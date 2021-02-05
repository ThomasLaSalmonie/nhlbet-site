<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col
          v-for="(team, index) in teams"
          :key="index"
        >
          <b-card
            :img-src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${team.id}_dark.svg`"
            :img-alt="`Logo équipe ${team.name}`"
            img-top
            tag="article"
            style="width: 200px;"
            class="mb-2"
            :title="team.name"
          >
            <b-card-text>{{ team.name }}</b-card-text>
            <b-button :href="team.link" variant="primary" target="_blank">{{ $t('teams.official_site') }}</b-button>
          </b-card>
        </b-col>
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
