<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @click="hideTip">
    <div class='searchbox'>
      <input type="text" comfirm-type='search' placeholder="搜索" @confirm='search' class='search' @input="clear">
    </div>
    <div v-if="tasks.length>0" class="task_list" >
      <div class="task" :class="{ltt:task.long_term}" v-for="task of fintasks" :key="task._id" @click="toDetail(task._id)" @longpress="tip($event, task._id)">
        <div class="task_name">{{task.task_name}}</div>
        <div class="task_time">
          <span v-if="task.long_term" class="long_term">长期任务</span>
          <span v-else :style="{ color: task.end_time>time?timecolor[0]:timecolor[1]}" >{{task.start_time}}~{{task.end_time}}</span>
        </div>
      </div>
    </div>        
    <div v-else class='no_task' :style="{minHeight:windowHeight + 'px'}">当前列表为空</div>
    <!-- 悬浮按钮 -->
    <div class="float_tip"  :style="{'display': floatTip.isShow?'block':'none','left':floatTip.x + 'px', 'top':floatTip.y + 'px' }" @tap="restore">
      还原
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
        _openid: this.openid
      }).orderBy('long_term', 'asc').orderBy('end_time', 'asc').orderBy('task_name', 'asc').skip(skip).get()
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
    search (e) {
      let word = new RegExp(e.mp.detail.value.trim(), 'ig');
      console.log(word)
      let result = this.tasks.filter(task => task.task_name.search(word) >= 0);
      this.tasks = result;
    },
    clear (e) {
      let _this = this;
      if (e.mp.detail.value === '') {
        wx.getStorage({
          key: 'fintasks',
          success (res) {
            _this.tasks = res.data;
          }
        })
      }
    },
    tip (e, id) {
      console.log(e.mp.detail);
      this.restore(id);
      this.floatTip = {
        selected: id,
        x: e.mp.detail.x,
        y: e.mp.detail.y,
        isShow: true 
      };
      console.log(this.floatTip.x);
    },
    restore (id) {
      console.log(id);
      // 还原task 初始化floatTip
      this.hideTip();
    },
    hideTip () {
      this.floatTip = {
        selected: '',
        isShow: false
      };
      // console.log(this.floatTip);
    }
  },
  computed: {
    fintasks () {
      // use unfin task instead of v-if with v-for
      return this.tasks.filter(task => task.finished === true);
    }
  },
  onLoad () {
    // 从store获取窗口高度
    this.openid = store.state.openid;
    this.windowHeight = store.state.minHeight;
  },
  onPullDownRefresh () {
    this.getData(0, 'refresh');
    wx.stopPullDownRefresh();
    this.time = getTime();
  },
  onReachBottom () {
    if (this.tasks.length < this.total) {
      this.getData(this.tasks.length, 'load');
    }
  },
  onShow () {
    const db = wx.cloud.database();
    // 查询数据库
    db.collection('tasks').where({
      _openid: this.openid 
    }).count().then(res => {
      this.total = res.total;
    });
    this.getData();
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(240,240,240);
  border: 1px solid rgb(240,240,240);
}
.searchbox{
  height:30px;
  line-height:30px;
  border-radius:20px;
  background-color: #fff;
  margin: 10px;
  padding-left: 10px;
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
.float_tip{
  visibility:hidden;
  position:absolute;
  left:0;
  top:0;
}
</style>
