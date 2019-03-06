<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" >
    #开发中#
    <div class="space"></div>
    <div class="control">普通任务背景颜色<input type="color"></div>
    <div class="control">长期任务背景颜色</div>
    <div class='switch control'>到期任务自动置为完成<switch @change="autoFinish" :value="isAutoFin" :checked="isAutoFin"/></div>
    
  </div>
</template>

<script>
import store from '../../components/store.js';
// import vcolorpicker from 'vcolorpicker';
export default {
  store,
  data () {
    return {
      windowHeight: '',
      colornor: ''
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
    this.windowHeight = store.state.deviceHeight;
  },
  onShow () {
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(240,240,240);
}
.control{
  background-color: rgb(255,255,255);
  margin-top:10px;
  height:35px;
  padding:5px;
  line-height: 35px;
}
.switch{
  align-items: center;
  display: flex;
  justify-content: space-between;
}
switch{
  margin-bottom:4px;
}
</style>
