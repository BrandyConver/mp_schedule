<template>
	<div id="edit" :style="{minHeight:windowHeight + 10 + 'px'}">
		<form action="" class="data">
      <div class="space"></div>
			<input type="text" class="task_name control" name="task_name" v-model.lazy="task_name" maxlength="50" placeholder="任务名称">
      <textarea name="detail" class='control' id="detail"  v-model="detail" placeholder="任务详情" maxlength=500 ></textarea>
      <div class='switch control'>不限时间范围<switch @change="allTime" :value="long_trem" :checked="long_term"/></div>
			<div :class="{pick:true, control:true, dispick:long_term}">
				<picker class="picker" mode="date" @change="change_sd" :disabled="long_term">
				    开始时间：{{start_date}}
				</picker>&nbsp;&nbsp;
				<picker class="picker" mode="time" :value="start_time" @change="change_st" :disabled="long_term">
				    {{start_time}}
				</picker>
			</div>
			<div :class="{pick:true, control:true, dispick:long_term}">				
				<picker class="picker" mode="date" :value="end_date" @change="change_ed" :disabled="long_term" :start="start_date">
				    结束时间：{{end_date}}
				</picker>&nbsp;&nbsp;
				<picker class="picker" mode="time" :value="end_time" @change="change_et" :disabled="long_term" >
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
      task_data: {},
      long_term: false,
      task_name: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      create_time: '',
      detail: '',
      windowHeight: wx.getSystemInfoSync().windowHeight,
      isSave: false
    }
  },
  methods: {
    // 从picker组件读取时间日期
  	change_sd (e) {
      this.start_date = e.mp.detail.value;
      this.end_date = this.end_date < this.start_date ? this.start_date : this.end_date;
  	},
  	change_st (e) {
      this.start_time = e.mp.detail.value;
      if (this.end_date === this.start_date && this.end_time < this.start_time) {
        this.end_time = this.start_time;
        console.log(this.end_time);
      }
  	},
  	change_ed (e) {
  	  this.end_date = e.mp.detail.value;
  	},
  	change_et (e) {
      if (this.start_date === this.end_date && e.mp.detail.value < this.start_time) {
        this.end_time = this.start_time;
      } else {
        this.end_time = e.mp.detail.value;
        }
  	},
    allTime (e) {
      this.long_term = e.mp.detail.value;
      if (!this.long_term) {
        this.initTime();
      }
    },
    initTime () {
      let time = new Date();
      time.setHours(time.getHours() + 1);
      this.start_date = getTime().split(' ')[0];
      this.start_time = getTime().split(' ')[1];
      this.end_date = getTime(time).split(' ')[0];
      this.end_time = getTime(time).split(' ')[1];
    },
    init () {
      [this.task_name, this.long_term, this.detail] = ['', false, ''];
      delete this.id;
      this.initTime();
    },
    // 保存
    save () {
      if (this.task_name !== '') {
        const tasks = wx.cloud.database().collection('tasks');
        let data = {
          task_name: this.task_name,
          long_term: this.long_term,
          finished: false,
          start_time: this.start_date + ' ' + this.start_time,
          end_time: this.end_date + ' ' + this.end_time,
          create_time: getTime(),
          detail: this.detail
        };
        if (data.long_term === true) {
          data.start_time = '';
          data.end_time = '';
        }
        if (this.id) { // 更新
          tasks.doc(this.id).update({
            data   
          }).then(function (res) {
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
        }
        // 返回主页
        wx.navigateBack({
          delta: 1
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
    // 导入任务内容
    if (options.id) {
      this.id = options.id;
      this.task_name = options.task_name;
      if (options.long_term === 'false' || options.long_term === undefined) {
        this.long_term = false;
        this.start_date = options.start_time.split(' ')[0];
        this.start_time = options.start_time.split(' ')[1];
        this.end_date = options.end_time.split(' ')[0];
        this.end_time = options.end_time.split(' ')[1];
      } else {
        this.long_term = true;
      }
      // 用localStorage存储detail,过长的detail会在url中丢失
      wx.getStorage({
        key: 'detail',
        success: res => { this.detail = res.data }
      });
    } else {
      this.init();
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
  background-color: rgb(230,230,230);
}
.control{
  background-color: rgb(255,255,255);
  margin-top:10px;
  height:35px;
  padding:5px 10px;
  line-height: 35px;
}
.task_name{
  border-top:1px solid rgb(230,230,230);
  border-bottom: 1px solid rgb(230,230,230);
  background-color: rgb(255,255,255)
}
.switch{
  align-items: center;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(230,230,230);
}
switch{
  margin-bottom:4px;
}
.pick{
  border-bottom: 1px solid rgb(230,230,230);
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
  min-height:140px;
  /* max-height:140px; */
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