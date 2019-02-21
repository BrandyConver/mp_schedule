<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" >
    个人设置
    开发中
  </div>
</template>

<script>
import store from '../../components/store.js';
export default {
  store,
  data () {
    return {
      a: 'a'
    }
  },
  methods: {
    save () {
      console.log('save')
    }
  },
  computed: {
  },
  onLoad () {
    store.commit('setHeight', wx.getSystemInfoSync().windowHeight);
    this.windowHeight = store.state.minHeight;
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
