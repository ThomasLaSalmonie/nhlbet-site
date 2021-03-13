<template>
  <b-container fluid class="my-5" v-if="$apolloData.queries.user.loading === false && user">
    <h1>{{ $t('global.hello') }}, {{ user.name }}:</h1>
    <img :src="user.image" style="max-width: 100px;"/>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="auto">
        <label>{{ $t('profil.firstname') }}:</label>
        <b-form-input v-model="user.firstname" />
        <label>{{ $t('profil.lastname') }}:</label>
        <b-form-input v-model="user.lastname" />
        <label class="mt-2">{{ $t('profil.image') }}:</label>
        <div>
          <b-form-file
            v-model="image"
            accept="image/*"
            @input="onFilePicked"
          />
          <img
            class="py-2"
            :src="fileInfo.url"
            style="max-width: 300px; max-height: 150px;"
          >
        </div>
        <label>{{ $t('profil.password') }}:</label>
        <b-form-input v-model="user.password" type="password" />
        <label>{{ $t('profil.confirm_password') }}:</label>
        <b-form-input v-model="user.confirm_password" type="password" />
        <label>{{ $t('profil.display_name') }}:</label>
        <b-form-checkbox v-model="user.display_name" name="display_name" switch />
        <b-button class="m-2 p-1" size="sm" variant="primary" @click="submit">
          {{ $t('profil.update_profil') }}
        </b-button>
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
</template>

<script>
/* eslint-disable no-param-reassign */
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

export default {
  name: 'Profil',
  props: {},
  data() {
    return {
      fileInfo: {},
      image: null,
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
              firstname,
              lastname,
              image,
              email,
              display_name,
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
    onFilePicked(file) {
      if (file !== undefined) {
        const { name } = file;
        if (name.lastIndexOf('.') <= 0) {
          return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', () => {
          const objectFile = file;
          const url = fileReader.result;
          this.fileInfo = { name, file: objectFile, url };
        });
      }
    },
    async submit() {
      const {
        // eslint-disable-next-line camelcase
        firstname, lastname, password, confirm_password, display_name,
      } = this.user;
      const mutation = `mutation patchUser($id: Int!, $patch: UserPatch!) {
        patchUser(id: $id, patch: $patch) {
          id,
          firstname,
          lastname,
          display_name,
          image,
        }
      }`;
      try {
        const response = await this.$apollo.mutate({
          mutation: gql(mutation),
          variables: {
            id: this.userId,
            patch: {
              firstname,
              lastname,
              password,
              confirm_password,
              display_name,
              image: this.fileInfo,
            },
          },
        });
        this.user = { ...this.user, ...response.data.patchUser };
      } catch (error) {
        console.error(error);
        this.showToast({ message: error.message, variant: 'danger' });
      }
    },
  },
};
</script>
