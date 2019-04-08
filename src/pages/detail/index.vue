<template>
  <div id="detail" :style="{minHeight:windowHeight + 40 + 'px'}">
    <div class="task_content">
      <div class="task_name">{{task.task_name}}</div>
      <div class="detail">
        <span>任务详情：</span>
        <div @tap="doubleTap">{{task.detail}}</div>
      </div>
      <div class="sp_ard"><span>任务状态:</span><span class="status">{{task.finished?'已完成':'未完成'}}</span></div>
      <div class="sp_ard"><span>置顶:</span><span class="status">{{task.isTop?'是':'否'}}</span></div>
      <div v-if="task.long_term">
        <div class="sp_ard"><span>任务时间:</span><span class="status">长期任务</span></div>
      </div>
      <div v-else>
        <div class="sp_ard"><span>开始时间:</span><span>{{task.start_time}}</span></div>
        <div class="sp_ard"><span>结束时间:</span><span>{{task.end_time}}</span></div>
      </div>
      <div class="sp_ard"><span>修改时间:</span><span>{{task.create_time}}</span></div>
    </div>
    <div class="buttons" v-show="isCreator">
      <span @click="toEdit"><img src="/static/icon/edit.png" alt=""></span>
      <span @click="finish"><img src="/static/icon/finishtask.png" alt=""></span>
      <span @click="delet"><img src="/static/icon/del1.png" alt=""></span>
    </div>
    <div class="load-div" v-show="loading">
      <Loading></Loading>
    </div>
  </div> 
</template>

<script>
import loading from '../../components/loading.vue';
export default {
  components: {
    'Loading': loading
  },
  data () {
    return {
      task: {
      },
      id: '',
      isCreator: true,
      lastTap: 0,
      windowHeight: wx.getSystemInfoSync().windowHeight,
      loading: true
    }
  },
  methods: {
    doubleTap (e) {
      if (e.timeStamp - this.lastTap <= 350) {
        this.toEdit();
      }
      this.lastTap = e.timeStamp;
    },
    finish () {
      this.tasks.doc(this.id).update({
        data: {
          finished: true
        }
      }).then(res => {       
        wx.navigateBack({
          delta: 1
        })
      }).catch(res => {
        console.log(res.errMsg)
      });
    },
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
            });
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });
    },
    // 跳转到编辑页 并传递任务详细内容
    toEdit () { // 存入缓存 pending
      let url = `../edit/main?id=${this.id}&task_name=${this.task.task_name}&start_time=${this.task.start_time}&end_time=${this.task.end_time}&detail=${this.task.detail}&long_term=${this.task.long_term}&isTop=${this.task.isTop}`;
      wx.redirectTo({url});
      wx.setStorage({
        key: 'detail',
        data: this.task.detail
      })
    }
  },
  watch: {
    id () {
      this.loading = true;
    },
    task () {
      this.loading = false;
    }
  },
  onShareAppMessage (res) {
    return {
      title: this.task.task_name
    }
  },
  onShow (shrtic) {
    // this.loading = true;
    // console.log(shrtic) // share
  },
  onLoad (options) {
    this.loading = true;
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
    // promise.all 处理两个异步
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
  background-color: rgb(230,230,230);
  border: 1px solid rgb(230,230,230);
  font-size: 18px;
}
.task_content>div{
  margin:10px 0;
}
.sp_ard{
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  margin:10px 0;
  padding:8px 10%;
  text-align:center;
}
.sp_ard span:first-of-type{
  align-self: flex-start;
  width: 30%;
  flex: none
}
.status{
  margin-left: 40px;
  flex: 1;
  text-align: center;
}
.task_name{
  text-align: center;
  font-size: 20px;
  font-weight: normal;
  /* font-size:100%; */
}
.detail>span{
  padding:0 20px;
}
.detail>div{
  white-space: pre-wrap;
  min-height: 140px;
  max-height: 220px;
  line-height: 34px;
  overflow:auto;
  background-color: #fff;
  padding:5px 10px;
}
.buttons{
  padding: 5px 0;
  justify-content: space-between;
  position: fixed;
  bottom:0;
  width:100%;
  display: flex;
  background: linear-gradient(rgb(230, 230, 230), rgb(255, 255, 255));
}
.buttons>span{
  flex:1;
  text-align: center;
}
.buttons img{
  width:30px;
  height:30px;
}
.load-div{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(80, 80, 80, 0.7);
}
</style>
