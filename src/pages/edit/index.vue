<template>
	<div id="edit">
		<form action="" class="data">
			<input type="text" class="task_name" name="task_name" v-model.lazy="task_name" maxlength="50" placeholder="任务名称">
      <div class='switch'>不限时间范围<switch @change="AllTime" /></div>
			<div :class="{pick:true,dispick:all_time}">
				<picker class="picker" mode="date" :value="start_date" @change="change_sd" :disabled="all_time">
				    开始时间：{{start_date}}
				</picker>&nbsp;&nbsp;
				<picker class="picker" mode="time" :value="start_time" @change="change_st" :disabled="all_time">
				    {{start_time}}
				</picker>
			</div>
			<div :class="{pick:true,dispick:all_time}">				
				<picker class="picker" mode="date" :value="end_date" @change="change_ed" :disabled="all_time">
				    结束时间：{{end_date}}
				</picker>&nbsp;&nbsp;
				<picker class="picker" mode="time" :value="end_time" @change="change_et" :disabled="all_time">
				    {{end_time}}
				</picker>
			</div>
      <textarea name="detail" id="detail" cols="30" rows="10"></textarea>
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
      all_time: false,
      task_name: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      create_time: '',
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
    AllTime (e) {
      console.log(e.mp.detail.value);
      this.all_time = !this.all_time;
    },
    // 保存
    save () {
      if (this.task_name !== '') {
        let createTime = getTime();
        const tasks = wx.cloud.database().collection('tasks');
        let data = {
          task_name: this.task_name,
          all_time: this.all_time,
          // status: true,
          start_time: this.start_date + ' ' + this.start_time,
          end_time: this.end_date + ' ' + this.end_time,
          create_time: createTime
        };

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
      if (options.all_time) {
        this.all_time = options.alltime;
      } else {
        this.start_date = options.start_time.split(' ')[0];
        this.start_time = options.start_time.split(' ')[1];
        this.end_date = options.end_time.split(' ')[0];
        this.end_time = options.end_time.split(' ')[1];
      }
    } else {
      // 初始化时间
      this.start_date = this.end_date = getTime().split(' ')[0];
      this.start_time = this.end_time = getTime().split(' ')[1];
    }
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
/*#edit>*{
  background-color: rgb(255,255,255);
}*/
.task_name{
  border-top:1px solid rgb(240,240,240);
  border-bottom: 1px solid rgb(240,240,240);
  margin:5px 0;
  padding:5px;
}
.switch{
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(240,240,240);
  padding:5px;
}
.pick{
  padding:0 5px 5px;
  border-bottom: 1px solid rgb(240,240,240);
}
.dispick{
  color:rgb(90,90,90);
}
.pick>picker{
  display: inline-block;
}
#detail{

}
.save{
  position:absolute;
  bottom: 0px;
  width:100%;
}
</style>