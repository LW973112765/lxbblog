function getDateNum(year, month) {
  if (!year) {
    year = new Date().getFullYear();
  }
  if (!month) {
    month = new Date().getMonth() + 1;
  }
  console.log(year + "年-" + month + "月");

  let d = new Date(year, month, 0);
  let result = d.getDate();
  console.log(result);
  return result;
}
getDateNum(2021, 20);
