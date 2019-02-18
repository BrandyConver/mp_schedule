<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @click="hideMenu">
    <div v-show="!multi">
      <div v-if="tasks.length>0" class="task_list" >
        <div class='space'></div>
        <div class="task" :class="{ltt:task.long_term}" v-for="task of tasks" :key="task._id" v-if="!task.finished" @click="toDetail(task._id)" @longpress="multi=true">
          <div class="task_name">{{task.task_name}}</div>
          <div class="task_time">
            <span v-if="task.long_term" class="long_term">长期任务</span>
            <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
          </div>
        </div>
      </div>        
      <div v-else class='no_task' :style="{minHeight:windowHeight + 'px'}">没有未完成的任务</div>
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
      <div class='space2'></div>
    </div>

    <div class="button-group">
      <div><a href="/pages/edit/main" ><img  v-show="!multi" class="toedit" src="/static/icon/add.png" ></a></div>
      <div @click.stop="openMenu" v-show="!(showMenu||multi)"><img class="openmenu" src="/static/icon/menu.png" ></div>
      <div v-if="showMenu" class='menu'>
        <div class="menuli" @click="toFinished">查看完成</div>
        <div class="menuli"><a href='../statistic/main'>任务总览</a></div>
        <div class="menuli">更多设置</div>
      </div>
      <div class="multi_btn" v-if="multi">
        <div @click="remove">删除</div>
        <div @click="finish">标记完成</div>
        <div @click="multi=false">取消</div>
      </div>
    </div>

  </div>
</template>

<script>
import getTime from '../../components/getTime.js';
import store from '../../components/store.js';
export default {
  store,
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
    openMenu () {
      this.showMenu = true;
    },
    hideMenu () {
      this.showMenu = false;
    },
    select (e) {
      this.selected = e.mp.detail.value;
    },
    remove () {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: `确认删除这${this.selected.length}项任务`,
        success (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'multi',
              data: {
                ids: _this.selected,
                operation: 'remove'
              }
            }).then(res => {
                wx.showToast({
                  title: '删除成功',
                  mask: true
                });
                _this.getData(0, 'refresh');
              }).catch(err => {
                console.error('err' + err);
              });
            _this.multi = false;
            _this.selected = undefined;
          }
        }
      });
    },
    finish () {
      let _this = this;
      wx.cloud.callFunction({
        name: 'multi',
        data: {
          ids: this.selected,
          operation: 'finish'
        }
      }).then(res => {
          _this.getData(0, 'refresh');
          console.log('test:126' + res.toString())
        }).catch(err => {
          console.error('err' + err);
        });
      this.multi = false;
      this.selected = undefined;
    },
    toFinished () {
      wx.navigateTo({url: '/pages/finished/main'})
    },
    getData (skip = 0, type = 'refresh') {
      let _this = this;
      const db = wx.cloud.database();
      db.collection('tasks').where({
        _openid: this.openid 
      }).orderBy('long_term', 'asc').orderBy('end_time', 'asc').orderBy('task_name', 'asc').skip(skip).get()
      .then(res => {
        if (type === 'load') {
          _this.tasks = _this.tasks.concat(res.data);
        } else {
          _this.tasks = res.data;
        }
      }).catch(res => {
        console.log(res.errMsg);
      });
    },
    createDefaultTask () {
      // 首次使用,添加一个默认task
      wx.getStorage({
        key: 'hasUsed',
        fail (res) {
          console.log('首次使用' + res);
          wx.setStorage({
            key: 'hasUsed',
            data: 'hasUsed'
          });
          // 注释这段代码出错，先wx.clearStorage()
          wx.cloud.database.collection('tasks').add({
            data: {
              task_name: '使用说明',
              detail: 'detail',
              long_term: false,
              start_time: getTime(),
              end_time: getTime(Date.now() + 3600000),
              finished: false,
              create_time: getTime()
            }
          }).then(res => {
            console.log('生成首个任务')
          }).catch(res => console.log(res));
        }
      });
    }
  },
  computed: {
  },
  onLoad () {
    wx.cloud.init();

    // 从store获取窗口高度
    store.commit('setHeight', wx.getSystemInfoSync().windowHeight);
    this.windowHeight = store.state.minHeight;
  },
  onPullDownRefresh () {
    this.getData(0, 'refresh');
    wx.stopPullDownRefresh();
  },
  onReachBottom () {
    if (this.tasks.length < this.total) {
      this.getData(this.tasks.length, 'load');
    }
    this.time = getTime();
  },
  onShow () {
    // 获取openid
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(res => {
      this.openid = res.result.openid;
      store.commit('setOpenid', this.openid);
      const db = wx.cloud.database();
      // 查询数据库
      db.collection('tasks').where({
        _openid: this.openid 
      }).count().then(res => {
        this.total = res.total;
      });
      this.getData();
    }).catch(err => {
      console.error('err' + err);
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
.space2{
  height:50px;
}
.task{
  margin: 10px;
  padding: 5px 5px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
}
.ltt{
  background-color: rgb(177, 220, 255);
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
  height:50px;
  font-size: 20px;
  font-family: 'Microsoft-Yahei';
  align-items: center;
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
