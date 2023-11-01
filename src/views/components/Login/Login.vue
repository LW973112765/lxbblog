<template>
  <div>
    <!-- //登录界面 -->
    <div class="login" v-if="islogin && !issaoma">
      <h3 class="title">登录界面</h3>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="60px"
        class="demo-loginForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item style="display: flex; justify-content: space-between">
          <el-button type="primary" @click="submitForm('loginForm')"
            >密码登录</el-button
          >
          <el-button type="primary" @click="saoma">狼小宝APP扫码登录</el-button>
          <el-button @click="resetForm('loginForm')">重置输入</el-button>
        </el-form-item>
      </el-form>
      <footer>
        <span class="zhuce" @click="register">没有账户？去注册</span>
        <span class="youke" @click="zhuye">我是游客</span>
        <span class="zhaohui" @click="zhaohui">忘记密码？</span>
      </footer>
    </div>
    <!-- //找回密码 -->
    <div class="zhaohuipwd" v-if="!islogin && !issaoma">
      <h3 class="title">找回密码</h3>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="60px"
        class="demo-loginForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
            placeholder="请输入您要找回的账户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            v-model="loginForm.email"
            autocomplete="off"
            placeholder="请输入您要找回账户的邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitzhaohui('loginForm')"
            >找回密码</el-button
          >
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <footer>
        <span class="zhuce" @click="register">没有账户？去注册</span>
        <span class="youke" @click="zhuye">我是游客</span>
        <span class="zhaohui" @click="tologin">返回登录</span>
      </footer>
    </div>
    <!-- 扫码登录 -->
    <div class="saoma" v-show="issaoma">
      <h2 style="text-align: center">请使用狼小宝APP扫码登录</h2>
      <h4 style="text-align: center; margin-top: 10px" v-show="status == 3">
        二维码已过期，请刷新
      </h4>
      <h4 style="text-align: center; margin-top: 10px" v-show="status == 1">
        扫码成功，请在APP确认登录
      </h4>
      <h4
        class="logining"
        style="text-align: center; margin-top: 10px"
        v-show="status == 2"
      >
        正在登录
      </h4>
      <div
        class="qrcode"
        ref="qrCodeUrl"
        @click="freshcode"
        v-show="status !== 1 && status !== 2"
      ></div>
      <div class="yisaoma" v-show="status == 1 || status == 2">
        <img src="../../../assets/img/codesuccess.png" alt="" />
      </div>
      <div class="fanhuimima" @click="fanhuimima">返回</div>
    </div>
  </div>
</template>

<script>
import jwt from "jwt-decode";
import { mapMutations } from "vuex";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcodejs2";
import moment from "moment";
export default {
  name: "Login",
  data() {
    var validateLname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账户😊"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码😊"));
      } else {
        callback();
      }
    };
    return {
      status: 0, // 0还未扫码 1已扫码 2 已确认登录 3已过期 4失效
      timer: "",
      uuid: "",
      issaoma: false,
      islogin: true,
      bodyImg: "url(" + require("../../../assets/img/loginbg.jpg") + ")",
      loginForm: {
        username: "",
        password: "",
        email: "",
      },
      rules: {
        username: [{ validator: validateLname, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱地址😊", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址😊",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  //设置背景图片
  mounted() {
    document.body.style.backgroundImage = this.bodyImg;
    document.body.style.backgroundSize = "100%";
    //注册成功后，跳转登录界面，通过读取localStorage里的数据，使得登录的账户，密码就是注册的账户，密码
    let register = localStorage.getItem("register");
    if (register) {
      register = JSON.parse(register);
      this.loginForm.username = register.username;
      this.loginForm.password = register.password;
    }
  },
  beforeMount() {
    document.body.style.backgroundImage = "";
  },
  beforeDestroy() {
    this.$bus.$off("zxl");
  },
  methods: {
    //获取唯一标识
    getuuid() {
      this.uuid = uuidv4();
    },
    //制作二维码
    makecode() {
      var code = document.querySelector(".qrcode");
      var img = document.createElement("img");
      // img.src = "../../../assets/img/waoku.jpg";
      // img.src = "http://lwandzxl.top/1683379616136mmexport1601864100866.jpg";
      img.src = "http://lwandzxl.top/1687785803780.jpg";
      img.id = "codeimg";
      img.style.position = "absolute";
      img.style.borderRadius = "10px";
      img.style.width = "60px";
      img.style.height = "60px";
      img.style.top = "50%";
      img.style.left = "50%";
      img.style.transform = "translate(-50%, -50%)";
      //将img插入到div
      code.appendChild(img);
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: JSON.stringify({
          uuid: this.uuid,
          token: this.uuid,
          type: "pclogin",
        }), // 需要转换为二维码的内容
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrcode._el.title = "狼小宝";
      this.sendcode();
      this.getcode();
    },
    //向服务器发送二维码信息
    sendcode() {
      this.$api
        .SendCodeLogin({
          uuid: this.uuid,
          status: 0,
          creattime: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .then((res) => {
          if (res.data.status == 200) {
            // console.log("成功");
          }
        });
    },
    //登录成功获取登录信息
    getcodeuser(id) {
      this.$api.GetCodeUser({ id }).then((res) => {
        if (res.data.status == 200) {
          console.log("登录成功获取登录信息", res.data.data[0]);
          let data = res.data.data[0];
          let obj = {
            username: data.username,
            token: data.id + this.uuid + data.username,
            avatar: data.avatar,
            email: data.email,
            age: data.age,
            sex: data.sex,
            id: data.id,
          };
          console.log("obj", obj);
          this.setUser(obj);
          localStorage.setItem("loginStatus", true);
          localStorage.setItem("username", JSON.stringify(obj));
          localStorage.removeItem("register");
          setTimeout(() => {
            this.$router.push("/home");
            this.$message({
              message: "恭喜您，登录成功😊",
              type: "success",
            });
          }, 3000);
        }
      });
    },
    //获取二维码状态
    getcode() {
      this.$api
        .GetCodeLogin({
          uuid: this.uuid,
        })
        .then((res) => {
          if (res.data.status == 200) {
            let codedata = res.data.data[0];
            // let codetime = +new Date(res.data.data[0].creattime);
            let codetime = moment(res.data.data[0].creattime).valueOf();
            let currenttime = moment().valueOf();
            // let currenttime = +new Date();
            let time = currenttime - codetime;
            clearInterval(this.timer);
            if (time >= 300000) {
              //二维码过期
              this.addchild();
              this.status = 3;
              console.log("二维码过期", this.status);
              clearInterval(this.timer);
            } else {
              //还未扫码
              if (codedata.status !== 2) {
                this.status = codedata.status;
                this.timer = setInterval(() => {
                  this.getcode();
                }, 200);
              }
              // else if (codedata.status == 1) {
              //   //扫码成功
              //   this.status = 1;
              //   clearInterval(this.timer);
              // }
              else {
                this.status = 2;
                this.getcodeuser(res.data.data[0].userid);
                clearInterval(this.timer);

                //确认登录成功
              }
            }
            // console.log("获取二维码状态", res.data.data[0]);
          }
        });
    },
    //加入刷新节点
    addchild() {
      var code = document.querySelector(".qrcode");
      var div = document.createElement("div");
      var img = document.createElement("img");
      div.id = "freshimg";
      div.style.zIndex = "10";
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.left = "0";
      div.style.bottom = "0";
      div.style.right = "0";
      div.style.backgroundColor = "#666";
      div.style.opacity = "0.5";
      img.src = "http://lwandzxl.top/fresh.png";
      img.id = "freshimg";
      img.style.position = "absolute";
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.top = "50%";
      img.style.left = "50%";
      img.style.transform = "translate(-50%, -50%)";
      code.appendChild(div);
      div.appendChild(img);
    },
    //刷新二维码的时候，使之前的使用二维码失效
    updatecode() {
      this.$api.UpdateCodeLoginAll();
    },
    fanhuimima() {
      this.issaoma = !this.issaoma;
      this.$refs.qrCodeUrl.innerHTML = "";
      this.status = 0;
    },
    freshcode() {
      this.updatecode();
      this.$refs.qrCodeUrl.innerHTML = "";
      this.getuuid();
      this.makecode();
      this.status = 0;
      var code = document.querySelector(".qrcode");
      var div = document.getElementById("freshdiv");
      var img = document.getElementById("freshimg");
      div.removeChild(img);
      code.removeChild(div);
    },
    saoma() {
      this.updatecode();
      this.issaoma = !this.issaoma;
      this.getuuid();
      this.makecode();
    },
    tologin() {
      this.islogin = !this.islogin;
    },
    zhaohui() {
      this.islogin = !this.islogin;
    },
    //游客身份跳转主页
    zhuye() {
      this.$router.push("/");
    },
    register() {
      this.$router.push("/register");
    },
    ...mapMutations("loginModule", ["setUser"]),
    //登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("校验通过", this.loginForm);
          let { username, password } = this.loginForm;
          // 请求登录接口
          this.$api
            .getLogin({
              username,
              password,
            })
            .then((res) => {
              console.log("解析前", res.data);
              if (res.data.status === 200) {
                console.log("解析后", jwt(res.data.data));
                //登录成功后：1. 存储登录信息  2. 跳转网页 3. 顶部区域显示用户信息  4. 持久化
                let obj = {
                  username: jwt(res.data.data).username,
                  token: res.data.data,
                  avatar: res.data.avatar,
                  email: res.data.email,
                  age: res.data.age,
                  sex: res.data.sex,
                  id: res.data.id,
                };
                console.log("obj", obj);
                this.setUser(obj);
                //存储本地
                localStorage.setItem("loginStatus", true);
                localStorage.setItem("username", JSON.stringify(obj));
                //跳转
                this.$router.push("/home");
                this.$message({
                  message: "恭喜您，登录成功😊",
                  type: "success",
                });
                //清除注册成功的用户数据
                localStorage.removeItem("register");
              } else {
                //账户或密码错误
                this.$message({
                  message: "警告哦，账户或密码错误😊",
                  type: "warning",
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //找回
    submitzhaohui(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("校验通过", this.loginForm);
          let { username, email } = this.loginForm;
          // 请求登录接口
          this.$api
            .getFindPass({
              username,
              email,
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$message({
                  message: "密码已发送到您的邮箱😊",
                  type: "success",
                });
                this.$api.sendFindPass({
                  username: this.loginForm.username,
                  email: this.loginForm.email,
                });
              } else {
                this.$message({
                  message: "警告哦，账户或邮箱错误😊",
                  type: "warning",
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 450px;
  height: 260px;
  padding: 20px;
  margin: 0 auto;
  margin-top: 180px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: -webkit-linear-gradient(top, pink, #999999);
  position: relative;
}
.zhaohuipwd {
  width: 450px;
  height: 260px;
  padding: 20px;
  margin: 0 auto;
  margin-top: 180px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: -webkit-linear-gradient(top, aqua, #999999);
  position: relative;
}
.saoma {
  width: 450px;
  height: 260px;
  padding: 20px;
  margin: 0 auto;
  margin-top: 180px;
  border-radius: 10px;
  border: 1px solid #eee;
  // background: -webkit-linear-gradient(top, yellow, #999999);
  background: -webkit-linear-gradient(top, hsl(332, 68%, 47%), pink, #333);
  position: relative;
}
.title {
  margin-bottom: 30px;
  text-align: center;
  color: #666;
}
.zhuce {
  // margin-left: 15px;
  font-size: 16px;
  color: aqua;
  cursor: pointer;
}
.zhuce:hover {
  text-decoration: underline;
  color: red;
}
.youke {
  // position: absolute;
  // bottom: 1px;
  // right: 6px;
  font-size: 16px;
  // margin-left: 10px;
  cursor: pointer;
  color: yellow;
}
.youke:hover {
  text-decoration: underline;
  color: blue;
}
.zhaohui {
  // margin-left: 15px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}
.zhaohui:hover {
  text-decoration: underline;
  color: #10a44a;
}
footer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.fanhuimima {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 20px;
  color: blue;
  cursor: pointer;
  &:hover {
    color: pink;
    text-decoration: underline;
  }
}
.qrcode {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.yisaoma {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.logining::after {
  content: "";
  animation: zxl 2s infinite;
}
@keyframes zxl {
  0% {
    content: "...";
  }
  25% {
    content: "";
  }
  50% {
    content: ".";
  }
  75% {
    content: "..";
  }
  100% {
    content: "...";
  }
}
</style>
