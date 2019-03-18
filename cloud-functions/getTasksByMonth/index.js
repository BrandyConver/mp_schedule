const getDateRange = function (year, month) {
  if (month < 10) {
    month = '0' + month;
  }
  return {
    from: `${year}-${month}-01`,
    to: `${year}-${month}-31`
  }
}

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const dbcmd = db.command;

exports.main = async (event) => {
  let curYear = event.curYear;
  let curMonth = event.curMonth;
  let {from, to} = getDateRange(curYear, curMonth);
  let data = db.collection('tasks').where({
    _openid: event.userInfo.openId,
    start_time: dbcmd.lt(to),
    end_time: dbcmd.gte(from),
    long_term: false,
    finished: false
  }).field({
    task_name: true,
    _id: true,
    start_time: true,
    end_time: true
  })
  .get().then(res => {
    return res.data
  })
  return data;
}
