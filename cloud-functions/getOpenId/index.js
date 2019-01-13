// 云函数入口文件
exports.main = (event, context) => {
  // console.log 的内容可以在云开发云函数调用日志查看
  return {
    openid: event.userInfo.openId,
  }
}
