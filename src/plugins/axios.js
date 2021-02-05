import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

export default function useAxios() {
  Vue.use(VueAxios, axios);
}
