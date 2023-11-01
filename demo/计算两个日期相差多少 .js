function getDaysBetween(startDate, enDate) {
  const sDate = Date.parse(startDate);
  // console.log(sDate);
  const eDate = Date.parse(enDate);
  const zxl = Math.abs(eDate - sDate);
  // const days = zxl / (1 * 24 * 60 * 60 * 1000);
  const s = zxl / 1000;
  const m = s / 60;
  const h = m / 60;
  const d = h / 24;
  // console.log(h, "h");
  // console.log(m, "m");
  console.log(s, "s");
  // console.log(h);
  // console.log(h);
  console.log(d, "d");
  if (s >= 1 && s < 60) {
    return Math.floor(s) + "秒钟";
  }
  if (m >= 1 && m < 60) {
    return Math.floor(m) + "分钟";
  }
  if (h >= 1 && h < 24) {
    return Math.floor(h) + "小时";
  }
  if (d >= 1 && d <= 30) {
    return Math.floor(d) + "天";
  }
  if (d > 30 && d < 365) {
    return Math.floor(d / 30) + "个月";
  }
  if (d > 365) {
    return Math.floor(d / 365) + "年";
  }
}
const d2 = "2023-07-25";
const d1 = "2023-06-27";
const days = getDaysBetween(d1, d2);
console.log(days);
