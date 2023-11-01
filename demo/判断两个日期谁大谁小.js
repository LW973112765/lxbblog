function getDaysBetween(startDate, enDate) {
  const sDate = Date.parse(startDate);
  const eDate = Date.parse(enDate);
  let zxl = sDate - eDate;
  if (zxl < 0) {
    return false;
  } else {
    return true;
  }
}
const d2 = "2021-03-22 20:00:00";
const d1 = "2021-03-22 15:10:36";
const days = getDaysBetween(d1, d2);
console.log(days);
