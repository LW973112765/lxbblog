const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "qq", //使用的邮箱服务，这里qq为例
  port: 465, //邮箱服务端口号
  secure: false, // true for 465, false for other ports
  auth: {
    user: "973112765@qq.com", // 你的邮箱账号，这里以qq邮箱为例
    pass: "rxcddkdajivxbbji", // 授权码，在你开启邮箱的的pos/smtp服务时能够得到的授权码，不是邮箱密码
  },
});

// send mail with defined transport object
let code = Math.floor(Math.random() * 900000) + 100000;
console.log(code);
transporter
  .sendMail({
    from: "973112765@qq.com", // 发件地址，就是上面你输入的邮箱
    to: "876713041@qq.com", // 收件列表，要发送的目标邮箱
    subject: "验证码", // 标题
    html: `<div>
     <p>感谢您注册狼小宝博客，您的验证码是：<span style={color:red}>${code}</span></P>
  </div > `, // html 内容
  })
  .then((res) => {
    console.log(res);
  });
