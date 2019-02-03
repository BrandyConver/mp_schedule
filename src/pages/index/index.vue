<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @click="hideMenu">
    <div v-show="!multi">
      <div v-if="tasks.length>0" class="task_list" >
        <div class='space'></div>
        <div class="task" v-for="task of tasks" :key="task._id" v-if="!task.finished" @click="toDetail(task._id)" @longpress="multiple">
          <div class="task_name">{{task.task_name}}</div>
          <div class="task_time">
            <span v-if="task.long_term" class="long_term">长期任务</span>
            <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
          </div>
        </div>
      </div>        
      <div v-else class='no_task' :style="{minHeight:windowHeight + 'px'}">今天没有任务项</div>
      <div class='space'></div>
    </div>
    
    <div v-show="multi" class="task_list " >
      <div class='space'></div>
      <checkbox-group  @change="select">
        <div class="task" v-for="task of tasks" :key="task._id" v-if="!task.finished" >
            <label :for="task._id" class="checkbox_label">
              <checkbox :id="task._id" :value="task._id"  />
              <div class="check_body">
                <div class="task_name">{{task.task_name}}</div>
                <div class="task_time">
                  <span v-if="task.long_term" class="long_term">长期任务</span>
                  <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
                </div>
              </div>
            </label>
        </div>
      </checkbox-group>
    </div>

    <div class="button-group">
      <div><a href="/pages/edit/main" ><img  v-show="!multi" class="toedit" src="/static/icon/add.png" ></a></div>
      <div @click.stop="openMenu" v-show="!(showMenu||multi)"><img class="openmenu" src="/static/icon/menu.png" ></div>
      <div v-if="showMenu" class='menu'>
        <div class="menuli" @click="toFinished">查看完成</div>
        <div class="menuli">任务总览</div>
        <div class="menuli">更多设置</div>
      </div>
      <div class="multi_btn" v-if="multi">
        <div @click="Delete">删除</div>
        <div>标记完成</div>
        <div @click="multi=false">取消</div>
      </div>
    </div>

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
      windowHeight: '',
      showMenu: false,
      multi: false,
      selected: []
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
    hideMenu () {
      this.showMenu = false;
    },
    select (e) {
      this.selected = e.mp.detail.value;
    },
    multiple () {
      this.multi = true;
      // todo
    },
    Delete () {
      wx.cloud.callFunction({
      name: 'multi',
      data: {
        ids: this.selected
      },
      success: res => {
        console.log(res);
        // 查询数据库
        // const db = wx.cloud.database();
      },
      fail: err => {
        console.error('err' + err);
      }
    });   
    },
    toFinished () {
      wx.navigateTo({url: '/pages/finished/main'})
    }
  },
  onLoad () {
    this.windowHeight = wx.getSystemInfoSync().windowHeight;// 获取窗口高度
  },
  onPullDownRefresh () {
    return true;
    // todo
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

    // 调用云函数,获取openid
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
.checkbox_label{
  display: flex;
  align-items: center;
  flex-direction: row;
}
.check_body{
  flex:auto;
}
.openmenu{
  width:36px;
  height:36px;  
  padding:10px;
  position:fixed;
  border-radius:35px;
  background-color: rgba(41, 179, 128,0.5);
  bottom:20px;
  left:20px;
}
.toedit{
  width:50px;
  height:50px;
  padding:3px;
  position:fixed;
  border-radius:35px;
  background-color:rgba(0, 13, 192, 0.5);
  bottom:20px;
  right:20px;
}
.menu{
  padding:5px 0;
  display:inline-flex;
  flex-direction: column;
  background-color:#FFF;
  border-radius:10px;
  position:fixed;
  bottom:20px;
  left:20px;
  box-shadow:0px 0px 15px #999;
}
.menu>div{
  font-size:20px;
  border-bottom:2px solid #eee;
  padding:10px 5px;
  text-align:center;
}
.menu>div:last-child{
  border:none;
}
.multi_btn{
  position:fixed;
  width:100%;
  bottom:0px;
  display:flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #FFF;
  box-shadow:0px -1px 10px #666;
}
.multi_btn>div{
  padding:2px;
  color:#222;
  border-right:2px solid #DDD;
  flex:1;
  text-align:center;
}
.multi_ben>div:last-child{
  border:none;
}
</style>
