function getTime () {
      let now = new Date();
      let nowMonth = now.getMonth() + 1;
      let nowDate = now.getDate();
      let nowHours = now.getHours();
      let nowMinutes = now.getMinutes();
      if (nowMonth < 10) {
        nowMonth = '0' + nowMonth;
      }
      return now.getFullYear() + '-' + nowMonth + '-' + (nowDate > 10 ? nowDate : ('0' + nowDate)) + ' ' + (nowHours > 10 ? nowHours : ('0' + nowHours)) + ':' + (nowMinutes > 10 ? nowMinutes : ('0' + nowMinutes));
     }
export default getTime;
