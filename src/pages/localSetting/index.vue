<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    #开发中#
    <div>
      <div class="space"></div>
      <div class="control"><span>普通任务背景颜色</span><div class="colorpicker" :style="{background: lightnessnor}" id="cnor" @tap.stop="pickcolor($event)"></div></div>
      <div class="control"><span>长期任务背景颜色</span><div class="colorpicker" :style="{background: lightnessltm}" id="cltm" @tap.stop="pickcolor($event)"></div></div>
      <div class='switch control'><span>到期任务自动置为完成<span></span>&nbsp;&nbsp;?</span><switch @change="autoFinish" :value="isAutoFin" :checked="isAutoFin"/></div>
      <div>&nbsp;</div>
      <div>111</div>
      <div><button @click="save" >save</button></div>
    </div>

    <div class="bgmask" :style="{top:positionY+'px'}" v-show="isPick">
      <div class="pickcolorconp">
        <canvas canvas-id="canvas1" id="canvas1" @tap.stop="pickLightness($event)"></canvas>
        <canvas canvas-id="canvas2" id="canvas2" @tap.stop="setLightness($event)"></canvas>
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
      // color format rgba(x,x,x,x) or #xxx
      colornow: '', // 当前色调
      colornor: '#fff', 
      colorltm: '#0f0',
      lightnessnor: '',
      lightnessltm: '',
      isPick: false,
      positionY: 0,
      targetId: '',
      isAutoFin: false,
    }
  },
  methods: {
    save () {
      let color1 = this.colornor.match(/d+/g);
      console.log('save');
      console.log(color1);
      // wx.setStorage({
      //   key: 'localSetting',
      //   data: {
      //     colornor: this.colornow,
      //     lightnessnor: this.lightnessnor,
      //     fontColornor: true ? '#000' : '#fff', // use regExp
      //     colorltm: this.colorltm,
      //     lightnessltm: this.lightnessltm,
      //     fontColorltm: true ? '#000' : '#fff', // use regExp
      //   }
      // })
    },
    autoFinish () {

    },
    // target and position
    pickcolor (event) {
      // 确定当前操作元素 设置nowcolor(hex)=color(nor/ltm)
      this.targetId = event.target.id;
      if (this.targetId === 'cnor') {
        this.colornow = this.colornor;
      } else {
        this.colornow = this.colorltm;
      }
      this.isPick = true;
      this.positionY = event.target.offsetTop + 40;
      const ctxcl = wx.createCanvasContext('canvas2');
      const colors = ctxcl.createLinearGradient(0, 0, 0, 200); // 色度条
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
      const ctxln = wx.createCanvasContext('canvas1');
      let nowcolor = ctxln.createLinearGradient(0, 0, 200, 0);
      nowcolor.addColorStop(0, '#fff');
      nowcolor.addColorStop(1, this.colornow);
      ctxln.setFillStyle(nowcolor);
      ctxln.fillRect(0, 0, 200, 200);
      let mask = ctxln.createLinearGradient(0, 200, 0, 0); // 垂直渐变 半透明黑
      mask.addColorStop(0, 'rgba(0,0,0,1)');
      mask.addColorStop(1, 'rgba(0,0,0,0)');
      ctxln.setFillStyle(mask);
      ctxln.fillRect(0, 0, 200, 200);
      ctxln.draw();
    },
    setLightness (event) {
      let _this = this
      let x = event.x;
      let y = event.y;
      let imgdata;
      const ctxln = wx.createCanvasContext('canvas1');
      const lightness = ctxln.createLinearGradient(0, 0, 200, 0);
      lightness.addColorStop(0, '#fff');
      wx.createSelectorQuery().select('#canvas2').boundingClientRect(function (rect) { // async
        y = y - rect.top;
        x = x - rect.left;
        wx.canvasGetImageData({
          canvasId: 'canvas2',
          x,
          y,
          width: 1,
          height: 1,
          success (res) {
            imgdata = res.data.join(',');
            lightness.addColorStop(1, `rgba(${imgdata})`); // 亮度条
            ctxln.setFillStyle(lightness);
            ctxln.fillRect(0, 0, 200, 200);
            let mask = ctxln.createLinearGradient(0, 200, 0, 0); // 垂直渐变
            mask.addColorStop(0, 'rgba(0,0,0,1)');
            mask.addColorStop(1, 'rgba(0,0,0,0)');
            ctxln.setFillStyle(mask);
            ctxln.fillRect(0, 0, 200, 200);
            ctxln.draw();
            if (_this.targetId === 'cnor') {
              _this.colornor = `rgba(${imgdata})`;
              _this.lightnessnor = `rgba(${imgdata})`;
            } else {
              _this.colorltm = `rgba(${imgdata})`;
              _this.lightnessltm = `rgba(${imgdata})`;
            }
            //
          }
        })
      }).exec();
    },
    pickLightness (event) {
      let _this = this;
      let x = event.x;
      let y = event.y;
      let imgdata;
      wx.createSelectorQuery().select('#canvas1').boundingClientRect(function (rect) {
        x = x - rect.left;
        y = y - rect.top;
        wx.canvasGetImageData({
          canvasId: 'canvas1',
          x,
          y,
          width: 1,
          height: 1,
          success (res) {
            imgdata = res.data.join(',');
            if (_this.targetId === 'cnor') {
              _this.lightnessnor = `rgba(${imgdata})`;
            } else {
              _this.lightnessltm = `rgba(${imgdata})`
            }
          }
        });
      }).exec();
    }
  },
  computed: {
  },
  watch: {
    // colornow: function (oval, nval) {
    //   console.log(nval + 'watch');
    // }
  },
  onLoad () {
    store.commit('setHeight', wx.getSystemInfoSync().windowHeight);
    this.windowHeight = store.state.deviceHeight;
  },
  onShow () {
  },
  onHide () {
    this.save();
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
  left: 70px;
  box-shadow: #666 0 0 20px 5px;
}
.pickcolorconp{
  display: flex;
  justify-items: center;
}
canvas{
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
