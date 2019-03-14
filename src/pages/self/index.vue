<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <div>
      <div class="space"></div>
      #self #
      <a href="/pages/localSetting/main"><div class="control">
        <span><img src="/static/icon/setting.svg" alt="">任务统计</span>
        <!-- <img src=""> -->
        <span>></span>
      </div></a>
      <a href="/pages/localSetting/main"><div class="control">
        <span><img src="/static/icon/setting.svg" alt="">已完成任务</span>
        <!-- <img src=""> -->
        <span>></span>
      </div></a>
      <a href="/pages/localSetting/main"><div class="control">
        <span><img src="/static/icon/setting.svg" alt="">设置</span>
        <!-- <img src=""> -->
        <span>></span>
      </div></a>
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
  computed: {
  },
  onLoad () {
    this.windowHeight = store.state.deviceHeight;
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
.control{
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
  width: 20px;
  height: 20px;
}
.space{
  height:1px;
}
</style>
