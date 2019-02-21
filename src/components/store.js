import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    detail: '',
    deviceHeight: '',
    deviceWidth: '',
    openid: '',
    Setting: {
      longTermColor: 'lightgreen',
      bgColor: 'rgb(240,240,240)'
    }
  },
  mutations: {
    setHeight (state, value) {
      state.deviceHeight = value;
    },
    setWidth (state, value) {
      state.deviceWidth = value;
    },
    setDetail (state, value) {
      state.detail = value;
    },
    setOpenid (state, value) {
      state.openid = value;
    }
  }
});
export default store;
