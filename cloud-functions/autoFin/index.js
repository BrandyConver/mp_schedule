// 自动标记完成
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let ids = event.ids;
  let operation = event.operation;
  // 使用db.command查询指令查询ids
  const dbcmd = db.command;
};
