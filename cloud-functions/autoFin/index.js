// 自动标记完成
const getTime = function () {
  let now = new Date();
  let nowMonth = now.getMonth() + 1;
  let nowDate = now.getDate();
  let nowHours = now.getHours();
  let nowMinutes = now.getMinutes();
  if (nowMonth < 10) {
    nowMonth = '0' + nowMonth;
  }
  return now.getFullYear() + '-' + nowMonth + '-' + (nowDate < 10 ? ('0' + nowDate) : nowDate) + ' ' + (nowHours < 10 ? ('0' + nowHours) : nowHours) + ':' + (nowMinutes < 10 ? ('0' + nowMinutes) : nowMinutes);
  }
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  // 使用db.command查询指令查询ids
  const dbcmd = db.command;
  let now = getTime();
  db.collection('tasks').where({
    end_time: dbcmd.lte(now),
    finished: false,
    long_term: false
  }).update({
    data: {
      finished: true
    }
  }).then(res => res)
  .catch(res => console.log(res.errMsg));
};
