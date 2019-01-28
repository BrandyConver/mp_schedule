<template>
  <div id="index" :style="{backgroundColor:'rgb(240,240,240):rgb(250,250,250)'}">
    <div v-if="tasks.length>0" class="task_list" @longpress="multiple">
      <div class='space'></div>
      <div class="task" v-for="task of tasks" :key="task._id" @click="toDetail(task._id)" >
        <div class="task_name">{{task.task_name}}</div>
        <div class="task_time">
          <span v-if="task.all_time">长期任务</span>
          <span v-else v-bind:style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
        </div>
      </div>
      <!-- <div>{{time}}</div> -->
    </div>
    <div v-else>今天没有任务项</div>
    <div class='space'></div>
    <div class='edit'><a href="/pages/edit/main" ><img class="toEdit" src="/static/icon/add.png" ></a></div>
  </div>
</template>

<script>
import getTime from '../../components/getTime.js';
export default {
  data () {
    return {
      tasks: [],
      isAuth: true,
      openid: '',
      appid: 'wx62021cbe5853225b',
      timecolor: ['blue', 'rgb(120,20,20)'],
      time: getTime()
    }
  },
  methods: {
    // 跳转至详情页
    toDetail (id) {
      const url = '/pages/detail/main?id=' + id;
      wx.navigateTo({url});
    },
    getUserInfo (e) {
      console.log(e);
    },
    multiple () {
      // do
    }
  },
  // watch () {
  //   openid: function (newval,oldval) {}
  // },
  onLoad () {
    // 使用缓存
  },
  onShow () {
    var _this = this;
    wx.cloud.init();

    // // 获取用户信息
    // wx.getSetting({ // 获取用户设置 
    //   success (res) {
    //     if (res.authSetting['scope.userInfo']) { // 检查userInfo授权
    //       wx.getUserInfo({
    //             success (res) {                 
    //               console.log(res)
    //               // 处理openId
    //             }
    //           })
    //     } else {
    //       wx.navigateTo({url: '/pages/prompt/main'})
    //     }
    //   }
    // })

    // 调用云函数获取openid
    wx.cloud.callFunction({
      name: 'getOpenId',
      data: {},
      success: res => {
        _this.openid = res.result.openid;
        // 查询数据库
        const db = wx.cloud.database();
        db.collection('tasks')
        .where({
          _openid: _this.openid 
        })
        .get({
          success: function (res) {
            _this.tasks = res.data;
          },
          fail (res) {
            console.log(res.errMsg);
          }
        });
      },
      fail: err => {
        console.error('err' + err);
      }
    });   
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(240,240,240);
}
.space{
  height:1px;
}
.task{
  margin: 10px;
  padding: 5px 5px;
  /*border-bottom:1px solid rgb(220,220,220);*/
  border-radius: 10px;
  background-color: rgb(255,255,255);
}
/*.task:first-of-type{
  margin-top: 20px;
  border-top:1px solid rgb(220,220,220);
}*/
.task_name{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task_time{
  font-size:15px;
}
.toEdit{
  width:50px;
  height:50px;
}
.edit{
  width:50px;
  height:50px;
  padding:3px;
  position:fixed;
  border-radius:35px;
  background-color:#1296db;
  bottom:20px;
  right:20px;
}
</style>
