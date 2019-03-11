<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    #开发中#
    <div>
      <div class="space"></div>
      <div class="control"><span>普通任务背景颜色</span><div class="colorpicker" :style="{background: lightnessnor, color:fontColornor}" id="cnor" @tap.stop="pickcolor($event)">#{{col_hex_nor}}</div></div>
      <div class="control"><span>长期任务背景颜色</span><div class="colorpicker" :style="{background: lightnessltm, color:fontColorltm}" id="cltm" @tap.stop="pickcolor($event)">#{{col_hex_ltm}}</div></div>
      <div class='switch control'><span>到期任务自动置为完成&nbsp;&nbsp;<span class="tipSpan" @tap="tipAutoFin">?</span></span><switch @change="autoFinish" :value="isAutoFin" :checked="isAutoFin"/></div>
      <div>&nbsp;</div>
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
      colornow: '', // 当前色调
      colornor: '#fff',  
      colorltm: '#fff',
      lightnessnor: '',
      lightnessltm: '',
      isPick: false,
      positionY: 0,
      targetId: '',
      isAutoFin: false
    }
  },
  methods: {
    save () {
      wx.setStorage({
        key: 'localSetting',
        data: {
          colornor: this.colornor,
          lightnessnor: this.lightnessnor,
          fontColornor: this.fontColornor,
          colorltm: this.colorltm,
          lightnessltm: this.lightnessltm,
          fontColorltm: this.fontColorltm,
          isAutoFin: this.isAutoFin
        }
      })
    },
    autoFinish (e) {
      this.isAutoFin = e.mp.detail.value;
    },
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
    },
    tipAutoFin () {
      //
    }
  },
  computed: {
    col_hex_nor () {
      let colArr = this.lightnessnor.match(/\d+/g).slice(0, 3).map((item) => { // Cannot read property 'slice' of null
        let hexnum = parseInt(item).toString(16).toUpperCase();
        return hexnum.length >= 2 ? hexnum : '0' + hexnum;
      });
      return colArr.join('');
    },
    col_hex_ltm () {
      let colArr = this.lightnessltm.match(/\d+/g).slice(0, 3).map((item) => { // Cannot read property 'slice' of null
        let hexnum = parseInt(item).toString(16).toUpperCase();
        return hexnum.length >= 2 ? hexnum : '0' + hexnum;
      });
      return colArr.join('');
    },
    // 文本颜色
    fontColornor () {
      let color1 = this.lightnessnor.match(/\d+/g).slice(0, 3).reduce((total, cur) => {
        return parseInt(total) + parseInt(cur)
      });
      return color1 > 270 ? '#000' : '#fff';
    },
    fontColorltm () {
      let color2 = this.lightnessltm.match(/\d+/g).slice(0, 3).reduce((total, cur) => {
        return parseInt(total) + parseInt(cur)
      });
      return color2 > 270 ? '#000' : '#fff';
    }
  },
  watch: {
  },
  onLoad () {
    let _this = this;
    store.commit('setHeight', wx.getSystemInfoSync().windowHeight);
    this.windowHeight = store.state.deviceHeight;
    wx.getStorage({
      key: 'localSetting',
      success (res) {
        console.log(res.data);
        _this.lightnessnor = res.data.lightnessnor;
        _this.lightnessltm = res.data.lightnessltm;
        _this.colornor = res.data.colornor; 
        _this.colorltm = res.data.colorltm;
        _this.isAutoFin = res.data.isAutoFin;
      }
    })
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
  width: 90px;
  height: 24px;
  border: 1px solid #666;
  text-align: center;
  line-height: 24px;
}
.bgmask{
  background: rgb(255, 255, 255);
  z-index: 9;
  position: absolute;
  top: 80px;
  left: 70px;
  box-shadow: #666 0 0 20px 5px;
}
.tipSpan{
  display: inline-block;
  border:1px solid #666;
  border-radius:99px;
  font-size: 16px;
  width:18px;
  height:18px;
  line-height: 18px;
  text-align: center;
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
