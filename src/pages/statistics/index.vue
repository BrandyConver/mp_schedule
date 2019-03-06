<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" >
    统计页
    开发中
  </div>
</template>

<script>
// import getTime from '../../components/getTime.js';
import store from '../../components/store.js';
export default {
  store,
  data () {
    return {
      
    }
  },
  methods: {
  },
  computed: {
  },
  onLoad () {
    store.commit('setHeight', wx.getSystemInfoSync().windowHeight);
    this.windowHeight = store.state.minHeight;
    wx.cloud.database().collection('tasks').where({
      _openid: this.openid,
      finished: false
    }).count()
    wx.cloud.database().collection('tasks').where({
      _openid: this.openid,
      finished: false
    }).count().then(res => {
      this.total = res.total;
    });
  },
  onShow () {
  }
}
</script>

<style scoped>
/* #index{
  background-color:rgb(240,240,240);
} */

</style>
