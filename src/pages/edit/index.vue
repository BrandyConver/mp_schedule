<template>
	<div id="edit" :style="{minHeight:windowHeight + 10 + 'px'}">
		<form action="" class="data">
      <div class="space"></div>
			<input type="text" class="task_name baseline" name="task_name" v-model.lazy="task_name" maxlength="50" placeholder="任务名称">
      <textarea name="detail" id="detail"  v-model="detail" placeholder="任务详情" maxlength=500 ></textarea>
      <div class='switch baseline'>不限时间范围<switch @change="allTime" :value="long_trem" :checked="long_term"/></div>
      <div class='switch baseline'>置顶<switch @change="keepTop" :value="isTop" :checked="isTop"/></div>
			<div :class="{pick:true, baseline:true, dispick:long_term}">
        <span>开始时间： </span>
				<picker class="picker" mode="date" :value="start_date" @change="change_sd" :disabled="long_term">
				  {{start_date}}
				</picker>
				<picker class="picker" mode="time" :value="start_time" @change="change_st" :disabled="long_term">
				  {{start_time}}
				</picker>
			</div>
			<div :class="{pick:true, baseline:true, dispick:long_term}">	
        <span>结束时间： </span>			
				<picker class="picker" mode="date" :value="end_date" @change="change_ed" :disabled="long_term" :start="start_date">
				  {{end_date}}
				</picker>
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
      isTop: false,
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
    keepTop (e) {
      this.isTop = e.mp.detail.value;
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
          isTop: this.isTop,
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
      // attention!!! options.isTop 和 long_term 是 字符串
      if (options.isTop === 'undefined' || options.isTop === 'false') {
        this.isTop = false
      } else {
        this.isTop = true;
      }
      console.log('istop:', this.isTop)
      if (options.long_term === 'false' || options.long_term === 'undefined') {
        this.long_term = false;
        this.start_date = options.start_time.split(' ')[0];
        this.start_time = options.start_time.split(' ')[1];
        this.end_date = options.end_time.split(' ')[0];
        this.end_time = options.end_time.split(' ')[1];
      } else {
        this.long_term = true;
      }
      // 用localStorage存储detail,url长度有限
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
.baseline{
  box-sizing: border-box;
  background-color: rgb(255,255,255);
  margin-top:10px;
  margin-bottom:10px;
  padding:0px 15px;
  line-height: 40px;
  height: 40px;
  position: relative;
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
  margin-left: 30px;
}
#detail{
  font-size: 18px;
  padding: 10px;
  background-color: #FFF;
  width:100%;
  min-height:200px;
  box-sizing: border-box;
  background-color: rgb(255,255,255);
  margin-top:10px;
  line-height: 30px
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