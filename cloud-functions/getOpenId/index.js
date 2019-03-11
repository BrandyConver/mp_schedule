// 云函数入口文件
exports.main = (event, context) => {
  return {
    openid: event.userInfo.openId
  }
}
