<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <div>
      <div class="space"></div>
      <div class="control"><span>普通任务背景颜色</span><div class="colorpicker" :style="{background: lightnessnor, color:fontColornor}" id="cnor" @tap.stop="pickcolor($event)">#{{col_hex_nor}}</div></div>
      <div class="control"><span>长期任务背景颜色</span><div class="colorpicker" :style="{background: lightnessltm, color:fontColorltm}" id="cltm" @tap.stop="pickcolor($event)">#{{col_hex_ltm}}</div></div>
      <div class='switch control'><span>到期任务自动置为完成&nbsp;&nbsp;<span class="tipSpan" @tap="aboutAutoFin">?</span></span><switch @change="autoFinish" :value="isAutoFin" :checked="isAutoFin"/></div>
      <div class="btns">
        <button @click="save" >save</button>
        <button @click="reset">reset</button>
      </div>
    </div>

    <div class="bgmask" :style="{top:positionY+'px'}" v-show="isPick">
      <div class="pickcolorconp">
        <canvas canvas-id="canvas1" style="width: 200px; height: 200px" id="canvas1" @tap.stop="setLightness($event)"></canvas>
        <canvas canvas-id="canvas2" style="width: 30px; height: 200px" id="canvas2" @tap.stop="setColor($event)"></canvas>
      </div>  
    </div>

    <div v-if="tipMsg!==''" class="tipDiv"><div>{{tipMsg}}</div></div>
  </div>
</template>

<script>
import store from '../../components/store.js';
export default {
  store,
  data () {
    return {
      windowHeight: '',
      colornow: '', // 当前颜色选择器的色调
      colornor: 'rgb(255, 255, 255)',  
      colorltm: 'rgb(255, 255, 255)',
      lightnessnor: '',
      lightnessltm: '',
      isPick: false,
      positionY: 0,
      targetId: '',
      isAutoFin: false,
      tipMsg: ''
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
        },
        success () {
          wx.showToast({
            title: '保存成功',
            mask: true
          });
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    reset () {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '确定恢复初始设置',
        success (res) {
          if (res.confirm) {
            wx.setStorage({
              key: 'localSetting',
              data: {
                lightnessnor: 'rgba(255, 255, 255, 255)',
                colornor: 'rgba(255, 255, 255, 255)',
                lightnessltm: 'linear-gradient(rgb(170, 218, 255), rgb(231, 245, 255))',
                colorltm: 'rgba(255, 255, 255, 255)'
              }
            })
            _this.colornor = _this.colorltm = _this.lightnessnor = 'rgba(255, 255, 255, 255)';
            _this.lightnessltm = 'linear-gradient(rgb(170, 218, 255), rgb(231, 245, 255))'
            _this.isAutoFin = false;
          }
        }
      });
    },
    aboutAutoFin () {
      let _this = this;
      this.tipMsg = '若任务的截止时间超过当前时间，该任务的状态会被自动置为已完成';
      setTimeout(function () {
        _this.tipMsg = '';
      }, 2000);
    },
    autoFinish (e) {
      this.isAutoFin = e.mp.detail.value;
    },
    pickcolor (event) {
      // 确定当前操作元素 设置nowcolor=color(nor/ltm)
      this.targetId = event.target.id;
      if (this.targetId === 'cnor') {
        this.colornow = this.colornor;
      } else {
        this.colornow = this.colorltm;
      }
      this.isPick = true;
      this.positionY = event.target.offsetTop + 40;
      const ctxcl = wx.createCanvasContext('canvas2');
      const colors = ctxcl.createLinearGradient(0, 5, 0, 195); // 垂直色度条↓ 上下预留5px
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
      if (!this.colornow) { this.colornow = 'rgb(255,255,255)' }
      let nowcolor = ctxln.createLinearGradient(10, 10, 190, 10); // 水平亮度条→ 上下左右预留10px 下同
      let imgdata = this.colornow.match(/\d+/ig).map(item => parseInt(item));
      nowcolor.addColorStop(0, '#fff');
      nowcolor.addColorStop(1, `rgb(${imgdata[0]},${imgdata[1]},${imgdata[2]})`); // test `rgb(${res.data[0]},${res.data[1]},${res.data[2]})`
      ctxln.setFillStyle(nowcolor);
      ctxln.fillRect(0, 0, 200, 200);
      let mask = ctxln.createLinearGradient(10, 190, 10, 10); // 垂直渐变↑ 半透明黑
      mask.addColorStop(0, 'rgba(0,0,0,1)');
      mask.addColorStop(1, 'rgba(0,0,0,0)');
      ctxln.setFillStyle(mask);
      ctxln.fillRect(0, 0, 200, 200);
      ctxln.draw();
    },
    setColor (event) {
      let _this = this
      let x = event.x;
      let y = event.y;
      let imgdata;
      const ctxln = wx.createCanvasContext('canvas1');
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
            let lightness = ctxln.createLinearGradient(10, 10, 190, 10);
            lightness.addColorStop(0, '#fff');
            // lightness.addColorStop(1, `rgba(${imgdata})`); // incorrect
            lightness.addColorStop(1, `rgb(${res.data[0]},${res.data[1]},${res.data[2]})`);
            ctxln.setFillStyle(lightness);
            ctxln.fillRect(0, 0, 200, 200);
            // ctxln.draw();
            let mask = ctxln.createLinearGradient(10, 190, 10, 10);
            mask.addColorStop(0, 'rgba(0,0,0,1)');
            mask.addColorStop(1, 'rgba(0,0,0,0)');
            ctxln.setFillStyle(mask);
            ctxln.fillRect(0, 0, 200, 200);
            // tiaoshi
            ctxln.draw();
            if (_this.targetId === 'cnor') {
              _this.colornor = `rgba(${imgdata})`;
              _this.lightnessnor = `rgba(${imgdata})`;
            } else {
              _this.colorltm = `rgba(${imgdata})`;
              _this.lightnessltm = `rgba(${imgdata})`;
            }
          }
        })
      }).exec();
    },
    setLightness (event) {
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
    // 十六进制表示颜色
    col_hex_nor () {
      if (this.lightnessnor) {
        let colArr = this.lightnessnor.match(/\d+/g).slice(0, 3).map((item) => {
          let hexnum = parseInt(item).toString(16).toUpperCase();
          return hexnum.length >= 2 ? hexnum : '0' + hexnum;
        });
        return colArr.join('');
      } else {
        return 'FFF'
      }
    },
    col_hex_ltm () {
      if (this.lightnessltm) {
        let colArr = this.lightnessltm.match(/\d+/g).slice(0, 3).map((item) => {
          let hexnum = parseInt(item).toString(16).toUpperCase();
          return hexnum.length >= 2 ? hexnum : '0' + hexnum;
        });
        return colArr.join('');
      } else {
        return 'FFF'
      }
    },
    // 文本颜色
    fontColornor () {
      if (this.lightnessnor) {
        let color1 = this.lightnessnor.match(/\d+/g).slice(0, 3).reduce((total, cur) => {
          return parseInt(total) + parseInt(cur)
        });
        return color1 > 270 ? '#000' : '#fff';
      }
    },
    fontColorltm () {
      if (this.lightnessltm) {
        let color2 = this.lightnessltm.match(/\d+/g).slice(0, 3).reduce((total, cur) => {
          return parseInt(total) + parseInt(cur)
        });
        return color2 > 270 ? '#000' : '#fff';
      }
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
  margin-left:50%;
  transform: translateX(-50%);
  box-shadow: #666 0 0 20px 5px;
}
.tipSpan{
  display: inline-block;
  border:1px dashed #666;
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
.btns{
  font-weight:bold;
  position:fixed;
  bottom: 0;
  width: 100%;
}
.btns button{
  height: 40px;
  line-height: 40px;
  font-size:20px;
  color:#fff;
}
.btns button:first-of-type{
  background:rgb(3, 194, 28);
  margin: 0 10px;
}
.btns button:nth-of-type(2){
  margin: 10px;
  background:crimson
}
.tipDiv{
  position:absolute;
  top:150px;
  padding: 30px;
  margin:0 50%;
  transform: translateX(-50%);
  width:120px;
  height:120px;
  display: table;
  background: rgba(200,200,200,0.8);
  text-align: center;
  border-radius: 10px;
}
.tipDiv>div{
  display: table-cell;
  vertical-align: middle
}
.space{
  height:1px;
}
</style>
