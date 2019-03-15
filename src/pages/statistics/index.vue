<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <div class="space"></div>
    <div class="content">
      <div class="list-item">
        <span>未完成任务数</span>
        <span>unfinCount</span>
      </div>      
      <div class="list-item">
        <span>本月完成任务</span>
        <span>mthCount</span>
      </div>
      <div class="list-item">
        <span>本年完成任务</span>
        <span>yearCount</span>
      </div>
      <div class="list-item">
        <span>累计完成任务</span>
        <span>totalCount</span>
      </div>      
    </div>
  </div>
</template>

<script>
import store from '../../components/store.js';
export default {
  store,
  data () {
    return {
      windowHeight: ''
    }
  },
  methods: {
  },
  onLoad () {
    this.windowHeight = store.state.deviceHeight + 50;
  },
  onShow () {
  },
  onHide () {
    // this.save();
    this.isPick = false;
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(230,230,230);
}
.list-item{
  margin: 0 10px;
  padding: 10px;
  height: 35px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #999;
}
.list-item:last-child{
  border-bottom: none;
}
.space{
  height:1px;
}
.content{
  background: rgb(255,255,255);
}
</style>
