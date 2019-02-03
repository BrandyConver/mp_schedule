// 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// 云函数入口函数
exports.main =  (event, context) => {
  return event;
}

// rrError: errCode: -404011 cloud function execution error | errMsg: cloud.callFunction:fail requestID db5cfa87-27b9-11e9-bf3a-52540025df0e, cloud function service error code -504002, error message Cannot find module 'wx-server-sdk'; at cloud.callFunction api; 