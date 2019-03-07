<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" >
    #开发中#
    <div>
      <div class="space"></div>
      <div class="control"> <span> 普通任务背景颜色</span><div class="colorpicker"></div></div>
      <div class="control"><span>长期任务背景颜色</span><div class="colorpicker"></div></div>
      <div class='switch control'>到期任务自动置为完成<switch @change="autoFinish" :value="isAutoFin" :checked="isAutoFin"/></div>
    </div>

    <div>
      <div class="colorpickerconp" v-if="true">
        <canvas canvas-id="canvas1" id="canvas1"></canvas>
        <canvas canvas-id="canvas2" id="canvas2" @tap="setLightness($event)"></canvas>
      </div>
    </div>

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
    save () { // aoto save
      console.log('save')
    },
    setLightness (event) {
      let x = event.x - event.mp.target.offsetLeft;
      let y = event.y - event.mp.target.offsetTop;
      console.log(x, y);
    }
  },
  computed: {
  },
  onLoad () {
    store.commit('setHeight', wx.getSystemInfoSync().windowHeight);
    this.windowHeight = store.state.deviceHeight;
  },
  onShow () {
    // colorpicker start
    const ctxcl = wx.createCanvasContext('canvas2');
    const colors = ctxcl.createLinearGradient(0, 0, 0, 200);
    colors.addColorStop(0.0000, '#f00');
    colors.addColorStop(0.1667, '#ff0');
    colors.addColorStop(0.3333, '#0f0');
    colors.addColorStop(0.5000, '#0ff');
    colors.addColorStop(0.6667, '#00f');
    colors.addColorStop(0.8333, '#f0f');
    colors.addColorStop(1.0000, '#f00');
    ctxcl.setFillStyle(colors);
    ctxcl.fillRect(0, 0, 30, 200);
    ctxcl.draw();
    // colorpicker end
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.switch{
  align-items: center;
  display: flex;
  justify-content: space-between;
}
switch{
  margin-bottom:4px;
}
.colorpicker{
  display: inline-block;
  width: 50px;
  height: 20px;
  border: 1px solid #000;
}
.colorpickerconp{
  border: 1px solid #000;

}
canvas{
  border:1px solid #000;
  display: inline-block;
}
#canvas1{
  width: 200px;
  height: 200px;
}
#canvas2{
  margin-left: 10px;
  width: 30px;
  height: 200px;
}
</style>
