<template>
  <div v-if="group">
    <h1> {{ group.name }}</h1>
    <img :src="group.image" style="max-width: 100px;"/>
    <b-container fluid class="my-5">
      <b-row class="justify-content-md-center">
        <b-col>
          <b-tabs
            v-if="group.status > 0"
          >
            <b-tab title="Chat">
              <ChatBox
                :group-id="parseInt($route.params.id)"
              />
            </b-tab>
            <b-tab title="LeaderBoard">
              <Leaderboard
                :groupId="parseInt($route.params.id)"
              />
            </b-tab>
          </b-tabs>
          <div v-else>
            <b-button
              variant="success"
              class="mx-2"
              @click="acceptInvitation(group.id)">
              {{ $t('group.accept') }}
            </b-button>
            <b-button
              variant="danger"
              class="mx-2"
              @click="declineInvitation(group.id)">
              {{ $t('group.decline') }}
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import gql from 'graphql-tag';
import { mapGetters, mapActions } from 'vuex';

import Leaderboard from '@/components/Leaderboard/Leaderboard.vue';
import ChatBox from '@/components/Chat/ChatBox.vue';

export default {
  components: {
    Leaderboard,
    ChatBox,
  },
  name: 'GroupDetails',
  props: {},
  data() {
    return {
    };
  },
  apollo: {
    group: {
      query() {
        const query = `
          query group($id: Int!) {
            group(id: $id) {
              id
              name
              image
              status
              messages {
                id
                text
                created_at
                user {
                  id
                  name: firstname
                  image
                }
              }
            }
          }
        `;
        return gql(query);
      },
      variables() {
        return {
          id: parseInt(this.$route.params.id),
        };
      },
      result(data) {
        if (data.data.group === null) {
          this.$router.push({ name: 'groups' });
        }
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
  },
};
</script>

<style lang="scss" scoped>
</style>
