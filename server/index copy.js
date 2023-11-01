//搭建express服务
const express = require("express");
const app = express();
const path = require("path");
var moment = require("moment");
const db = require("./mysql");
db.connect();
//post 请求表单数据
app.use(express.urlencoded({ extended: true }));
//资源共享
const cors = require("cors");
app.use(cors());
//静态文件托管 ----  访问：http:localhost:8989/图片.jpg
app.use(express.static(path.join(__dirname, "upload")));

//路由
const router = require("./router");

app.use("/api", router);

app.listen(8989, () => {
  console.log("8989服务器启动成功!");
});

var CronJob = require("cron").CronJob;
let daydayloveyoutime = "*/1 * * * * *";
var day = 0;
function daydayloveyou() {
  function toChineseNum(number) {
    const chineseNum = [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
    ];
    const chineseUnit = ["", "十", "百", "千", "万", "亿"];
    let numStr = number.toString();
    let len = numStr.length;
    let str = "";
    for (let i = 0; i < len; i++) {
      str += chineseNum[parseInt(numStr[i])] + chineseUnit[len - 1 - i];
    }
    str = str.replace(/零[十百千]/g, "零");
    str = str.replace(/零+/g, "零");
    str = str.replace(/^零+/, "");
    str = str.replace(/零+$/, "");
    if (str[str.length - 1] === "零") {
      str = str.slice(0, -1);
    }
    return str;
  }
  day++;
  if (day >= 731) {
    return;
  }
  let DAY = toChineseNum(day);
  let title = `今天是咱们在一起的第${DAY}天，我依然很喜欢很爱你`;
  let starttime = moment("2019-09-21 00:13:14").add(day - 1, "d");
  let time = moment(starttime).format("YYYY-MM-DD HH:mm:ss");
  db.query(
    `insert into loveyoueveryday set title='${title}',time='${time}'`,
    (error, results) => {
      if (error) throw error;
      console.log(results, "结果");
    }
  );
}
new CronJob(daydayloveyoutime, daydayloveyou, null, true, "Asia/Shanghai");
