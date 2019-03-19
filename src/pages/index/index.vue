<template>
  <div id="index" :style="{minHeight:minHeight + 'px'}"  @touchstart="touchStart" @touchend="touchEnd" >
    <div v-show="!multi">
      <div class='space'></div>
      <div class='searchbox'>
        <input type="text" comfirm-type='search' placeholder="搜索标题或内容" v-model="word" @confirm='search' class='search' @input="clear">
        <img src="/static/icon/search.svg" alt="" @tap="search">
      </div>
      <div v-if="tasks.length>0" class="task_list" >
        <div class="task" :class="{ltt:task.long_term}" :style="{background:task.long_term?localSetting.lightnessltm:localSetting.lightnessnor}"
          v-for="task of tasks" :key="task._id" @click="toDetail(task._id)" @longpress="multi=true">
          <div class="task_name" :style="{color:task.long_term?localSetting.fontColorltm:localSetting.fontColornor}">{{task.task_name}}</div>
          <div class="task_time">
            <span v-if="task.long_term" class="long_term" :style="{color:localSetting.fontColorltm=='#fff'?'#ddd':'#222'}">长期任务</span>
            <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
          </div>
        </div>
      </div>        
      <div v-else class='no_task' :style="{minHeight:minHeight + 'px'}">{{errMsg}}</div>
      <div class='space'></div>
    </div>
    
    <div v-if="multi" class="task_list " >
      <div class='space2'></div>
      <checkbox-group  @change="select">
        <div class="task" v-for="task of tasks" :key="task._id">
            <label :for="task._id" class="checkbox_label">
              <checkbox :id="task._id" :value="task._id" :checked="false" />
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
      <div class='space1'></div>
    </div>

    <div class="button-group">
      <div><a href="/pages/edit/main" ><img  v-show="!multi" class="toedit" src="/static/icon/add.png" ></a></div>
      <div class="multi_btn" v-if="multi">
        <div @click="remove">删除</div>
        <div @click="finish">标记完成</div>
        <div @click="multi=false; selected = []">取消</div>
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
      errMsg: '没有未完成的任务',
      tasks: [],
      openid: '',
      appid: 'wx62021cbe5853225b',
      timecolor: ['rgb(10, 30, 90)', 'rgb(120,20,20)'],
      time: getTime(),
      minHeight: '',
      multi: false,
      selected: [],
      localSetting: {}
    }
  },
  methods: {
    // 跳转至详情页
    toDetail (id) {
      const url = '/pages/detail/main?id=' + id;
      wx.navigateTo({url});
    },
    select (e) {
      this.selected = e.mp.detail.value;
    },
    search (e) { // 全局搜索
      let word = new RegExp(this.word.trim(), 'ig');
      const dbtask = wx.cloud.database().collection('tasks');
      let schname = 
      dbtask.where({
        _openid: this.openid,
        task_name: word
      }).field({
        task_name: true,
        _id: true,
        start_time: true,
        end_time: true,
        long_term: true
      })
      .get().then(res => {
        return res.data;
      }).catch(res => {
        console.log(res.errMsg);
      });
      let schdtl = 
      dbtask.where({
        _openid: this.opneid,
        detail: word
      }).field({
        task_name: true,
        _id: true,
        start_time: true,
        end_time: true,
        long_term: true
      })
      .get().then(res => {
        return res.data;
      }).catch(res => {
        console.log(res.errMsg);
      });
      // 用 Set数据结构 合并 去重
      Promise.all([schname, schdtl]).then(([result1, result2]) => {
        let result = [...new Set([...result1, ...result2])]
        if (result.length <= 0) {
          this.errMsg = '没有符合的结果'
        }
        this.tasks = result;
      })
    },
    clear (e) { // 清空搜索框时恢复原tasks列表
      let _this = this;
      if (e.mp.detail.value === '') {
        wx.getStorage({
          key: 'hometasks',
          success (res) {
            _this.tasks = res.data;
          }
        });
        this.errMsg = '没有未完成的任务';
      }
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
            _this.selected = [];
          }
        }
      });
    },
    finish () {
      wx.cloud.callFunction({
        name: 'multi',
        data: {
          ids: this.selected,
          operation: 'finish'
        }
      }).then(res => {
          this.getData(0, 'refresh');
        }).catch(err => {
          console.error('err' + err);
        });
      this.multi = false;
      this.selected = [];
    },
    toFinished () {
      wx.navigateTo({url: '/pages/finished/main'})
    },
    getData (skip = 0, type = 'refresh') {
      const db = wx.cloud.database();
      db.collection('tasks').where({
        _openid: this.openid,
        finished: false
      }).orderBy('long_term', 'asc').orderBy('end_time', 'asc').orderBy('task_name', 'asc')
      .field({
        task_name: true,
        _id: true,
        start_time: true,
        end_time: true,
        long_term: true
      })
      .skip(skip).get()
      .then(res => {
        if (type === 'load') {
          this.tasks = this.tasks.concat(res.data);
        } else {
          this.tasks = res.data;
        }
        wx.setStorage({
          key: 'hometasks',
          data: this.tasks
        });
      }).catch(res => {
        console.log(res.errMsg);
      });
    },
    // 首次使用,添加一个默认task
    createDefaultTask () {
      wx.getStorage({
        key: 'hasUsed',
        fail (res) {
          wx.setStorage({
            key: 'hasUsed',
            data: 'hasUsed'
          });
          wx.cloud.database().collection('tasks').add({
            data: {
              task_name: '小程序使用说明',
              detail: `1.新建任务：点击主页右下角"+"键可创建新任务。
2.多选操作：在主页屏幕长按进入多选，可批量标记完成或删除任务。
3.日程页面可选择日期查看当日任务。
4.任务已过结束时间，其时间显示颜色会改变。
5.更多设置中可进行样式设置。
6.已完成长按可恢复。`,
              long_term: false,
              start_time: getTime(),
              end_time: getTime(Date.now() + 3600000),
              finished: false,
              create_time: getTime()
            }
          }).then(res => {})
          .catch(res => console.log(res.errMsg));
        }
      });
    },
    touchStart (e) {
      // console.log(e)
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
    },
    touchEnd (e) {
      // console.log(e)
      if (Math.abs(e.mp.changedTouches[0].clientY - this.touchStartY) < 50 && e.mp.changedTouches[0].clientX - this.touchStartX < -200) {
        // 向左划
        wx.reLaunch({
          url: '/pages/agenda/main'
        })
        // wx.switchTab({
        //   url: '/pages/agenda/main'
        // })
      }
    }
  },
  computed: {
  },
  onLoad () {
    wx.cloud.init();
    // 获取屏幕高度宽度，存入store
    wx.getSystemInfo({
      success (res) {
        store.commit('setHeight', res.windowHeight);
        store.commit('setWidth', res.windowWidth);
      }
    });
    this.createDefaultTask();
    this.minHeight = store.state.deviceHeight;
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getData(0, 'refresh');
    wx.stopPullDownRefresh();
    this.time = getTime();
  },
  // 触底加载更多
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
        _openid: this.openid,
        finished: false
      }).count().then(res => {
        this.total = res.total;
      });
      this.getData();
    }).catch(err => {
      console.error('err' + err);
    });
    let _this = this;
    wx.getStorage({
      key: 'localSetting',
      success (res) {
        _this.localSetting = res.data;
      }
    });
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(230,230,230);
}
.searchbox{
  position: relative;
  height:35px;
  border-radius:20px;
  background-color: #fff;
  margin: 10px;
  padding-left: 10px;
}
.searchbox input{
  position: absolute;
  width: 85%;
  height: 100%;
  line-height: 100%;
}
.searchbox img{
  margin: 3px 0;
  height: 85%;
  width: 10%;
  right: 8px;
  position: absolute;
}
.space{
  height:1px;
}
.space2{
  height:50px;
}
.task{
  margin: 10px;
  padding: 10px 10px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}
.ltt{
  background: linear-gradient(rgb(170, 218, 255), rgb(231, 245, 255));
}
.task_name{
  font-size: 18px;
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task_time{
  border-top:1px solid #999;
  font-size:14px;
  padding: 5px 0 0 5px;
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
.multi_btn{
  position:fixed;
  width:100%;
  top: 0px;
  height:50px;
  font-size: 18px;
  font-family: 'Microsoft-Yahei';
  align-items: center;
  display:flex;
  flex-direction: row;
  border-top: 1px solid #999;
  justify-content: space-around;
  background-color: #eee;
  box-shadow:0px 1px 10px #666;
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
