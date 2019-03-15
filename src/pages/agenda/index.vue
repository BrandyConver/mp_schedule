<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" @tap="isPick=false">
    <Calendar @select="select" ref="calendar" :events="events" />
  </div>
</template>

<script>
import store from '../../components/store.js';
// import Calendar from 'mpvue-calendar';
import Calendar from '../../components/mpvue-calendar/src/mpvue-calendar.vue'; // 修改 calendar
import '../../components/mpvue-calendar/src/style.css';

export default {
  store,
  data () {
    return {
      windowHeight: '',
      events: {}
    }
  },
  components: {
    'Calendar': Calendar
  },
  methods: {
    select (val1, val2) {
      // console.log(val1);
      console.log(val2.event);
    },
    getTaskEvent () {
      this.events = {
        '2019-3-11': 'id3.11, id3.12',
        '2019-3-13': 'id3.13',
        '2019-3-15': 'id3.15',
        '2019-3-18': 'id3.18'
      }
    }
  },
  computed: {
  },
  onLoad () {
    this.windowHeight = store.state.deviceHeight;
    this.getTaskEvent();
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
</style>
