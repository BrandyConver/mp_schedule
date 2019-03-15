<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <div>
      <div class="space"></div>
      <a href="/pages/statistics/main"><div class="control">
        <span><img src="/static/icon/statistics.svg" alt="">&nbsp;&nbsp;任务统计</span>
        <arrow></arrow>
      </div></a>
      <a href="/pages/finished/main"><div class="control">
        <span><img src="/static/icon/finished.svg" alt="">&nbsp;&nbsp;已完成任务</span>
        <arrow></arrow>
      </div></a>
      <a href="/pages/localSetting/main"><div class="control">
        <span><img src="/static/icon/setting.svg" alt="">&nbsp;&nbsp;设置</span>
        <arrow></arrow>
      </div></a>
    </div>
  </div>
</template>

<script>
import store from '../../components/store.js';
import arrow from '../../components/arrow.vue';
export default {
  store,
  data () {
    return {
      windowHeight: ''
    }
  },
  components: {
    'arrow': arrow
  },
  methods: {
  },
  computed: {
  },
  onLoad () {
    this.windowHeight = store.state.deviceHeight;
  },
  onShow () {
  },
  onHide () {
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(230,230,230);
}
.control{
  /* box-sizing: border-box; */
  background-color: rgb(255,255,255);
  padding: 5px 10px;
  margin-top:10px;
  height:35px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.control img{
  transform: translateY(2px);
  display: inline-block;
  width: 20px;
  height: 20px;
}
.space{
  height:1px;
}
</style>
