<template>
  <b-container>
  <b-container fluid class="my-5" v-if="$apolloData.queries.user.loading === false && user">
    <h1>{{ $t('global.hello') }}, {{ user.name }}:</h1>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto">
        <label>{{ $t('login.email') }}:</label>
          <b-form-input v-model="user.email" type="email" required />
          <b-button class="m-2 p-1" size="sm" variant="primary">{{ $t('profil.update_email') }}</b-button>
      </b-col>
    </b-row>
    <br />
    <!-- <h2>Your bets:</h2>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto">
        <b-table small :fields="headers" :items="bets">
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
          <template #cell(away_team)="data">
            <b-avatar
              :src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${data.item.away_team.id}_dark.svg`"
            />
          </template>
          <template #cell(home_team)="data">
            <b-avatar
              :src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${data.item.home_team.id}_dark.svg`"
            />
          </template>
        </b-table>
      </b-col>
    </b-row> -->
  </b-container>
  </b-container>
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
    user: {
      query() {
        const query = `
          query user($id: Int!) {
            user(id: $id) {
              id,
              name,
              email,
              points,
              bets {
                id,
                home_amount,
                away_amount,
                game {
                  id,
                  game_date,
                  away_team {
                    id,
                    name,
                    code
                  }
                  away_score,
                  home_team {
                    id,
                    name,
                    code
                  }
                  home_score,
                }
              }
            }
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          id: this.userId,
        };
      },
      skip() {
        return this.userId === null;
      },
    },
  },
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
    headers() {
      return [
        'game_date',
        'away_team',
        'score',
        'home_team',
        'home_amount',
        'away_amount',
        'won_amount',
      ];
    },
    bets() {
      const bets = this.user.bets.map((bet) => {
        const data = {
          id: bet.id,
          game_date: bet.game.game_date,
          away_team: bet.game.away_team,
          score: `${bet.game.home_score} - ${bet.game.away_score}`,
          home_team: bet.game.home_team,
          home_amount: bet.home_amount,
          away_amount: bet.away_amount,
        };
        return data;
      });
      return bets;
    },
  },
  methods: {
  },
};
</script>
