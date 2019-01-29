<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}">
    <div v-if="tasks.length>0" class="task_list" @longpress="multiple">
      <div class='space'></div>
      <div class="task" v-for="task of tasks" :key="task._id" v-if="!task.finished" @click="toDetail(task._id)" >
        <div class="task_name">{{task.task_name}}</div>
        <div class="task_time">
          <span v-if="task.long_term" class="long_term">长期任务</span>
          <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
        </div>
      </div>
    </div>
    <div v-else class='no_task' :style="{minHeight:windowHeight + 'px'}">今天没有任务项</div>
    <div class='space'></div>
    <div><a href="/pages/edit/main" ><img class="edit" src="/static/icon/add.png" ></a></div>
    <div @click="openMenu" v-show="!showMenu"><img class="menu" src="/static/icon/menu.png" ></div>
    <div v-show="showMenu" class=menu></div>
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
      time: getTime(),
      windowHeight: ''
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
    openMenu () {
      this.showMenu = true;
    },
    // 多选操作
    multiple () {
    }
  },
  onLoad () {
    this.windowHeight = wx.getSystemInfoSync().windowHeight;// 获取窗口高度
  },
  onPullDownRefresh () {
    return true;
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
/* page{ 无效
  background-color:rgb(240,240,240);
} */
#index{
  background-color:rgb(240,240,240);
}
.space{
  height:1px;
}
.task{
  margin: 10px;
  padding: 5px 5px;
  border-radius: 10px;
  background-color: rgb(255,255,255);
}
.task_name{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task_time{
  font-size:15px;
}
.no_task{
  text-align: center;
  padding-top: 10px;
  font-size:18px;
}
.long_term{
  color:blue;
}
.menu{
  width:36px;
  height:36px;  
  padding:10px;
  position:fixed;
  border-radius:35px;
  background-color: rgba(41, 179, 128,0.5);
  bottom:20px;
  left:20px;
}
.edit{
  width:50px;
  height:50px;
  padding:3px;
  position:fixed;
  border-radius:35px;
  background-color:rgba(0, 13, 192, 0.5);
  bottom:20px;
  right:20px;
}
</style>
