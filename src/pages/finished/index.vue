<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @click.stop="hideTip">
    <div v-if="tasks.length>0" class="task_list" >
      <div class="task" :class="{ltt:task.long_term}" v-for="task of tasks" :key="task._id" @click="toDetail(task._id)" @longpress="tip($event, task._id)">
        <div class="task_name">{{task.task_name}}</div>
        <div class="task_time">
          <span v-if="task.long_term" class="long_term">长期任务</span>
          <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
        </div>
      </div>
      <div class="total">共{{total}}条数据</div>
    </div>        
    <div v-else class='no_task' :style="{minHeight:windowHeight + 'px'}">当前列表为空</div>
    <div class="float_tip"  :style="{visibility: floatTip.isShow?'visible':'hidden',left:position.x, top:position.y }" >
      <span @tap="restore">还原</span><span @tap="del">删除</span>
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
      openid: '',
      timecolor: ['blue', 'rgb(120,20,20)'],
      time: getTime(),
      windowHeight: '',
      windowWidth: '',
      total: '0',
      floatTip: {
        x: 0,
        y: 0,
        selected: '',
        isShow: false
      }
    }
  },
  methods: {
    // 跳转至详情页
    toDetail (id) {
      const url = '/pages/detail/main?id=' + id;
      wx.navigateTo({url});
    },
    getData (skip = 0, type = 'refresh') {
      const db = wx.cloud.database();
      db.collection('tasks').where({
        _openid: this.openid,
        finished: true
      }).orderBy('long_term', 'asc').orderBy('end_time', 'desc').orderBy('task_name', 'asc').skip(skip).get()
      .then(res => {
        if (type === 'load') {
          this.tasks = this.tasks.concat(res.data);
        } else {
          this.tasks = res.data;
        }
        wx.setStorage({
          key: 'fintasks',
          data: this.tasks
        });
      }).catch(res => {
        console.log(res.errMsg);
      });
    },
    tip (e, id) {
      this.floatTip = {
        selected: id,
        x: e.mp.detail.x,
        y: e.mp.detail.y,
        isShow: true 
      };
    },
    restore () {
      // 还原task 初始化floatTip
      wx.cloud.database().collection('tasks').doc(this.floatTip.selected).update({
        data: {
          finished: false
        }
      }).then(res => {       
      this.getData();
      this.hideTip();
      }).catch(res => {
        console.log(res.errMsg)
      });
    },
    del () {
      wx.cloud.database().collection('tasks').doc(this.floatTip.selected).remove()
      .then(res => {       
      this.getData();
      this.hideTip();
      }).catch(res => {
        console.log(res.errMsg)
      });
    },
    hideTip () {
      this.floatTip = {
        selected: '',
        isShow: false
      };
    }
  },
  computed: {
    // 计算提示框位置
    position () {
      let x = this.floatTip.x - 60;
      if (x < 0) {
        x = 0;
      } else if (x + 120 > this.windowWidth) {
        x = this.windowWidth - 120;
      }
      let y = this.floatTip.y - 40;
      return {
        y: y + 'px',
        x: x + 'px'
      }
    }
  },
  onLoad () {
    // 从store读取相关信息
    this.openid = store.state.openid;
    this.windowHeight = store.state.deviceHeight + 50;
    this.windowWidth = store.state.deviceWidth;
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getData(0, 'refresh');
    wx.stopPullDownRefresh();
    this.time = getTime();
  },
  // 上拉加载
  onReachBottom () {
    if (this.tasks.length < this.total) {
      this.getData(this.tasks.length, 'load');
    }
  },
  onShow () {
    const db = wx.cloud.database();
    // 查询数据库
    db.collection('tasks').where({
      _openid: this.openid,
      finished: true
    }).count().then(res => {
      this.total = res.total;
    });
    this.getData();
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(230,230,230);
  border: 1px solid rgb(230,230,230);
}
.searchbox{
  height:35px;
  border-radius:20px;
  background-color: #fff;
  margin: 10px;
  padding-left: 10px;
}
.searchbox input{
  height: 100%;
  line-height: 100%;
}
.task{
  margin: 10px;
  padding: 10px 10px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}
.ltt{
  background-color: rgb(177, 220, 255);
}
.task_name{
  font-size: 18px;
  padding: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task_time{
  font-size:14px;
  padding: 5px 0 0 5px;
  border-top:1px solid #999;
}
.total{
  text-align: center;
  color: #555;
}
.no_task{
  text-align: center;
  padding-top: 10px;
  font-size:18px;
}
.long_term{
  color:blue;
}
.float_tip{
  position:absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 20px;
  font-weight: 100;
  left: 20px;
  top: 20px;
  width: 120px;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: #666 0 0 8px 2px;
}
</style>
