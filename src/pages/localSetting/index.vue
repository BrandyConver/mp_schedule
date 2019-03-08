<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    #开发中#
    <div>
      <div class="space"></div>
      <div class="control"> <span> 普通任务背景颜色</span><div class="colorpicker" id="cnor" @tap.stop="pickcolor($event)"></div></div>
      <div class="control"><span>长期任务背景颜色</span><div class="colorpicker" id="cltm" @tap.stop="pickcolor($event)"></div></div>
      <div class='switch control'>到期任务自动置为完成<switch @change="autoFinish" :value="isAutoFin" :checked="isAutoFin"/></div>
      <div>111</div>
      <div>333</div>
      <div>555</div>
    </div>

    <div class="bgmask" :style="{top:positionY}" v-if="isPick">
      <div class="colorpickerconp" >
        <canvas canvas-id="canvas1" id="canvas1" @tap="pickLightness($event)"></canvas>
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
      colornor: '',
      colorltm: '',
      isPick: false,
      positionY: 0
    }
  },
  methods: {
    save () { // aoto save
      console.log('save')
    },
    // target and position
    pickcolor (event) {
      // let x = event.x;
      // let y = event.y;
      this.isPick = true;
      this.positionY = event.target.offsetTop + 40;
      console.log(event);
      console.log(this.positionY);
    },
    setLightness (event) {
      let x = event.x - event.mp.target.offsetLeft;
      let y = event.y - event.mp.target.offsetTop;
      const ctxln = wx.createCanvasContext('canvas1');
      const lightness = ctxln.createLinearGradient(0, 0, 200, 0);
      lightness.addColorStop(0, '#fff');
      let imgdata;
      wx.canvasGetImageData({
        canvasId: 'canvas2',
        x,
        y,
        width: 1,
        height: 1,
        success (res) {
          imgdata = res.data.join(',');
          lightness.addColorStop(1, `rgba(${imgdata})`);
          ctxln.setFillStyle(lightness);
          ctxln.fillRect(0, 0, 200, 200);
          let mask = ctxln.createLinearGradient(0, 200, 0, 0); // 垂直渐变
          mask.addColorStop(0, 'rgba(0,0,0,1)');
          mask.addColorStop(1, 'rgba(0,0,0,0)');
          ctxln.setFillStyle(mask);
          ctxln.fillRect(0, 0, 200, 200);
          ctxln.draw();
        }
      })
    },
    pickLightness (event) {
      let x = event.x - event.mp.target.offsetLeft;
      let y = event.y - event.mp.target.offsetTop;
      let imgdata;
      wx.canvasGetImageData({
        canvasId: 'canvas1',
        x,
        y,
        width: 1,
        height: 1,
        success (res) {
          imgdata = res.data.join(',');
          console.log(`rgba(${imgdata})`);
        }
      })
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
  width: 80px;
  height: 24px;
  border: 1px solid #000;
}
.bgmask{
  background: rgb(255, 255, 255);
  z-index: 9;
  position: absolute;
  top: 80px;
  left: 0;
  width: 259px;
  border:4px solid red

}
.colorpickerconp{
  border: 1px solid #000;
  margin: 0 auto
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
