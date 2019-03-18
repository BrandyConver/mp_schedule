<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <Calendar @select="select" ref="calendar" :events="events" @next="next" @prev="prev" @selectYear="selectYear" @selectMonth="selectMonth"  />
    <div  class="task_list" >
      <div class="task" v-for="task of todayTasks" :key="task._id" @click="toDetail(task._id)">
        <div class="task_name" >{{task.task_name}}</div>
        <div class="task_time">
          <span  :style="{ color: task.end_time>time?'rgb(10, 60, 40)':'rgb(120,20,20)'}" >{{task.start_time}}~{{task.end_time}}</span>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import store from '../../components/store.js';
// import Calendar from 'mpvue-calendar'; 
// import 'mpvue-calendar/src/style.css';
// import myCalendar from '../../components/myCalendar/src/my-calendar.vue';
// import '../../components/myCalendar/src/style.css';
import Calendar from '../../components/mpvue-calendar/src/mpvue-calendar.vue';
import '../../components/mpvue-calendar/src/style.css';

export default {
  store,
  data () {
    return {
      windowHeight: '',
      events: {},
      todayTasks: [],
      dftYear: new Date().getFullYear,
      dftMonth: new Date().getMonth + 1
    }
  },
  components: {
    'Calendar': Calendar
  },
  methods: {
    select (val1, val2) {
      if (val2.event) {
        this.todayTasks = [];
        for (let task of this.allTasks) {
          if (val2.event.indexOf(task._id) >= 0) {
            this.todayTasks.push(task);
          }
        }
      }
    },
    next (val) {
      console.log('next', val);
    },
    prev (val) {
      console.log('pre', val);
    },
    selectYear (val) {
      console.log('selectyear', val)
    },
    selectMonth (val) {
      console.log('selectmonth', val)
    },
    toDetail (id) {
      const url = '/pages/detail/main?id=' + id;
      wx.navigateTo({url});
    },
    getTaskEvent (year, month) {
      wx.cloud.callFunction({
        name: 'getTasksByMonth',
        data: {
          curYear: year,
          curMonth: month
        }
      }).then(res => {
        // console.log(res.result)
        this.allTasks = res.result;
        for (let i = 0; i <= this.allTasks.length; i++) {
          let startMonth = parseInt(res.result[i].start_time.substr(5, 2))
          let endMonth = parseInt(res.result[i].end_time.substr(5, 2))
          let startDate = parseInt(res.result[i].start_time.substr(8, 2))
          let endDate = parseInt(res.result[i].end_time.substr(8, 2))
          // start&end this month
          let eventStart = startDate
          let eventEnd = endDate
          // start last month
          if (startMonth < month) {
            eventStart = 1
          }
          // end next month
          if (endMonth > month) {
            eventEnd = 31 // 传入不存在的日期不会报错
          }
          for (let eventNow = eventStart; eventNow <= eventEnd; eventNow++) {
            if (this.events[`${year}-${month}-${eventNow}`] === undefined) {
              this.events[`${year}-${month}-${eventNow}`] = [ res.result[i]._id ]
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
  onLoad () {
    this.windowHeight = store.state.deviceHeight;
    this.getTaskEvent(new Date().getFullYear, new Date().getMonth + 1); // now year now month
  },
  onShow () {
  },
  onHide () {
    // this.save();
    this.isPick = false;
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
