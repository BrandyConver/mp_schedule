const getDateRange = function (year, month) {
  let now = new Date(year, month, 1);
  let nowMonth = now.getMonth();
  let nextMonth = nowMonth + 1;
  if (nowMonth < 10) {
    nowMonth = '0' + nowMonth;
  }
  if (nextMonth < 10) {
    nextMonth = '0' + nextMonth;
  }
  return {
    from: now.getFullYear() + '-' + nowMonth + '-' + '01',
    to: now.getFullYear() + '-' + nextMonth + '-' + '01'
  }
}

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const dbcmd = db.command;

exports.main = (event, context) => {


  let curYear = event.curYear;
  let curMonth = event.curMonth;
  let {from, to} = getDateRange(curYear, curMonth);
  db.collection('tasks').where({
    _openid: event.userInfo.openId,
    start_time: dbcmd.lt(to),
    end_time: dbcmd.gte(from)
  })
  return {
    openid: event.userInfo.openId,
    event: event,
    context: context
  }
}
