<template>
  <b-container fluid>
    <b-row class="justify-content-md-center">
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
      v-if="$apolloData.queries.games.loading === false"
      class="justify-content-md-center"
    >
      <b-row
          v-for="(game, index) in games"
          :key="index"
          >
        <b-card
          class="mb-2"
          :header-bg-variant="headerColor(game)"
          :header="`${game.home_team.name} vs ${game.away_team.name}`"
        >
          <b-row>
            <b-col>
              <b-card
                :img-src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${game.home_team.id}_dark.svg`"
                :img-alt="`Logo équipe test`"
                img-top
                tag="article"
                style="width: 200px;"
                class="mb-2"
                :title="game.home_team.code"
              >
              </b-card>
            </b-col>
            <b-col>
              <b-card-title v-if="(new Date(game.game_date) - new Date()) >= 0">game start at : {{ game.game_date }}</b-card-title>
              <b-card-title v-else>game ended</b-card-title>
              <b-card
                style="width: 300px;"
                class="mb-2"
                title="Score"
              >
                <b-card-title>{{ game.home_score }} - {{ game.away_score }}</b-card-title>
                <div v-if="isLoggedIn && (new Date(game.game_date) - new Date()) >= 0">
                  <b-row>
                    <b-col>
                      <b-form-input
                        v-model="game.user_bet.home_amount"
                        type="number"
                        placeholder="0"
                        :disabled="!!game.user_bet.away_amount"
                      />
                    </b-col>
                    <b-card-text>_</b-card-text>
                    <b-col>
                      <b-form-input
                        v-model="game.user_bet.away_amount"
                        type="number"
                        placeholder="0"
                        :disabled="!!game.user_bet.home_amount"
                      />
                    </b-col>
                  </b-row>
                  <br />

                  <b-card-text v-if="game.user_bet.home_amount > 0 || game.user_bet.away_amount > 0">potential win: {{ game.user_bet.potential_win }} </b-card-text>
                  <b-button variant="primary" @click="bet(game)">{{ $t('bets.bet') }}</b-button>
                </div>
              </b-card>
            </b-col>
            <b-col>
              <b-card
                :img-src="`https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${game.away_team.id}_dark.svg`"
                :img-alt="`Logo équipe test`"
                img-top
                tag="article"
                style="width: 200px;"
                class="mb-2"
                :title="game.away_team.code"
              >
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-row>
    </b-container>
    <b-container
      v-else
      class="justify-content-md-center"
    >
      <b-card
        v-for="i in 4"
        :key="i"
        class="mb-2"
        :header="`... vs ...`"
      >
        <b-row>
          <b-col>
            <b-card no-body img-top>
              <b-skeleton-img card-img="top" aspect="3:1"></b-skeleton-img>
              <b-card-body>XXX</b-card-body>
            </b-card>
          </b-col>
          <b-col>
            <b-card-title>game start at : </b-card-title>
            <b-card
              style="width: 300px;"
              class="mb-2"
              title="Score"
            >
              <b-card-title>0 - 0</b-card-title>
            </b-card>
          </b-col>
          <b-col>
            <b-card no-body img-top>
              <b-skeleton-img card-img="top" aspect="3:1"></b-skeleton-img>
              <b-card-body>XXX</b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-card>
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
    };
  },
  apollo: {
    games: {
      query() {
        const query = `
          query games($team: Int, $date: String) {
            games(team: $team, date: $date) {
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
    async bet(game) {
      const data = {
        game_id: game.id,
        home_amount: parseFloat(game.user_bet.home_amount) > 0
          ? parseFloat(game.user_bet.home_amount)
          : 0,
        away_amount: parseFloat(game.user_bet.away_amount) > 0
          ? parseFloat(game.user_bet.away_amount)
          : 0,
      };
      console.log(typeof data.home_amount);

      try {
        const mutation = 'mutation patchBet($id: Int, $patch: BetPatch!) { patchBet(id: $id, patch: $patch) { id, potential_win } }';
        const response = await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            id: game.user_bet.id,
            patch: data,
          },
        });
        const index = this.games.indexOf(game);
        this.games[index].user_bet.id = response.data.patchBet.id;
        this.games[index].user_bet.potential_win = response.data.patchBet.potential_win;
      } catch (e) {
        console.log(e);
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
