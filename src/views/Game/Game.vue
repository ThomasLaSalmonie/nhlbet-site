<template>
  <b-container fluid>
    <b-row class="justify-content-md-center" no-gutters>
      <b-col cols="12" md="auto" class="p-2">
        <div class="datepicker-trigger">
          <input
            style="width:200px;"
            type="text"
            id="datepicker-trigger"
            placeholder="Select dates"
            :value="formatDates(dateOne, dateTwo)"
          >

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-trigger'"
            :mode="'range'"
            :fullscreen-mobile="true"
            :date-one="dateOne"
            :date-two="dateTwo"
            @date-one-selected="val => { dateOne = val }"
            @date-two-selected="val => { dateTwo = val }"
          />
        </div>
      </b-col>
      <b-col cols="12" md="auto" class="p-2">
        <b-form-select v-model="selected" :options="teamOptions"/>
      </b-col>
    </b-row>
    <b-container
      class="justify-content-md-center"
    >
      <b-row no-gutters>
        {{ (currentPage - 1) * 10 + 1}} - {{ currentPage * 10}} out of {{ ngames }} results
      </b-row>
    </b-container>
    <b-container
      v-if="$apolloData.queries.games.loading === false"
      class="justify-content-md-center"
    >
      <b-container
        v-for="(game, index) in games"
        :key="index"
        fluid
      >
        <b-card
          class="mb-2"
          :header-bg-variant="headerColor(game)"
          :header="`${game.home_team.name} vs ${game.away_team.name}`"
        >
          <b-card-title v-if="(new Date(game.game_date) - new Date()) >= 0">
            game start at : {{ game.game_date }}
          </b-card-title>
          <b-card-title v-else>game ended</b-card-title>
          <b-row>
            <b-col>
              <b-img
                :src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${game.home_team.id}_dark.svg`"
                :alt="`Logo ${game.home_team.code}`"
                tag="article"
                class="mb-2"
              />
              <h3> {{ game.home_team.code }} </h3>
              <b-button
                v-if="isLoggedIn && (new Date(game.game_date) - new Date()) >= 0"
                variant="warning"
                :disabled="!!game.user_bet.away_amount"
                @click="bet(game, 100, 'home')"
              >
                {{ $t('bets.bet') }} 100
              </b-button>
            </b-col>
            <b-col>
              <b-card
                class="mb-2"
              >
                Score
                <b-card-title>{{ game.home_score }} - {{ game.away_score }}</b-card-title>
                <div v-if="isLoggedIn && (new Date(game.game_date) - new Date()) >= 0">
                  <b-card-text
                    v-if="game.user_bet.home_amount > 0 || game.user_bet.away_amount > 0"
                  >
                    potential win: {{ game.user_bet.potential_win }}
                  </b-card-text>
                  <b-card-text>Total bet: {{ game.total_bet }}</b-card-text>
                  <!-- <b-button variant="primary" @click="bet(game)">{{ $t('bets.bet') }}</b-button> -->
                </div>
              </b-card>
            </b-col>
            <b-col>
              <b-img
                :src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${game.away_team.id}_dark.svg`"
                :alt="`Logo ${game.away_team.code}`"
                tag="article"
                class="mb-2"
              />
              <h3> {{ game.away_team.code }} </h3>
              <b-button
                v-if="isLoggedIn && (new Date(game.game_date) - new Date()) >= 0"
                variant="warning"
                :disabled="!!game.user_bet.home_amount"
                @click="bet(game, 100, 'away')"
              >
                {{ $t('bets.bet') }} 100
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-container>
      <b-pagination
        v-model="currentPage"
        :total-rows="ngames"
        :per-page="perPage"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
      ></b-pagination>
    </b-container>
  </b-container>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {
        home_amount: {},
        away_amount: {},
      },
      selected: null,
      dateFormat: 'D MMM',
      dateOne: '',
      dateTwo: '',
      perPage: 10,
      currentPage: 1,
      rows: 12,
    };
  },
  apollo: {
    games: {
      query() {
        const query = `
          query games($team: Int, $date: String, $offset: Int) {
            games(team: $team, date: $date, offset: $offset) {
              id,
              status,
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
              total_bet,
              user_bet {
                id,
                away_amount,
                home_amount,
                potential_win
              }
            }
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          offset: this.currentPage * 10 - 10,
          team: this.selected,
          date: this.formatDates(this.dateOne, this.dateTwo, ','),
        };
      },
    },
    ngames: {
      query() {
        const query = `
          query ngames($team: Int, $date: String, $offset: Int) {
            ngames(team: $team, date: $date, offset: $offset)
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          offset: this.currentPage * 10,
          team: this.selected,
          date: this.formatDates(this.dateOne, this.dateTwo, ','),
        };
      },
    },
    teams: {
      query() {
        const query = `
          query teams {
            teams {
              value: id,
              text: name
            }
          }
        `;
        return gql(query);
      },
    },
  },
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn', points: 'auth/points' }),
    teamOptions() {
      const options = [{ value: null, text: 'Select a team' }].concat(this.teams);
      return options;
    },
  },
  methods: {
    async bet(game, amount, team) {
      const data = {
        game_id: game.id,
        home_amount: team === 'home'
          ? parseFloat(amount)
          : 0,
        away_amount: team === 'away'
          ? parseFloat(amount)
          : 0,
      };
      const index = this.games.indexOf(game);
      try {
        const mutation = 'mutation patchBet($id: Int, $patch: BetPatch!) { patchBet(id: $id, patch: $patch) { id, potential_win, total_amount } }';
        const response = await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            id: game.user_bet.id,
            patch: data,
          },
        });
        if (team === 'home') {
          this.games[index].user_bet.home_amount = amount;
        } else {
          this.games[index].user_bet.away_amount = amount;
        }
        this.games[index].total_bet = response.data.patchBet.total_amount;
        this.games[index].user_bet.id = response.data.patchBet.id;
        this.games[index].user_bet.potential_win = response.data.patchBet.potential_win;
      } catch (error) {
        console.error(error);
        this.showToast({ message: error.message, title: 'Here', variant: 'danger' });
        // this.games[index].user_bet.messages = response.errors[0].message;
      }
    },
    headerColor(game) {
      if (game.status > 3) {
        return 'danger';
      }
      if (game.status > 1) {
        return 'warning';
      }
      return 'success';
    },
    formatDates(dateOne, dateTwo, separator = ' - ') {
      let formattedDates = '';
      if (dateOne) {
        formattedDates = `${dateOne}`;
      }
      if (dateTwo) {
        formattedDates = `${formattedDates}${separator}${dateTwo}`;
      }
      return formattedDates;
    },
  },
};
</script>
