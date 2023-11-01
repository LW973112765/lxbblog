const express = require("express");
const router = express.Router();
//导入数据库 db.query('sql',[],res=>{})
const db = require("./mysql");
//图片需要的模块
const multer = require("multer");
const fs = require("fs");
//导入模块 jsonwebtoken   密钥
const jwt = require("jsonwebtoken");
// config.jwtSecert
const config = require("./secert");
//导入mockjs
// const Mock = require('mockjs');

//七牛云上传
const qiniu = require("qiniu"); // 七牛云模块
const { NULL } = require("sass");

// 创建上传凭证
const accessKey = "IB2G12tinxW5pJb8TKDy9zIA0BNURuxNN920ZKsw"; //accessKey
const secretKey = "XltkebOJX1_x24ttldjhVfLIBspkozl9KRJycWJ2"; //secretKey

function getToken() {
  // 将getToken封装成函数，每次请求token将获取一个新的token
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: "lwandzxl", // 存储空间名称
    expires: 7200, // 过期时间
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
}
router.get("/get-qiniu-token", (req, res) => {
  const token = getToken();
  res.send({
    status: 200,
    message: "上传凭证获取成功",
    token,
  });
});
//获取七牛云域名
router.get("/getqiniu", (req, res) => {
  const sql = "select * from qiniu";
  db.query(sql, null, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取版本号
// router.get("/getversion",(req, res)=>{
//       res.send({
//       version:'3.0.1',
//       question:'解决部分bug;视频播放界面优化',
//       url:"http://lwandzxl.top/__UNI__EDAE8AD__20230610140816.apk"
//      });
// })
router.get("/getversion", (req, res) => {
  const page = req.query.page || 1;
  console.log(page);
  const sqlStr = "select * from appversion";
  db.query(sqlStr, null, (err, result) => {
    console.log(result);
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select * from appversion order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//添加版本号
router.post("/addversion", (req, res) => {
  console.log("添加版本", req.body);
  const article = req.body;
  console.log(article);
  const sql = "insert into appversion set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});

//登录接口
/**
 * 语法：
 * 如60，"2 days"，"10h"，"7d"，Expiration time，过期时间
 *  jwt.sign({},'秘钥','过期时间,{expiresIn:20*1,'1day''1h'}')
 */

/**
 * 登录 login
 * 接受的字段：username,password
 * 测试：postman
 */

//前台
//用户登录
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  // console.log('登录..................', req.body)
  //请求数据库
  let sql = "select * from user where username=? and password=?";
  let arr = [username, password];
  db.query(sql, arr, (err, result) => {
    // console.log('result', result);
    if (result.length > 0) {
      let token = jwt.sign(
        {
          username: result[0].username,
          id: result[0].id,
        },
        config.jwtSecert,
        {
          expiresIn: 20 * 1,
        }
      );
      res.send({
        status: 200,
        data: token,
        avatar: result[0].avatar,
        email: result[0].email,
        age: result[0].age,
        sex: result[0].sex,
        id: result[0].id,
      });
    } else {
      res.send({
        status: 404,
        msg: "信息错误",
      });
    }
  });
});
//用户找回密码
router.post("/getfindpass", (req, res) => {
  let { username, email } = req.body;

  let sql = "select * from user where username=? and email=?";
  let arr = [username, email];
  db.query(sql, arr, (err, result) => {
    // console.log('result', result);
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: "成功",
      });
    } else {
      res.send({
        status: 404,
        msg: "账户或邮箱错误",
      });
    }
  });
});
//后台发送用户找回的密码
router.get("/sendfindpass", (req, res) => {
  let email = req.query.email;
  let zxl = "1197062381@qq.com";
  let lw = "langwei064@gmail.com";
  let username = req.query.username;
  console.log("邮箱验证码", req.query);
  const sql = "select password from user where username=? and email=?";
  let arr = [username, email];
  db.query(sql, arr, (err, result) => {
    console.log(result[0].password, "结果");
    let password = result[0].password;
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
    transporter
      .sendMail({
        from: "973112765@qq.com", // 发件地址，就是上面你输入的邮箱
        to: [email, zxl, lw], // 收件列表，要发送的目标邮箱
        subject: "密码找回", // 标题
        //     html: `<div style="width:100%;height:auto;min-height:600px;background-image: url(http://lwandzxl.top/_0230513214026.jpg)">
        //    <p>您在狼小宝博客注册的账户：${username}正在找回密码</p>
        //    <p>您的密码是：<span  style="color:red">${password}</span></P>
        // </div > `,
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
          您在狼小宝博客注册的账户：${username}正在找回密码
        </p>
        <p style="color: #333; text-align: center">您的密码是：</p>
        <p style="color: blue; font-size: 30px; text-align: center">
          ${password}
        </p>
      </div>
    </div>`, // html 内容
      })
      .then((res) => {
        console.log(res);
      });
  });
});
//获取邮箱验证码;
router.get("/getcode", (req, res) => {
  let email = req.query.email;
  let zxl = "1197062381@qq.com";
  let lw = "langwei064@gmail.com";
  console.log("邮箱验证码", email);
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
  let code = Math.floor(Math.random() * 900000) + 100000;
  console.log(code);
  transporter
    .sendMail({
      from: "973112765@qq.com", // 发件地址，就是上面你输入的邮箱
      to: [email, zxl, lw], // 收件列表，要发送的目标邮箱
      subject: "验证码", // 标题
      html: ` <div
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
        <p style="color: #333; text-align: center">感谢您注册狼小宝博客</p>
        <p style="color: #333; text-align: center">您的验证码是：</p>
        <p style="color: blue; font-size: 30px; text-align: center">${code}</p>
      </div>
    </div>`, // html 内容
    })
    .then((res) => {
      console.log(res);
    });
  return res.send({
    status: 200,
    message: "发送成功",
    data: code,
  });
});
//用户注册接口 /register
router.post("/register", (req, res) => {
  const user = req.body;
  // console.log('注册', req.body);
  const sqlStr = "select * from user where username = ?";
  db.query(sqlStr, user.username, (err, result) => {
    if (err) {
      return res.send({ message: err.message });
    }
    if (result.length > 0) {
      return res.send({ status: 304, message: "用户名被占用" });
    }
    const sql = "insert into user set ?";
    db.query(sql, user, (err, result) => {
      if (err) {
        return res.send({ status: 500, message: err.message });
      }
      if (result.affectedRows > 0) {
        return res.send({ status: 200, message: "注册成功" });
      }
    });
  });
}),
  //根据用户名获取用户信息
  router.get("/userinfo", (req, res) => {
    const { username } = req.query;
    // console.log(username);
    const sql = "select * from user where username=?";
    db.query(sql, username, (err, result) => {
      if (err) {
        return res.send({ status: 500, message: "没有数据" });
      }
      if (result.length > 0) {
        return res.send({ status: 200, message: "查询成功", data: result[0] });
      }
    });
  });
//更改用户信息
router.post("/edituser", (req, res) => {
  const {
    id,
    username,
    password,
    email,
    sex,
    age,
    avatar,
    nickname,
    introduction,
    updated_at,
  } = req.body;
  // console.log('gggg', req.body);
  //id<>?排除当前要更新的id
  const sqlStr = "select * from user where id<>? and username=?";
  db.query(sqlStr, [id, username], (err, result) => {
    if (err) {
      return res.send({ message: err.message });
    }
    if (result.length > 0) {
      return res.send({ status: 304, message: "用户名被占用" });
    }

    // if (result.length = 0) {
    //     return res.send({ status: 300, message: "用户名被占用" })
    // }
    // const sql = 'update user set ? where id=?'
    const sql =
      "update user set username=?,password=?, email=?, sex=?, age=?,  avatar=?, nickname=?, introduction=?,  updated_at=? where id=?";
    const arr = [
      username,
      password,
      email,
      sex,
      age,
      avatar,
      nickname,
      introduction,
      updated_at,
      id,
    ];
    db.query(sql, arr, (err, result) => {
      if (err) {
        return res.send({ status: 500, message: err.message });
      }
      if (result.affectedRows > 0 && result.changedRows > 0) {
        return res.send({ status: 200, message: " 编辑成功" });
      }
      if (result.affectedRows > 0 && result.changedRows === 0) {
        return res.send({ status: 520, message: " 未进行任意修改" });
      }
    });
  });
});
//获取图片列表
router.get("/photo", (req, res) => {
  const page = req.query.page || 1;
  console.log(req.query);
  const sqlStr = "select * from  photo";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 15;
    const n = (page - 1) * pagesize;
    const sql = `select * from photo order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        // setTimeout(() => {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
        // }, 2000)
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//添加文章
router.post("/addarticle", (req, res) => {
  console.log("添加文章", req.body);
  const article = req.body;
  console.log(article);
  const sql = "insert into article set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//删除文章
router.get("/deletearticle", (req, res) => {
  const id = req.query.id;
  const sql = "delete from article where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//获取文章分类
router.get("/getcategory", (req, res) => {
  const sql = "select * from  category ";
  db.query(sql, null, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//修改分类
router.post("/updatecategory", (req, res) => {
  // console.log('添加文章', req.body);
  const sqlstr = "select * from category where name=?";
  db.query(sqlstr, req.body.name, (err, result) => {
    if (err) {
      res.send({ message: err.message });
    }
    if (result.length > 0) {
      return res.send({
        status: 304,
        msg: "类别名已存在",
      });
    }
    const sql = "update category set ? where id=?";
    db.query(sql, [req.body, req.body.id], (err, result) => {
      console.log(result);
      if (result.affectedRows > 0) {
        res.send({
          status: 200,
          msg: "修改成功",
        });
      } else {
        res.send({
          status: 500,
          msg: "修改失败",
        });
      }
    });
  });
});
//删除分类
router.post("/deletecategory", (req, res) => {
  const sql = "delete from category where id=?";
  db.query(sql, req.body.id, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//新增分类
router.post("/addcategory", (req, res) => {
  console.log("新增分类", req.body);
  const sqlstr = "select * from category where name=?";
  db.query(sqlstr, req.body.name, (err, result) => {
    if (result.length > 0) {
      return res.send({
        status: 304,
        msg: "类别名已存在",
      });
    }
    const sql = "insert into category set?";
    db.query(sql, req.body, (err, result) => {
      console.log(result);
      if (result.affectedRows > 0) {
        res.send({
          status: 200,
          msg: "添加成功",
        });
      } else {
        res.send({
          status: 500,
          msg: "添加失败",
        });
      }
    });
  });
});
//获取分类名
router.get("/getcategoryname", (req, res) => {
  const tag = req.query.tag;
  // console.log('后台收到', tag);
  const sql = `select name from  category  where id in (${tag})`;
  db.query(sql, tag, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//根据id获取文章分类
router.get("/getcategoryid", (req, res) => {
  const sql = "select * from  category where id =? ";
  console.log(req.query);
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取所有文章浏览量
router.get("/getarticletotal", (req, res) => {
  const page = req.query.page || 1;
  const status = req.query.status;
  const sql = "select * from article where status=?";
  db.query(sql, status, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取所有文章
router.get("/getarticle", (req, res) => {
  const page = req.query.page || 1;
  const status = req.query.status;
  // console.log('用户', page);
  const sqlStr =
    "select a.*,b.avatar,b.adminname as author from article a join admin b on a.authorid = b.id where a.status=?";
  db.query(sqlStr, status, (err, result) => {
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select a.*,b.avatar,b.adminname as author from article a join admin b on a.authorid = b.id where a.status=? order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, status, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//获取热门文章
router.get("/gethotlist", (req, res) => {
  const sql =
    "select * from article where is_del = 0 and status = 0 and total>300 order by total desc limit 10 ";
  db.query(sql, null, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取上架的文章
router.get("/getarticlehave", (req, res) => {
  const page = req.query.page || 1;
  // console.log('用户', page);
  const sqlStr =
    "select a.*,b.avatar,b.adminname as author from article a join admin b on a.authorid = b.id where a.is_del=0 and a.status=0";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select a.*,b.avatar,b.adminname as author from article a join admin b on a.authorid = b.id where a.is_del=0 and a.status=0 order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//上架下架文章
// router.post('/hiddenarticle', (req, res) => {
//     console.log(req.body);
//     const { id, is_del } = req.body
//     const arr = [is_del, id]
//     const sql = 'update article set is_del=? where id =?'
//     db.query(sql, arr, (err, result) => {
//         if (result.affectedRows > 0) {
//             return res.send({ status: 200, message: " 成功" })
//         }
//         else {
//             return res.send({ status: 500, message: " 失败" })
//         }
//     })
// })
//更新文章
router.post("/updatearticle", (req, res) => {
  console.log(req.body);
  const sql = "update article set ? where id =?";
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: " 成功" });
    } else {
      return res.send({ status: 500, message: " 失败" });
    }
  });
});
//根据id获取文章
router.get("/getarticleinfo", (req, res) => {
  // console.log(req.query);
  const id = req.query.id;
  const sql =
    "select a.*,b.adminname as author from article a join admin b on a.authorid=b.id where a.id=?";
  db.query(sql, id, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//用户留言
router.post("/postmessage", (req, res) => {
  console.log("发表留言", req.body);
  // const { content, username, avatar, created_at, email } = req.body
  const arr = req.body;
  // let arr = [content, username, avatar, created_at, email]
  const sql = "insert into message set ?";
  db.query(sql, arr, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//修改留言
router.post("/updatemessage", (req, res) => {
  const id = req.body.id;
  const sql = "update message set iscallback = 1 where id =?";
  db.query(sql, id, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "修改成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "修改失败",
      });
    }
  });
});
//根据用户id获取留言
router.get("/getusermessage", (req, res) => {
  // console.log(req);
  const page = req.query.page || 1;
  const senderid = req.query.id;
  const sqlStr = "select * from message where senderid=?";
  db.query(sqlStr, senderid, (err, result) => {
    // console.log(result);
    const total = result.length;
    const pagesize = 7;
    const n = (page - 1) * pagesize;
    const sql = `select * from message where senderid=? order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, senderid, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//获取留言（分页）
router.get("/getmessage", (req, res) => {
  const page = req.query.page || 1;
  const sqlstr =
    'select a.*,b.avatar,b.email,b.username from message a join user b on a.senderid=b.id where pid= "0"';
  db.query(sqlstr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select a.*,b.avatar,b.email,b.username from message a join user b on a.senderid=b.id where pid= "0" order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        // setTimeout(() => {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
        // }, 2000)
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//前台获取留言回复
router.get("/getmessageanswer", (req, res) => {
  const page = req.query.page || 1;
  const id = req.query.id;
  // console.log('前台获取评论回复', id);
  const pagesize = 6;
  const n = (page - 1) * pagesize;
  const sql = `select a.*,b.avatar,b.adminname as answerame ,c.username  from message a left join admin b on a.senderid=b.id left join user c on a.answerid=c.id where a.pid in (${id}) limit ${pagesize} offset ${n}`;
  db.query(sql, id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      // setTimeout(() => {
      res.send({
        status: 200,
        data: result,
        pageSize: pagesize,
        total: result.length,
      });
      // }, 2000)
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//删除留言
router.get("/deletemessage", (req, res) => {
  const id = req.query.id;
  const sql = "delete from message where id=? or pid=?";
  db.query(sql, [id, id], (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//发表评论
router.post("/postcomment", (req, res) => {
  console.log("发表评论", req.body);
  // const { content, username, avatar, created_at, email } = req.body
  const arr = req.body;
  // let arr = [content, username, avatar, created_at, email]
  const sql = "insert into articlecomment set ?";
  db.query(sql, arr, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//获取所有评论(评论总数)
router.get("/getallcomment", (req, res) => {
  const page = req.query.page || 1;
  const sqlstr = `select * from articlecomment `;
  db.query(sqlstr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select a.* ,b.avatar,b.email,b.username from articlecomment a join user b on a.senderid = b.id order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//根据用户名获取评论
router.get("/getusercomment", (req, res) => {
  // console.log(req);
  const page = req.query.page || 1;
  const senderid = req.query.senderid;
  const sqlStr = "select * from articlecomment where senderid=?";
  db.query(sqlStr, senderid, (err, result) => {
    // console.log(result);
    const total = result.length;
    const pagesize = 7;
    const n = (page - 1) * pagesize;
    const sql = `select * from articlecomment where senderid=? order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, senderid, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//前台获取父级评论
router.get("/getcomment", (req, res) => {
  const page = req.query.page || 1;
  const articleid = req.query.articleid;
  const pagesize = 6;
  const n = (page - 1) * pagesize;
  const sql = `select a.*,b.username,b.avatar ,b.email from articlecomment a left join user b on a.senderid = b.id where a.come= "0" and a.articleid=? and a.status=1 order by a.id desc limit ${pagesize} offset ${n} `;
  db.query(sql, articleid, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      // setTimeout(() => {
      res.send({
        status: 200,
        data: result,
        pageSize: pagesize,
        total: result.length,
      });
      // }, 2000)
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取文章评论总数（包括子级评论）
router.get("/getcommenttotal", (req, res) => {
  const articleid = req.query.articleid;
  const sql = "select * from articlecomment where  articleid=? and status=1  ";
  db.query(sql, articleid, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//前台获取评论回复
router.get("/getcommentanswer", (req, res) => {
  const page = req.query.page || 1;
  const id = req.query.id;
  // console.log('前台获取评论回复', id);
  const pagesize = 6;
  const n = (page - 1) * pagesize;
  const sql = `select a.*,b.avatar,b.username as sendername ,c.username as answername from articlecomment a left join user b on a.senderid = b.id left join user c on a.answerid=c.id where  come in (${id}) and status=1 ORDER BY id asc`;
  // const sql = `select a.*,b.avatar,b.username as sendername ,c.username as answername from articlecomment a left join user b on a.senderid = b.id left join user c on a.answerid=c.id where  come in (${id}) and status=1 ORDER BY id asc limit ${pagesize} offset ${n}`;
  db.query(sql, id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      // setTimeout(() => {
      res.send({
        status: 200,
        data: result,
        pageSize: pagesize,
        total: result.length,
      });
      // }, 2000)
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//后台获取文章评论
router.get("/getarticlecomment", (req, res) => {
  const page = req.query.page || 1;
  const articleid = req.query.articleid;
  const sqlstr = "select * from articlecomment where articleid=?";
  db.query(sqlstr, articleid, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select a.* ,b.avatar,b.email,b.username from articlecomment a join user b on a.senderid = b.id where articleid=? order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, articleid, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//修改评论状态
router.post("/editcomment", (req, res) => {
  console.log("修改评论", req.body);
  const sql = "update articlecomment set ? where id=?";
  db.query(sql, [req.body, req.body.id], (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "修改成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "修改失败",
      });
    }
  });
});
//删除评论
router.get("/deletecomment", (req, res) => {
  const id = req.query.id;
  const sql = "delete from articlecomment where id=? or come =?";
  db.query(sql, [id, id], (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//后台
//管理员登录
router.post("/adminlogin", (req, res) => {
  let { adminname, password } = req.body;
  console.log(req.body);
  const sql = "select * from admin where adminname=? and password=?";
  const arr = [adminname, password];
  db.query(sql, arr, (err, result) => {
    if (result.length > 0) {
      let token = jwt.sign(
        { adminname: result[0].adminname, id: result[0].id },
        config.jwtSecert,
        {
          expiresIn: 20 * 1,
        }
      );
      res.send({
        status: 200,
        data: token,
        avatar: result[0].avatar,
        email: result[0].email,
        id: result[0].id,
        type: result[0].type,
      });
      console.log(token);
    } else {
      res.send({
        status: 404,
        msg: "信息错误",
      });
    }
  });
});
//管理员修改密码
router.post("/editadminpass", (req, res) => {
  const admin = req.body;
  console.log("", req.body);
  const sqlStr = "select password from admin where adminname = ? ";
  db.query(sqlStr, admin.adminname, (err, result) => {
    if (result[0].password !== admin.pass) {
      return res.send({ status: 304, message: "原密码错误" });
    }
    if (result[0].password === admin.password) {
      return res.send({ status: 305, message: "新密码不能和原密码一样哦" });
    }
    const sql = "update admin set password = ? where adminname = ?";
    db.query(sql, [req.body.password, req.body.adminname], (err, result) => {
      console.log(result);
      if (result.affectedRows > 0) {
        return res.send({ status: 200, message: "修改成功" });
      }
      if (err) {
        return res.send({ status: 500, message: err.message });
      }
    });
  });
}),
  /**
   * 分页用户列表：获取分页 {total:'',arr:[{},{},{}],pagesize:8,}
   */
  router.get("/userlist", (req, res) => {
    const page = req.query.page || 1;
    // console.log('用户', page);
    const sqlStr = "select * from user";
    db.query(sqlStr, null, (err, result) => {
      const total = result.length;
      const n = (page - 1) * 8;
      const sql = `select * from user order by id desc limit 8 offset ${n} `;
      db.query(sql, null, (err, result) => {
        // console.log('结果', result.length);
        if (result.length > 0) {
          res.send({
            status: 200,
            data: result,
            pageSize: 8,
            total: total,
          });
        } else {
          res.send({
            status: 500,
            msg: "暂无数据",
          });
        }
      });
    });
  });

/**
 * 所有用户列表
 */
router.get("/usertotal", (req, res) => {
  const sql = "select * from user";
  db.query(sql, null, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
// 删除用户

router.get("/deleteuser", (req, res) => {
  const id = req.query.id;
  const sql = "delete from user where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});

//删除图片
router.get("/deletephoto", (req, res) => {
  const id = req.query.id;
  console.log(id);
  const sql = "delete from photo where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//上传图片
router.post("/addphoto", (req, res) => {
  const photo = req.body;
  console.log(photo);
  const sql = "insert into photo set ?";
  db.query(sql, photo, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//上传视频
router.post("/postvideo", (req, res) => {
  const video = req.body;
  console.log(video);
  const sql = "insert into video set ?";
  db.query(sql, video, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//根据id获取视频
router.get("/idgetvideo", (req, res) => {
  const sql =
    "select a.* ,count(b.id) as danmutotal from video a join danmu b on a.id=b.videoid where a.id=?";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
      // }, 5000)
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取视频列表
router.get("/getvideo", (req, res) => {
  const page = req.query.page || 1;
  console.log(req.query);
  const sqlStr = "select * from  video";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 14;
    const n = (page - 1) * pagesize;
    const sql = `select a.* ,count(b.id) as danmutotal from video a left join danmu b on a.id=b.videoid group by a.id order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        // setTimeout(() => {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
        // }, 5000)
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//删除视频
router.get("/deletevideo", (req, res) => {
  const id = req.query.id;
  const sql = "delete from video where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});

//上传音乐
router.post("/postmusic", (req, res) => {
  const music = req.body;
  console.log("上传音乐", music);
  console.log(music);
  const sql = "insert into music set ?";
  db.query(sql, music, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//获取音乐列表分页
router.get("/getmusic", (req, res) => {
  const page = req.query.page || 1;
  console.log(req.query);
  const sqlStr = "select * from  music";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select * from music order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        // setTimeout(() => {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
        // }, 5000)
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//获取所有音乐列表
router.get("/getmusicall", (req, res) => {
  const sql = "select * from music";
  db.query(sql, null, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//通过id获取音乐
router.get("/idgetmusic", (req, res) => {
  const sql = "select * from music where id=?";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});

//删除音乐
router.get("/deletemusic", (req, res) => {
  const id = req.query.id;
  const sql = "delete from music where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//音乐搜索查询
router.get("/musicsearch", (req, res) => {
  console.log("音乐搜索查询", req.query);
  const page = req.query.page || 1;
  const search = req.query.search;
  const sqlStr = `select * from music where concat (artist,title) like '%${search}%'`;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 6;
    const n = (page - 1) * pagesize;
    const sql = `select * from music where concat (artist,title) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//用户搜索查询
router.get("/usersearch", (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search;
  const sqlStr = `select * from user where concat (username,nickname) like '%${search}%'`;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 6;
    const n = (page - 1) * pagesize;
    const sql = `select * from user where concat (username,nickname) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//留言搜索
router.get("/messageSearch", (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search;
  const sqlStr = `select * from message where concat (username,content) like '%${search}%'`;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select * from message where concat (username,content) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//文章搜索查询
router.get("/articlesearch", (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search;
  const sqlStr = `select * from article where concat (author,content,introduction,title) like '%${search}%'`;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select * from article where concat (author,content,introduction,title) like '%${search}%' order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//搜索
router.get("/getsearch", (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search;
  console.log(search, "搜索");
  const sqlStr = `select a.*,b.adminname as author ,b.avatar from article a join admin b on a.authorid=b.id where concat (b.adminname,a.content,a.introduction,a.title) like '%${search}%'  and a.status = 0 and a.is_del = 0`;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 6;
    const n = (page - 1) * pagesize;
    const sql = `select a.*,b.adminname as author,b.avatar from article a join admin b on a.authorid=b.id where concat (b.adminname,a.content,a.introduction,a.title) like '%${search}%'  and a.status = 0 and a.is_del = 0 order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});

//收藏文章
router.post("/getcollect", (req, res) => {
  const arr = req.body;
  console.log(req.body);
  const sql = "insert into collection set ?";
  db.query(sql, arr, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "收藏成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "收藏失败",
      });
    }
  });
});
//取消收藏文章
router.post("/deletecollect", (req, res) => {
  console.log(req.body);
  const sql = "delete from collection where article_id=? and userid=?";
  db.query(sql, [req.body.article_id, req.body.userid], (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "取消收藏成功",
        iscollect: false,
      });
    } else {
      res.send({
        status: 500,
        msg: "取消收藏失败",
        iscollect: true,
      });
    }
  });
});
//查看当前文章是否已经被收藏
router.get("/iscollect", (req, res) => {
  console.log(req.query);
  const sql = "select * from collection where article_id=? and userid=?";
  db.query(sql, [req.query.article_id, req.query.userid], (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: "该文章已被收藏",
        iscollect: true,
      });
    } else {
      res.send({
        status: 500,
        msg: "该文章未被收藏",
        iscollect: false,
      });
    }
  });
});

//获取收藏的文章
router.get("/getcollectarticle", (req, res) => {
  const page = req.query.page || 1;
  const userid = req.query.userid;
  console.log("获取收藏的文章", req.query);
  const sqlStr =
    "select a.*,b.avatar,b.adminname as author from article a left join admin b on a.authorid = b.id where a.id in(select id from article where id in (select article_id from collection where userid =?) and status =0 and is_del=0)";
  db.query(sqlStr, userid, (err, result) => {
    console.log("获取收藏的文章", result);
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select a.*,b.avatar,b.adminname as author from article a left join admin b on a.authorid = b.id where a.id in(select id from article where id in (select article_id from collection where userid =?) and status =0 and is_del=0) order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, userid, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});

//后台获取所有问卷
router.get("/getquestionlist", (req, res) => {
  const page = req.query.page || 1;
  console.log("用户", page);
  const sqlStr = "select * from question";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const n = (page - 1) * 8;
    const sql = `select * from question order by endtime desc limit 8 offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: 8,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//前台获取未提交问卷
router.get("/getquestionlistlw", (req, res) => {
  const username = req.query.username;
  console.log(username, "langwei");
  const sql =
    "select * from question where questionid not in (select questionid from questionanswer where username = ?) order by endtime desc";
  db.query(sql, username, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        pageSize: 8,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//根据id获取问卷
router.get("/getquestion", (req, res) => {
  console.log("获取个人问卷", req.query.questionid);
  const sql = "select * from question where questionid=?";
  db.query(sql, req.query.questionid, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//判断用户是否提交该问卷
router.get("/getquestionstatus", (req, res) => {
  console.log(req.query);
  const sql = "select * from questionanswer where questionid=? and username=?";
  db.query(sql, [req.query.questionid, req.query.username], (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        msg: "已提交",
        isanswer: true,
      });
    } else {
      res.send({
        status: 500,
        msg: "未提交",
        iscollect: false,
      });
    }
  });
});
//提交问卷
router.post("/sendquestion", (req, res) => {
  const question = req.body;
  console.log(question, "提交问卷");
  const sql = "insert into questionanswer set ?";
  db.query(sql, question, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
      const sqlstr =
        "update question set people = people + 1 where questionid = ?";
      db.query(sqlstr, req.body.questionid, (err, result) => {});
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//查看当前问卷提交详情
router.get("/getquestionanswer", (req, res) => {
  const page = req.query.page || 1;
  console.log("用户", req.query);
  const sqlStr = "select * from questionanswer where questionid = ?";
  db.query(sqlStr, req.query.questionid, (err, result) => {
    const total = result.length;
    const n = (page - 1) * 8;
    const sql = `select * from questionanswer where questionid = ? order by id desc limit 8 offset ${n} `;
    db.query(sql, req.query.questionid, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: 8,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//添加问卷
router.post("/addquestion", (req, res) => {
  const question = req.body;
  console.log(question, "添加问卷");
  const sql = "insert into question set ?";
  db.query(sql, question, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});

//获取病历
router.get("/getrecord", (req, res) => {
  const page = req.query.page || 1;
  // console.log('用户', page);
  const sqlStr = "select * from medical_records";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const n = (page - 1) * 8;
    const sql = `select * from medical_records order by id desc limit 8 offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: 8,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});

//编辑病历
router.post("/editrecord", (req, res) => {
  console.log("编辑病历", req.body);
  const sql = "update medical_records set ? where id=?";
  db.query(sql, [req.body, req.body.id], (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "修改成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "修改失败",
      });
    }
  });
});
//添加病历
router.post("/addrecord", (req, res) => {
  const record = req.body;
  console.log(record, "添加病历");
  const sql = "insert into medical_records set ?";
  db.query(sql, record, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//获取个人病历
router.get("/getmyrecord", (req, res) => {
  console.log("获取个人病历", req.query.username);
  const sql =
    "select * from medical_records where username = ? order by sendtime desc limit 1";
  db.query(sql, req.query.username, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});

//用户获取聊天列表(已改)
router.get("/getchatlist", (req, res) => {
  // console.log('获取聊天列表', req.query.username);
  const sql =
    "select distinct b.adminname as answername ,b.id,b.avatar as avatar  from chat a join admin b on a.answerid=b.id where senderid =? group by answerid";
  db.query(sql, req.query.senderid, (err, result) => {
    const data = result;
    const total = result.length;
    if (result.length > 0) {
      res.send({
        status: 200,
        data: data,
        total: total,
      });
    }
  });
});
//管理员获取聊天列表
router.get("/admingetchatlist", (req, res) => {
  // console.log('获取聊天列表', req.query.username);
  const sql =
    "select distinct b.username as sendname ,b.id,b.avatar as avatar from chat  a join user b on a.senderid= b.id  COLLATE utf8mb4_unicode_ci where answerid = ? group by senderid";
  db.query(sql, req.query.senderid, (err, result) => {
    const data = result;
    if (result.length > 0) {
      res.send({
        status: 200,
        data: data,
      });
    }
  });
});
//获取聊天记录(已改)
router.get("/getchat", (req, res) => {
  console.log("获取聊天记录", req.query);
  const sql =
    "select * from chat where (senderid = ? and answerid = ?) or(senderid = ? and answerid = ?) order by sendtime asc";
  db.query(
    sql,
    [
      req.query.senderid,
      req.query.answerid,
      req.query.answerid,
      req.query.senderid,
    ],
    (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    }
  );
});

//获取管理员id
router.get("/getadminid", (req, res) => {
  // console.log('获取管理员id', req.query);
  const sql = "select id from admin where adminname = ?";
  db.query(sql, req.query.adminname, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//发送聊天
router.post("/sendchat", (req, res) => {
  const chat = req.body;
  console.log(chat, "添加聊天");
  const sql = "insert into chat set ?";
  db.query(sql, chat, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});

//获取未读信息
router.get("/getchatno", (req, res) => {
  const sql =
    "select senderid, count(*) total from chat where answerid = ? and status = 0  group by senderid order by senderid";
  db.query(sql, req.query.senderid, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取未读信息总数
router.get("/getchatnototal", (req, res) => {
  const sql =
    "select senderid, count(*) total from chat where answerid = ? and status = 0 ";
  db.query(sql, req.query.senderid, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//设置信息已读
router.post("/setchathave", (req, res) => {
  console.log("设置信息已读 ", req.body);
  const sql = "update  chat set status=1 where answerid = ? and senderid = ?";
  db.query(sql, [req.body.answerid, req.body.senderid], (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "修改成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "修改失败",
      });
    }
  });
});
//获取聊天里最后一条信息
router.get("/getlastchat", (req, res) => {
  // console.log('获取聊天里最后一条信息', req.query);
  const sql =
    "SELECT answerid, content,sendtime FROM (SELECT answerid ,content ,sendtime FROM chat WHERE (senderid = ?) AND (answerid <> ?) UNION SELECT senderid ,content,sendtime FROM chat WHERE  (senderid <> ?) AND (answerid = ?) ORDER BY sendtime DESC) as newTable GROUP BY answerid ORDER BY sendtime DESC ";
  db.query(
    sql,
    [
      req.query.senderid,
      req.query.senderid,
      req.query.senderid,
      req.query.senderid,
    ],
    (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    }
  );
});

//用户获取聊天背景
router.get("/getuserbg", (req, res) => {
  // console.log('用户获取聊天背景', req.query);
  const sql =
    "select bgurl from userbg where userid= ? order by id desc limit 1 ";
  db.query(sql, req.query.userid, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result[0],
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//用户更改聊天背景
router.post("/edituserbg", (req, res) => {
  console.log("用户更改聊天背景", req.body);
  const sql = "insert into userbg set ?  ";
  db.query(sql, req.body, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});

//管理员获取聊天背景
router.get("/getadminbg", (req, res) => {
  console.log("管理员获取聊天背景", req.query);
  const sql =
    "select bgurl from adminbg where adminid= ? order by id desc limit 1 ";
  db.query(sql, req.query.adminid, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result[0],
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//管理员更改聊天背景
router.post("/editadminbg", (req, res) => {
  console.log("管理员更改聊天背景", req.body);
  const sql = "insert into adminbg set ?  ";
  db.query(sql, req.body, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});

//删除问卷
router.post("/deletequestion", (req, res) => {
  console.log(req.body, "删除问卷");
  const sql = "delete from  question where questionid = ?";
  db.query(sql, req.body.questionid, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    }
  });
});

///新增

/**
 * 分页管理员列表：获取分页 {total:'',arr:[{},{},{}],pagesize:8,}
 */
router.get("/adminlist", (req, res) => {
  const page = req.query.page || 1;
  // console.log('用户', page);
  const sqlStr = "select * from admin";
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const n = (page - 1) * 8;
    const sql = `select * from admin order by id desc limit 8 offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: 8,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});

//管理员搜索查询
router.get("/adminsearch", (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search;
  console.log("管理员搜索查询", search);
  const sqlStr = `select * from admin where  adminname like '%${search}%' or sex like '%${search}%'`;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 8;
    const n = (page - 1) * pagesize;
    const sql = `select * from admin where  adminname like '%${search}%' or sex like '%${search}%' order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});

// 删除管理员
router.get("/deleteadmin", (req, res) => {
  const id = req.query.id;
  const sql = "delete from admin where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//更改管理员信息
router.post("/editadmin", (req, res) => {
  const { id, adminname, password, email, sex, age, avatar, type } = req.body;
  console.log("gggg", req.body);
  //id<>?排除当前要更新的id
  const sqlStr = "select * from admin where id<>? and adminname=?";
  db.query(sqlStr, [id, adminname], (err, result) => {
    if (err) {
      return res.send({ message: err.message });
    }
    if (result.length > 0) {
      return res.send({ status: 304, message: "管理员账户被占用" });
    }
    const sql =
      "update admin set type=? ,adminname=?,password=?, email=?, sex=?, age=?,  avatar=? where id=?";
    const arr = [type, adminname, password, email, sex, age, avatar, id];
    db.query(sql, arr, (err, result) => {
      if (err) {
        return res.send({ status: 500, message: err.message });
      }
      if (result.affectedRows > 0 && result.changedRows > 0) {
        return res.send({ status: 200, message: " 编辑成功" });
      }
      if (result.affectedRows > 0 && result.changedRows === 0) {
        return res.send({ status: 520, message: " 未进行任意修改" });
      }
    });
  });
});
/**
 * 管理员注册接口 /register
 */
router.post("/adminregister", (req, res) => {
  const admin = req.body;
  console.log("注册", req.body);
  const sqlStr = "select * from admin where adminname = ?";
  db.query(sqlStr, admin.adminname, (err, result) => {
    if (err) {
      return res.send({ message: err.message });
    }
    if (result.length > 0) {
      return res.send({ status: 304, message: "管理员账户被占用" });
    }
    const sql = "insert into admin set ?";
    db.query(sql, admin, (err, result) => {
      if (err) {
        return res.send({ status: 500, message: err.message });
      }
      if (result.affectedRows > 0) {
        return res.send({ status: 200, message: "注册成功" });
      }
    });
  });
});

//增加视频播放量
router.post("/addvideoview", (req, res) => {
  console.log(req.body);
  const sql = "update video set ? where id =?";
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: " 成功" });
    } else {
      return res.send({ status: 500, message: " 失败" });
    }
  });
});
//发送弹幕
router.post("/senddanmu", (req, res) => {
  console.log("发送弹幕", req.body);
  const sql = "insert into danmu set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "发送成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "发送失败",
      });
    }
  });
});
//获取弹幕
router.get("/getdanmu", (req, res) => {
  const sql = "select * from danmu where videoid =?";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//获取别人评论我的
router.get("/getcommentmy", (req, res) => {
  const sql =
    "select a.*,b.username,b.avatar from articlecomment a join user b on a.senderid=b.id where a.answerid=?";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});

//用户获取留言回复
router.get("/getmessagemy", (req, res) => {
  const sql =
    "select a.*,b.avatar,b.adminname as answerame ,c.username  from message a left join admin b on a.senderid=b.id left join user c on a.answerid=c.id where a.answerid=?";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//搜索视频
router.get("/searchvideo", (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search;
  console.log(search, "搜索");
  const sqlStr = `select a.* ,count(b.id) as danmutotal from video a left join danmu b on a.id=b.videoid  where a.title like '%${search}%' `;
  db.query(sqlStr, null, (err, result) => {
    const total = result.length;
    const pagesize = 1000;
    const n = (page - 1) * pagesize;
    const sql = `select a.* ,count(b.id) as danmutotal from video a left join danmu b on a.id=b.videoid  where a.title like '%${search}%' group by a.id order by a.id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      // console.log('结果', result.length);
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//用户修改密码
router.post("/edituserpass", (req, res) => {
  const user = req.body;
  console.log("", req.body);
  const sqlStr = "select password from user where id= ? ";
  db.query(sqlStr, user.id, (err, result) => {
    if (result[0].password !== user.pass) {
      return res.send({ status: 304, message: "原密码错误" });
    }
    if (result[0].password === user.password) {
      return res.send({ status: 305, message: "新密码不能和原密码一样哦" });
    }
    const sql = "update user set password = ? where id = ?";
    db.query(sql, [req.body.password, req.body.id], (err, result) => {
      console.log(result);
      if (result.affectedRows > 0) {
        return res.send({ status: 200, message: "修改成功" });
      }
      if (err) {
        return res.send({ status: 500, message: err.message });
      }
    });
  });
});
//用户修改头像
router.post("/edituseravatar", (req, res) => {
  console.log("", req.body);
  const sql = "update user set avatar = ? where id = ?";
  db.query(sql, [req.body.avatar, req.body.id], (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: "修改成功" });
    }
    if (err) {
      return res.send({ status: 500, message: err.message });
    }
  });
});
//新增备忘
router.post("/addmemo", (req, res) => {
  var sql = "insert into memo set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "发送成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "发送失败",
      });
    }
  });
});
//获取备忘列表
router.get("/getmemo", (req, res) => {
  const sql = "select * from memo where userid =? order by id desc";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//根据id获取备忘列表
router.get("/getmemoid", (req, res) => {
  console.log(req.query.id, "根据id获取备忘列表");
  const sql = "select * from memo where id =?";
  db.query(sql, req.query.id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//删除备忘
router.get("/delmemo", (req, res) => {
  const id = req.query.arr;
  console.log(id, "删除备忘");
  const sql = `delete from memo where id in (${id})`;
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//修改备忘
router.post("/editmemo", (req, res) => {
  const id = req.body.id;
  const sql = "update memo set ? where id =?";
  db.query(sql, [req.body, id], (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "修改成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "修改失败",
      });
    }
  });
});
//搜索备忘录
router.get("/searchmemo", (req, res) => {
  const search = req.query.search;
  const id = req.query.userid;
  console.log("结果", req.query);
  const sql = `select * from memo where concat (date,content,title) like '%${search}%' and userid = ${id} order by id desc`;
  db.query(sql, null, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});

//添加精美句子
router.post("/addword", (req, res) => {
  console.log("添加句子", req.body);
  const article = req.body;
  console.log(article);
  const sql = "insert into word set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//获取精美句子
router.get("/getword", (req, res) => {
  const page = req.query.page || 1;
  const sqlstr = `select * from word `;
  db.query(sqlstr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select * from word order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});

//添加签到记录
router.post("/addqiandao", (req, res) => {
  console.log("添加qiandao", req.body);
  const sql = "insert into qiandao set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//获取签到记录
router.get("/getqiandao", (req, res) => {
  const time = req.query.time;
  const sql = "select * from qiandao where time = ?";
  db.query(sql, time, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        isqiandao: true,
      });
    } else {
      res.send({
        status: 500,
        isqiandao: false,
      });
    }
  });
});
//添加抽奖记录
router.post("/addchoujiang", (req, res) => {
  console.log("添加qiandao", req.body);
  const sql = "insert into choujiang set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});

//获取全部抽奖记录
router.get("/getchoujiang", (req, res) => {
  const page = req.query.page || 1;
  const sqlstr = `select * from choujiang `;
  db.query(sqlstr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select * from choujiang order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//获取分组抽奖记录
router.get("/getchoujianggroup", (req, res) => {
  const time = req.query.time;
  const sql =
    "select distinct name,id,level,count(name)  as total from choujiang group by name order by level desc,total desc";
  db.query(sql, time, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        isqiandao: true,
      });
    } else {
      res.send({
        status: 500,
        isqiandao: false,
      });
    }
  });
});
//获取积分
router.get("/getjifen", (req, res) => {
  const time = req.query.time;
  const sql = "select total from jifen where id = 1";
  db.query(sql, time, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        isqiandao: true,
      });
    } else {
      res.send({
        status: 500,
        isqiandao: false,
      });
    }
  });
});
//修改积分
router.post("/editjifen", (req, res) => {
  console.log(req.body);
  const sql = "update jifen set ? where id =1";
  db.query(sql, req.body, (err, result) => {
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: " 成功" });
    } else {
      return res.send({ status: 500, message: " 失败" });
    }
  });
});
//添加每日抽奖次数
router.post("/addchoujiangcishu", (req, res) => {
  console.log("添加qiandao", req.body);
  const sql = "insert into choujiangcishu set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//获取每日抽奖次数
router.get("/getchoujiangcishu", (req, res) => {
  const time = req.query.time;
  const sql = "select * from choujiangcishu where time = ?";
  db.query(sql, time, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        ishave: true,
      });
    } else {
      res.send({
        status: 500,
        ishave: false,
      });
    }
  });
});
//修改每日抽奖次数
router.post("/editchoujiangcishu", (req, res) => {
  console.log(req.body);
  const sql = "update choujiangcishu set ? where time=?";
  db.query(sql, [req.body, req.body.time], (err, result) => {
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: " 成功" });
    } else {
      return res.send({ status: 500, message: " 失败" });
    }
  });
});

//获取积分记录
router.get("/getjifenjilu", (req, res) => {
  const page = req.query.page || 1;
  const sqlstr = `select * from jifenjilu `;
  db.query(sqlstr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select * from jifenjilu order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//添加积分记录
router.post("/addjifenjilu", (req, res) => {
  console.log("添加积分记录", req.body);
  const sql = "insert into jifenjilu set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});

//获取说说
router.get("/getdiandiandidi", (req, res) => {
  const page = req.query.page || 1;
  const sqlstr = `select * from diandiandidi `;
  db.query(sqlstr, null, (err, result) => {
    const total = result.length;
    const pagesize = 10;
    const n = (page - 1) * pagesize;
    const sql = `select * from diandiandidi order by id desc limit ${pagesize} offset ${n} `;
    db.query(sql, null, (err, result) => {
      if (result.length > 0) {
        res.send({
          status: 200,
          data: result,
          pageSize: pagesize,
          total: total,
        });
      } else {
        res.send({
          status: 500,
          msg: "暂无数据",
        });
      }
    });
  });
});
//根据d获取说说
router.get("/getdiandiandidiid", (req, res) => {
  const id = req.query.id;
  const sql = "select * from  diandiandidi where id=? ";
  db.query(sql, id, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        pageSize: pagesize,
        total: total,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//添加说说
router.post("/adddiandiandidi", (req, res) => {
  console.log("添加积分记录", req.body);
  const sql = "insert into diandiandidi set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});
//删除说说
router.get("/deldiandiandidi", (req, res) => {
  const id = req.query.id;
  const sql = "delete from diandiandidi where id=?";
  db.query(sql, id, (err, result) => {
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "删除成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "删除失败",
      });
    }
  });
});
//修改说说
router.post("/editdiandiandidi", (req, res) => {
  console.log(req.body);
  const sql = "update diandiandidi set ? where id=?";
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: " 成功" });
    } else {
      return res.send({ status: 500, message: " 失败" });
    }
  });
});

//二维码登录

//向服务器发送二维码信息
router.post("/sendcodelogin", (req, res) => {
  console.log("向服务器发送二维码信息", req.body);
  const sql = "insert into codelogin set ?";
  db.query(sql, req.body, (err, result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({
        status: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        status: 500,
        msg: "添加失败",
      });
    }
  });
});

//获取二维码状态
router.get("/getcodelogin", (req, res) => {
  const uuid = req.query.uuid;
  // console.log(req.query.uuid, "获取二维码状态");
  const sql = "select * from  codelogin where uuid=? ";
  db.query(sql, uuid, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//刷新二维码的时候，使之前的使用二维码失效
router.post("/updatecodeloginall", (req, res) => {
  // console.log(req.body);
  const sql = "update codelogin set status=4";
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (result.affectedRows > 0) {
      return res.send({ status: 200, message: " 成功" });
    } else {
      return res.send({ status: 500, message: " 失败" });
    }
  });
});
//登录成功获取登录信息
router.get("/getcodeuser", (req, res) => {
  const id = req.query.id;
  console.log("登录成功获取登录信息", id);
  const sql = "select * from user where id=?";
  db.query(sql, id, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
//登录成功获取登录信息
router.get("/getcodeadmin", (req, res) => {
  const adminname = req.query.adminname;
  console.log("登录成功获取登录信息", adminname);
  const sql = "select * from admin where adminname=?";
  db.query(sql, adminname, (err, result) => {
    // console.log('结果', result.length);
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
        total: result.length,
      });
    } else {
      res.send({
        status: 500,
        msg: "暂无数据",
      });
    }
  });
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};

var uploadFolder = "./upload/";
createFolder(uploadFolder);
var upload = multer({
  storage: storage,
});

router.post("/upload", upload.single("file"), function (req, res, next) {
  var file = req.file;
  console.log("文件类型：%s", file.mimetype);
  console.log("原始文件名：%s", file.originalname);
  console.log("文件大小：%s", file.size);
  console.log("文件保存路径：%s", file.path);
  res.json({
    res_code: "0",
    name: file.originalname,
    url: file.path,
  });
});

module.exports = router;
