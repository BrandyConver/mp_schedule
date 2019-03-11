// 批量操作task server端使用promise函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let ids = event.ids;
  let operation = event.operation;
  // 使用db.command指令查询ids
  const dbcmd = db.command;

  // 批量删除
  if (operation === 'remove') {
    try {
      return await db.collection('tasks').where({
        _id: dbcmd.in(ids)
      }).remove()
    } catch (e) {
      console.error(e)
    }

    // 批量完成
  } else if (operation === 'finish') {
    try {
      return await db.collection('tasks').where({
        _id: dbcmd.in(ids)
      })
        .update({
          data: {
            finished: true
          },
        })
    } catch (e) {
      console.error(e)
    }
  } else {
    console.error('incorrect operation');
  }
};
