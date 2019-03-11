// 全局搜索函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let world = event.world;
  let kwd = new RegExp(world, 'ig');
  let result1 = db.collection('tasks').where({
    _openid: event.userInfo.openId,
    task_name: kwd
  }).get();
  let result2 = db.collection('tasks').where({
    _openid: event.userInfo.openId,
    detail: kwd
  }).get();
  // let result = [...new Set(result1.concat(result2))];
  return result1;
};
