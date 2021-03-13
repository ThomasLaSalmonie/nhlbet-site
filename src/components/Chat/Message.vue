<template>
  <div
    :class="[
      'd-flex',
      message.user.id !== userId ? 'justify-content-start' : 'justify-content-end',
      samePreviousSender === false && sameNextSender === false ? 'mb-4' : 'mb-1'
      ]"
  >
    <div
      v-if="message.user.id !== userId"
      class="img_cont_msg"
    >
      <img :src="getUrlPath(message.user)" class="rounded-circle user_img_msg">
    </div>
    <div :class="message.user.id !== userId ? 'msg_cotainer' : 'msg_cotainer_send'">
      <span
        v-if="samePreviousSender === false"
        :class="message.user.id !== userId ? 'msg_name' : 'msg_name_send'"
      >
        {{ message.user.name }}
      </span>
      {{ message.text }}
      <span
        v-if="sameNextSender === false"
        :class="message.user.id !== userId ? 'msg_time' : 'msg_time_send'"
      >
        {{ message.created_at }}
      </span>
    </div>
    <div
      v-if="message.user.id === userId"
      class="img_cont_msg"
    >
      <img :src="getUrlPath(message.user)" class="rounded-circle user_img_msg">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Message',
  props: {
    message: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    samePreviousSender: {
      type: Boolean,
      required: false,
      default: false,
    },
    sameNextSender: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({ userId: 'auth/userId' }),
  },
  methods: {
    getUrlPath(item) {
      return item.image !== null ? item.image : require('../../assets/logo.png');
    },
  },
};
</script>

<style lang="scss" scoped>
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
