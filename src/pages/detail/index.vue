<template>
  <div id="detail">
    <div>
      <view>{{task.task_name}}</view>
      <view class="time">{{task.start_time}}~{{task.end_time}}</view>
      <view>创建时间:{{task.create_time}}</view>
    </div>

    <div class="button">
      <button @click="toEdit">编辑</button>
      <button @click="delet">删除</button> 
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      task: {
      }
    }
  },
  methods: {
    // 删除任务
    delet () {
      let _this = this
      wx.showModal({
        title: '提示',
        content: '确认删除这项任务',
        success (res) {
          if (res.confirm) {
            _this.tasks
            .doc(_this.id) // _id查询        
            .remove({
              success (res) {
                wx.showToast({
                  title: '删除成功',
                  mask: true
                })
              }
            })
            wx.navigateBack({
              delta: 9
            })
          }
        }
      })
    },
    // 跳转到编辑页 并传递任务详细内容
    toEdit () { // 存入缓存 pending
      let url = `../edit/main?id=${this.id}&task_name=${this.task.task_name}&start_time=${this.task.start_time}&end_time=${this.task.end_time}`
      wx.redirectTo({url})
    }
  },
  onLoad (options) {
    // 查询数据库
    const tasks = wx.cloud.database().collection('tasks')
    this.tasks = tasks
    this.id = options.id
    let _this = this
    tasks.doc(_this.id)
    .get({  
      success: function (res) {
        _this.task = res.data
      }
    })
  }
}
</script>

<style>
.time{
  color: rgb(90,90,90)
}
.button{
  position: absolute;
  bottom:0;
  width:100%;
  display: flex;
}
.button>button{
  flex:1;
}
button:nth-child(2){
  width:50%;
  color:#ee2233;
}
</style>
