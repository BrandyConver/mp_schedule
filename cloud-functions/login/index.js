// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

/* event 参数包含
 * - 小程序端调用传入的 data
 * - 经过微信鉴权直接可信的用户唯一标识 openid 
 * 
 */
exports.main = (event, context) => {
  console.log('event:' + event)
  console.log('context:' + context)
  // console.log 的内容可以在云开发云函数调用日志查看

  return {
    openid: event.userInfo.openId,
    event: event,
    context: context
  }
}
