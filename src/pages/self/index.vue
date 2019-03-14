<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <div>
      <div class="space"></div>
      #self #
      <div class="control">first</div>
      <div class="control">second</div>
      <a href="/pages/localSetting/main"><div class="control">setting</div></a>
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
  margin-top:10px;
  height:35px;
  padding:5px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.space{
  height:1px;
}
</style>
