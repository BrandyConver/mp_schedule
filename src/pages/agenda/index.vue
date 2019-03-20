<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false" >
    <Calendar @select="select" ref="calendar" :events="events" @next="next" 
    @prev="prev" @selectYear="selectYear" @selectMonth="selectMonth" @touchstart="touchStart" @touchend="touchEnd"  />
    <div  class="task_list" >
      <div class="task" v-for="task of todayTasks" :key="task._id" >
        <navigator :url="'/pages/detail/main?id='+task._id" >
          <div class="task_name" >{{task.task_name}}</div>
          <div class="task_time">
            <span  :style="{ color: task.end_time>time?'rgb(40, 90, 20)':'rgb(120,20,20)'}" >{{task.start_time}}~{{task.end_time}}</span>
          </div>
        </navigator>
      </div>
    </div> 
  </div>
</template>

<script>
import getTime from '../../components/getTime.js';
import store from '../../components/store.js';
import Calendar from '../../components/mpvue-calendar/src/mpvue-calendar.vue';
import '../../components/mpvue-calendar/src/style.css';

export default {
  store,
  data () {
    return {
      windowHeight: '',
      events: {},
      todayTasks: [],
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      time: getTime()
    }
  },
  components: {
    'Calendar': Calendar
  },
  methods: {
    select (val1, val2) {
      this.todayTasks = [];
      if (val2.event) {
        for (let task of this.allTasks) {
          if (val2.event.indexOf(task._id) >= 0) {
            this.todayTasks.push(task);
          }
        }
      }
    },
    next (year, month) {
      this.getTaskEvent(year, month);
    },
    prev (year, month) {
      this.getTaskEvent(year, month);
    },
    selectYear (year, month) {
      this.getTaskEvent(year, month);
    },
    selectMonth (month, year) {
      this.getTaskEvent(year, month);
    },
    touchStart (e) {
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
    },
    touchEnd (e) {
      if (Math.abs(e.mp.changedTouches[0].clientY - this.touchStartY) < 50) {
        if (e.mp.changedTouches[0].clientX - this.touchStartX > 200) {
          // 向右划
          wx.switchTab({
            url: '/pages/index/main'
          })
        } else if (e.mp.changedTouches[0].clientX - this.touchStartX < -200) {
          // 向左划
          wx.switchTab({
            url: '/pages/self/main'
          })
        }
      }
    },
    toDetail (id) {
      const url = '/pages/detail/main?id=' + id;
      wx.navigateTo({url});
    },
    // 获取选中月份的未完成任务 
    getTaskEvent (year = this.curYear, month = this.curMonth) {
      wx.cloud.callFunction({
        name: 'getTasksByMonth',
        data: {
          curYear: year,
          curMonth: month
        }
      }).then(res => {
        this.allTasks = res.result;
        for (let i = 0; i <= this.allTasks.length; i++) {
          let startMonth = parseInt(res.result[i].start_time.substr(5, 2))
          let endMonth = parseInt(res.result[i].end_time.substr(5, 2))
          let startDate = parseInt(res.result[i].start_time.substr(8, 2))
          let endDate = parseInt(res.result[i].end_time.substr(8, 2))
          let eventStart = startDate
          let eventEnd = endDate
          if (startMonth < month) {
            eventStart = 1 // 始于上月，从一号开始
          }
          // end next month
          if (endMonth > month) {
            eventEnd = 31 // 止于次月，最多到31号，传入不存在的日期不会报错
          }
          for (let eventNow = eventStart; eventNow <= eventEnd; eventNow++) {
            if (this.events[`${year}-${month}-${eventNow}`] === undefined) {
              // 使用Vue.set添加属性，触发视图更新，直接添加属性不行
              this.$set(this.events, `${year}-${month}-${eventNow}`, res.result[i]._id)
            } else {
              this.events[`${year}-${month}-${eventNow}`].push(res.result[i]._id)
            }
          }
        }
      }).catch(res => {
        // console.log(res.errMsg)
      })
    }
  },
  computed: {
  },
  watch: {
  },
  onLoad () {
    this.windowHeight = store.state.deviceHeight;
    this.getTaskEvent(new Date().getFullYear(), new Date().getMonth() + 1); // now year now month
  },
  onShow () {
  },
  onHide () {
  }
}
</script>

<style scoped>
#index{
  background-color:rgb(230,230,230);
}
.control{
  background-color: rgb(255,255,255);
  padding: 5px 10px;
  margin-top:10px;
  height:35px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.space{
  height:1px;
}
.calendar{
  height: 200px;
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


</style>
