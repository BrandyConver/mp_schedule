<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 调用 autofin
    wx.cloud.init();
    wx.getStorage({
      key: 'localSetting',
      success (res) {
        if (res.data.isAutoFin) {
          console.log('autofin');
          wx.cloud.callFunction({
            name: 'autoFin',
            data: {}
          }).then(res => {
            console.log(res.result)
          })
        };
      }
    });
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
