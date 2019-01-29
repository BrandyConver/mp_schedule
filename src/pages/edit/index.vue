<template>
	<div id="edit" :style="{minHeight:windowHeight -10 + 'px'}">
		<form action="" class="data">
      <div class="space"></div>
			<input type="text" class="task_name control" name="task_name" v-model.lazy="task_name" maxlength="50" placeholder="任务名称">
      <textarea name="detail" class='control' id="detail"  v-model="detail" placeholder="任务详情"></textarea>
      <div class='switch control'>不限时间范围<switch @change="allTime" :checked="long_term"/></div>
			<div :class="{pick:true, control:true, dispick:long_term}">
				<picker class="picker" mode="date" :value="start_date" @change="change_sd" :disabled="long_term">
				    开始时间：{{start_date}}
				</picker>&nbsp;&nbsp;
				<picker class="picker" mode="time" :value="start_time" @change="change_st" :disabled="long_term">
				    {{start_time}}
				</picker>
			</div>
			<div :class="{pick:true, control:true, dispick:long_term}">				
				<picker class="picker" mode="date" :value="end_date" @change="change_ed" :disabled="long_term">
				    结束时间：{{end_date}}
				</picker>&nbsp;&nbsp;
				<picker class="picker" mode="time" :value="end_time" @change="change_et" :disabled="long_term">
				    {{end_time}}
				</picker>
			</div>

		</form>
		<div class="save"><button @click="save">保存</button></div>
	</div>
</template>
<script>
import getTime from '../../components/getTime.js';
export default{
  data () {
    return {
      // task_data: { },
      long_term: false,
      task_name: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      create_time: '',
      detail: '',
      windowHeight: '600px',
      isSave: false
    }
  },
  methods: {
    // 从picker组件读取时间日期
  	change_sd (e) {
  	  this.start_date = e.mp.detail.value;
  	},
  	change_st (e) {
      this.start_time = e.mp.detail.value;
  	},
  	change_ed (e) {
  	  this.end_date = e.mp.detail.value;
  	},
  	change_et (e) {
  	  this.end_time = e.mp.detail.value;
  	},
    allTime (e) {
      console.log(e.mp.detail.value);
      this.long_term = !this.long_term;
      if (!this.long_term) {
        this.initTime();
      }
    },
    initTime () {
      this.start_date = this.end_date = getTime().split(' ')[0];
      this.start_time = this.end_time = getTime().split(' ')[1];      
    },
    // 保存
    save () {
      if (this.task_name !== '') {
        let createTime = getTime();
        const tasks = wx.cloud.database().collection('tasks');
        let data = {
          task_name: this.task_name,
          long_term: this.long_term,
          // finished: false,
          start_time: this.start_date + ' ' + this.start_time,
          end_time: this.end_date + ' ' + this.end_time,
          create_time: createTime,
          detail: this.detail
        };
        console.log(this.detail);
        if (this.id) { // 更新
          tasks.doc(this.id).update({
            data   
          }).then(function (res) {
            console.log(res);
          });
        } else { // 添加
          tasks.add({
            data
          }).then(function (res) {
              wx.showToast({
                title: '保存成功',
                mask: true
              })
            },
            function (res) {
              console.log(res);
            })
            //
        }
        // 返回主页
        wx.navigateBack({
          delta: 9
        })
        this.task_name = '';
      } else {
        wx.showToast({
          icon: 'none',
          title: '内容不能为空',
          mask: true
        })
      }
    }
  },
  onLoad (options) {
    if (options.id) {
      // 导入任务内容
      this.id = options.id;
      this.task_name = options.task_name;
      this.detail = options.detail;
      this.long_term = options.long_term;
      if (options.long_term) {
        this.long_term = options.long_term;
      } else {
        this.start_date = options.start_time.split(' ')[0];
        this.start_time = options.start_time.split(' ')[1];
        this.end_date = options.end_time.split(' ')[0];
        this.end_time = options.end_time.split(' ')[1];
      }
    } else {
      // 初始化时间
      this.initTime();
    }
    this.windowHeight = wx.getSystemInfoSync().windowHeight;
  },
  onUnload () {
    // if (this.task_name.value !== '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '内容未保存，确认离开？',
    //     success (res) {
    //       if (!res.confirm) {
    //         // 阻止退出
    //       }
    //     }
    //   }) 
    // }   
  }
}
</script>
<style scoped>
#edit{
  background-color: rgb(240,240,240);
}
.control{
  background-color: rgb(255,255,255);
  margin-top:10px;
  height:35px;
  padding:5px;
  line-height: 35px;
}
.task_name{
  border-top:1px solid rgb(240,240,240);
  border-bottom: 1px solid rgb(240,240,240);
  /* margin-top:5px 0; */
  /* padding:5px; */
  background-color: rgb(255,255,255)
}
.switch{
  align-items: center;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(240,240,240);
}
switch{
  margin-bottom:4px;
  /* border:1px solid #000; */
}
.pick{
  /* padding:0 5px 5px; */
  border-bottom: 1px solid rgb(240,240,240);
}
.dispick{
  color:rgb(90,90,90);
}
.pick>picker{
  display: inline-block;
}
#detail{
  background-color: #FFF;
  width:100%;
  height:100px;
}
.save{
  position:absolute;
  bottom: 0px;
  width:100%;
}
.space{
  height:1px;
}
</style>