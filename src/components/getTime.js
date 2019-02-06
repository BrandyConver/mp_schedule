function getTime (now = new Date()) {
  let nowMonth = now.getMonth() + 1;
  let nowDate = now.getDate();
  let nowHours = now.getHours();
  let nowMinutes = now.getMinutes();
  if (nowMonth < 10) {
    nowMonth = '0' + nowMonth;
  }
  return now.getFullYear() + '-' + nowMonth + '-' + (nowDate < 10 ? ('0' + nowDate) : nowDate) + ' ' + (nowHours < 10 ? ('0' + nowHours) : nowHours) + ':' + (nowMinutes < 10 ? ('0' + nowMinutes) : nowMinutes);
  }
export default getTime;
