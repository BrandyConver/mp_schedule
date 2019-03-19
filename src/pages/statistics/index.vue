<template>
  <div id="index" :style="{minHeight:windowHeight + 'px'}" >
    <div class="space"></div>
    <div class="content">
      <div class="list-item">
        <span>未完成任务数</span>
        <span>{{unfinCount}}</span>
      </div>      
      <div class="list-item">
        <span>本月完成任务</span>
        <span>{{mthCount}}</span>
      </div>
      <div class="list-item">
        <span>本年完成任务</span>
        <span>{{yearCount}}</span>
      </div>
      <div class="list-item">
        <span>累计完成任务</span>
        <span>{{totalCount}}</span>
      </div>      
    </div>
  </div>
</template>

<script>
import store from '../../components/store.js';
export default {
  store,
  data () {
    return {
      windowHeight: '',
      unfinCount: 0,
      mthCount: 0,
      yearCount: 0,
      totalCount: undefined,
      openid: store.state.openid
    }
  },
  methods: {
    // 封装查询函数 conditions-查询条件 'val'-赋值变量
    getCount (conditions, val) {
      wx.cloud.database().collection('tasks').where(Object.assign({ _openid: this.openid }, conditions)).count().then(res => {
        this[val] = res.total;
      });
    }
  },
  onLoad () {
    this.windowHeight = store.state.deviceHeight + 50;
    this.openid = store.state.openid
    this.getCount({ finished: false }, 'unfinCount');
    let month = new Date().getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    this.getCount({ finished: true, end_time: new RegExp('-' + month + '-') }, 'mthCount');
    this.getCount({ finished: true, end_time: new RegExp(new Date().getFullYear()) }, 'yearCount');
    this.getCount({ finished: true }, 'totalCount');
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
.list-item{
  margin: 0 10px;
  padding: 10px 30px 10px 10px;
  height: 35px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #999;
}
.list-item:last-child{
  border-bottom: none;
}
.space{
  height:1px;
}
.content{
  background: rgb(255,255,255);
}
</style>
