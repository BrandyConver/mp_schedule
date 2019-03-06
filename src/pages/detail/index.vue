<template>
  <div id="detail" :style="{minHeight:windowHeight -10 + 'px'}">
    <div class="task_content">
      <div class="task_name">{{task.task_name}}</div>
      <div class="detail">
        <span>任务详情：</span>
        <div >{{task.detail}}</div>
      </div>
      <div v-if="task.long_term">
        <div class="sp_ard"><span>任务时间：</span><span>长期任务</span></div>
      </div>
      <div v-else>
        <div class="sp_ard"><span>开始时间:</span><span>{{task.start_time}}</span></div>
        <div class="sp_ard"><span>结束时间:</span><span>{{task.end_time}}</span></div>
      </div>
      <div class="sp_ard"><span>修改时间:</span><span>{{task.create_time}}</span>  </div>
    </div>

    <div class="buttons" v-show="isCreator">
      <span @click="toEdit"><img src="/static/icon/edit.png" alt=""></span>
      <span @click="delet"><img src="/static/icon/del1.png" alt=""></span>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      task: {
      },
      isCreator: true,
      windowHeight: wx.getSystemInfoSync().windowHeight
    }
  },
  methods: {
    // 删除任务
    delet () {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '确认删除这项任务',
        success (res) {
          if (res.confirm) {
            _this.tasks
            .doc(_this.id) // _id查询        
            .remove({
              success (res) {
                wx.showToast({
                  title: '删除成功',
                  mask: true
                })
              }
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });
    },
    // 跳转到编辑页 并传递任务详细内容
    toEdit () { // 存入缓存 pending
      let url = `../edit/main?id=${this.id}&task_name=${this.task.task_name}&start_time=${this.task.start_time}&end_time=${this.task.end_time}&detail=${this.task.detail}&long_term=${this.task.long_term}`;
      wx.redirectTo({url});
      wx.setStorage({
        key: 'detail',
        data: this.task.detail
      })
    }
  },
  onShareAppMessage (res) {
    return {
      title: this.task.task_name
    }
  },
  onShow (shrtic) {
    // console.log(shrtic);
  },
  onLoad (options) {
    console.log(options)
    wx.cloud.init();
    // 获取访问者openid
    const getopenid = wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(res => res.result.openid)
    .catch(res => res.errMsg);
    const tasks = wx.cloud.database().collection('tasks');
    this.tasks = tasks;
    this.id = options.id;
    let _this = this;
    // 查询数据库
    const gettask = tasks.doc(_this.id)
    .get().then(res => {
      _this.task = res.data;
      return res.data._openid;
    }).catch(res => res.errMsg);
    Promise.all([getopenid, gettask]).then(([idresult, taskresult]) => {
      if (idresult !== taskresult) {
        this.isCreator = false;
      }
    }).catch(e => { console.log(e) });
    wx.showShareMenu({
      withShareTicket: true
    })
  }
}
</script>

<style>
#detail{
  background-color: rgb(240,240,240);
  border: 1px solid rgb(240,240,240);
  font-size: 20px;
}
.task_content>div{
  margin:10px 0;
}
.sp_ard{
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  margin:10px 0;
  padding:8px 0;
}
.task_name{
  text-align: center;
  font-size: 24px;
  font-size:100%;
}
.detail>span{
  padding:0 20px;
}
.detail>div{
  font-size: 18px;
  white-space: pre-wrap;
  height: 140px;
  line-height: 34px;
  overflow:auto;
  background-color: #fff;
  padding:10px 10px;
}
.buttons{
  justify-content: space-between;
  position: fixed;
  bottom:0;
  width:100%;
  display: flex;
  background: linear-gradient(rgb(240, 240, 240), rgb(255, 255, 255));
}
.buttons>span{
  flex:1;
  text-align: center;
}
.buttons img{
  width:30px;
  height:30px;
}
</style>
