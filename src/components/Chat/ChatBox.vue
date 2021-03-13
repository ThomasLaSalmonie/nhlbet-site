<template>
  <div>
    <b-container
      fluid
      id="chat-box"
      class="justify-content-center border-bottom"
      style="position:relative; max-height:400px; overflow-y:scroll; padding: 0px;"
    >
      <div class="card-header">
        <div class="card-body msg_card_body">
          <Message
            :id="`message-${message.id}`"
            v-for="(message, index) in messages"
            :key="message.id"
            :message="message"
            :same-previous-sender="index > 0 && messages[index].user.id === messages[index - 1].user.id"
            :same-next-sender="index < messages.length - 1 && messages[index].user.id === messages[index + 1].user.id"
          />
        </div>
      </div>
    </b-container>
    <b-container
      fluid
      style="padding: 0px;"
    >
      <div class="card-footer">
        <div class="input-group">
          <textarea
            class="form-control type_msg"
            placeholder="Type your message..."
            v-model="message"
            v-on:keyup.enter="sendMessage"
          />
          <div class="input-group-append">
            <span
              class="input-group-text send_btn"
              @click="sendMessage"
            >
              <b-icon icon="cursor-fill" />
            </span>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapGetters } from 'vuex';

import Message from '@/components/Chat/Message.vue';

export default {
  name: 'Chatbox',
  components: {
    Message,
  },
  props: {
    groupId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      message: null,
    };
  },
  apollo: {
    messages: {
      query() {
        const query = `
          query messages($groupId: Int!) {
            messages(groupId: $groupId) {
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
        `;
        return gql(query);
      },
      fetchPolicy: 'no-cache',
      variables() {
        return {
          groupId: parseInt(this.groupId),
        };
      },
      // subscribeToMore: {
      //   document() {
      //     const query = `
      //       subscription messageCreated {
      //         messageCreated {
      //           id
      //           text
      //           created_at
      //           user {
      //             id
      //             name: firstname
      //             image
      //           }
      //         }
      //       }`;
      //     return gql(query);
      //   },
      //   updateQuery: (previousData, { subscriptionData }) => {
      //     console.log('here', previousData, subscriptionData);
      //     let messages = [];
      //     if (previousData !== undefined) {
      //       messages = [...previousData.messages, subscriptionData.data.messageCreated];
      //     }
      //     return messages;
      //   },
      // },
    },
  },
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
  },
  async mounted() {
    await this.scrollToLastMessage();
  },
  methods: {
    async scrollToLastMessage() {
      await this.$nextTick();
      if (this.messages !== undefined) {
        const chatBox = document.getElementById('chat-box');
        chatBox.scrollTo(0, this.messages.length * 40);
      }
    },
    async sendMessage() {
      const mutation = `mutation addMessage($item: MessageAdd!) {
        addMessage(item: $item) {
          id
          text
          created_at
          user {
            id
            name: firstname
            image
          }
        }
      }`;
      if (this.message !== null && this.message !== '') {
        try {
          const response = await this.$apollo.mutate({
            mutation: gql(mutation),
            variables: {
              item: {
                text: this.message,
                user_id: this.userId,
                group_id: parseInt(this.$route.params.id),
              },
            },
          });
          this.message = null;
          this.messages.push(response.data.addMessage);
          await this.scrollToLastMessage();
        } catch (error) {
          console.error(error);
          this.showToast({ message: error.message, variant: 'danger' });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.msg_card_body{
  overflow-y: auto;
}
.card-header{
  border-radius: 0 0 0 0 !important;
  border-top: 0 !important;
}
.card-footer{
  border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
}
.type_msg{
  background-color: rgba(0,0,0,0.3) !important;
  border-radius: 15px 0 0 15px !important;
  border:0 !important;
  color:white !important;
  height: 60px !important;
  overflow-y: auto;
}
.type_msg:focus{
  box-shadow:none !important;
  outline:0px !important;
}
.send_btn{
  border-radius: 0 15px 15px 0 !important;
  background-color: rgba(0,0,0,0.3) !important;
  border:0 !important;
  color: white !important;
  cursor: pointer;
}
.user_img_msg{
  height: 40px;
  width: 40px;
  border:1.5px solid #f5f6fa;
}
.img_cont_msg{
    height: 40px;
    width: 40px;
}
.msg_cotainer{
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  border-radius: 25px;
  background-color: #82ccdd;
  padding: 10px;
  position: relative;
}
.msg_cotainer_send{
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  border-radius: 25px;
  background-color: #78e08f;
  padding: 10px;
  position: relative;
}
.user_img_msg{
  height: 40px;
  width: 40px;
  border:1.5px solid #f5f6fa;
}
.img_cont_msg{
    height: 40px;
    width: 40px;
}
.msg_cotainer{
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  border-radius: 25px;
  background-color: #82ccdd;
  padding: 10px;
  position: relative;
}
.msg_cotainer_send{
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  border-radius: 25px;
  background-color: #78e08f;
  padding: 10px;
  position: relative;
}
.msg_time{
  position: absolute;
  left: 0;
  bottom: -15px;
  color: rgba(0,0,0,1);
  font-size: 10px;
}
.msg_name{
  position: absolute;
  left: 0;
  top: -15px;
  color: rgba(0,0,0,1);
  font-size: 10px;
}
.msg_name_send{
  position: absolute;
  right:0;
  top: -15px;
  color: rgba(0,0,0,1);
  font-size: 10px;
}
.msg_time_send{
  position: absolute;
  right:0;
  bottom: -15px;
  color: rgba(0,0,0,1);
  font-size: 10px;
}
</style>
