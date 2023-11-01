//搭建express服务
const express = require("express");
const app = express();
const path = require("path");

// app.all('*', function (req, res, next) {
//     // 设置允许跨域的域名，*代表允许任意域名跨域
//     res.header('Access-Control-Allow-Origin', '*');
//     // 允许的header类型
//     res.header('Access-Control-Allow-Headers', 'content-type');
//     // 解决node.js返回中文出现乱码的问题
//     res.setHeader('Content-Type', 'text/html; charset=utf-8')
//     // 跨域允许的请求方式
//     res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
//     if (req.method.toLowerCase() === 'options') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });
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

//设置定时任务
var date1 = +new Date();
var beforedate = +new Date("2021-9-21 00:00:00");
var time = (date1 - beforedate) / 1000;
var d = Math.ceil(time / 60 / 60 / 24);
const nodemailer = require("nodemailer");
let zxl = "1197062381@qq.com";
let lw = "876713041@qq.com";
let transporter = nodemailer.createTransport({
  service: "qq", //使用的邮箱服务，这里qq为例
  port: 587, //邮箱服务端口号
  secure: false, // true for 465, false for other ports
  auth: {
    user: "973112765@qq.com", // 你的邮箱账号，这里以qq邮箱为例
    pass: "rxcddkdajivxbbji",
    // pass: "antbrhklrfwtbdbb",
    // 授权码，在你开启邮箱的的pos/smtp服务时能够得到的授权码，不是邮箱密码
  },
});
var CronJob = require("cron").CronJob;
//定时任务时间
//签到时间
let cronTime = "0 0 0 * * *";
//午饭时间
// let wufantime= "12 00 00 * * *";
let wufantime = "0 0 12 * * *";
//晚饭时间
let wanfantime = "0 0 18 * * *";
//定时任务
//签到提醒
function task() {
  transporter
    .sendMail({
      from: "973112765@qq.com", // 发件地址，就是上面你输入的邮箱
      to: [zxl, lw], // 收件列表，要发送的目标邮箱
      subject: "宝宝老婆恋爱签到", // 标题
      html: `  <div
      style="
        width: 100%;
        height: auto;
        min-height: 600px;
        background: -webkit-linear-gradient(top, pink, #999999);
        border-radius: 5px;
      "
    >
      <div
        style="position: relative; border-bottom: 1px solid #999; height: 80px"
      >
        <div
          style="
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
          "
        >
          <img
            src="http://lwandzxl.top/logo3.png"
            alt=""
            style="vertical-align: middle; width: 20px; height: 20px"
          /><span style="display: inline-block; color: #333">狼小宝博客</span>
        </div>
      </div>
      <div>
        <p style="color: #333; text-align: center">
          今天是咱们在一起的第${d}天，我依然很喜欢很爱你！
        </p>
      </div>
    </div>`, // html 内容
    })
    .then((res) => {
      console.log(res);
    });
}
//午饭提醒
function wufan() {
  let arr = [
    "香多了",
    "臭多了",
    "郎多了",
    "臭屁宝",
    "臭皮鞋",
    "臭屁蛋",
    "郎皮蛋",
  ];
  let name = arr[Math.floor(Math.random() * arr.length)];
  transporter
    .sendMail({
      from: "973112765@qq.com", // 发件地址，就是上面你输入的邮箱
      to: [zxl, lw], // 收件列表，要发送的目标邮箱
      subject: `${name}午饭时间到啦！`, // 标题
      html: `  <div
      style="
        width: 100%;
        height: auto;
        min-height: 600px;
        background: -webkit-linear-gradient(top, pink, #999999);
        border-radius: 5px;
      "
    >
      <div
        style="position: relative; border-bottom: 1px solid #999; height: 80px"
      >
        <div
          style="
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
          "
        >
          <img
            src="http://lwandzxl.top/logo3.png"
            alt=""
            style="vertical-align: middle; width: 20px; height: 20px"
          /><span style="display: inline-block; color: #333">狼小宝博客</span>
        </div>
      </div>
      <div>
        <p style="color: #333; text-align: center">
          ${name},你该吃午饭啦！
        </p>
      </div>
    </div>`, // html 内容
    })
    .then((res) => {
      console.log(res);
    });
}
//晚饭提醒
function wanfan() {
  let arr = [
    "香多了",
    "臭多了",
    "郎多了",
    "臭屁宝",
    "臭皮鞋",
    "臭屁蛋",
    "郎皮蛋",
  ];
  let name = arr[Math.floor(Math.random() * arr.length)];
  transporter
    .sendMail({
      from: "973112765@qq.com", // 发件地址，就是上面你输入的邮箱
      to: [zxl, lw], // 收件列表，要发送的目标邮箱
      subject: `${name}晚饭时间到啦！`, // 标题
      html: `  <div
      style="
        width: 100%;
        height: auto;
        min-height: 600px;
        background: -webkit-linear-gradient(top, pink, #999999);
        border-radius: 5px;
      "
    >
      <div
        style="position: relative; border-bottom: 1px solid #999; height: 80px"
      >
        <div
          style="
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
          "
        >
          <img
            src="http://lwandzxl.top/logo3.png"
            alt=""
            style="vertical-align: middle; width: 20px; height: 20px"
          /><span style="display: inline-block; color: #333">狼小宝博客</span>
        </div>
      </div>
      <div>
        <p style="color: #333; text-align: center">
          ${name},你该吃晚饭啦！
        </p>
      </div>
    </div>`, // html 内容
    })
    .then((res) => {
      console.log(res);
    });
}
new CronJob(cronTime, task, null, true, "Asia/Shanghai");
new CronJob(wufantime, wufan, null, true, "Asia/Shanghai");
new CronJob(wanfantime, wanfantime, null, true, "Asia/Shanghai");
