<template>
  <div>
    <!-- //登录界面 -->
    <div class="login" v-if="islogin">
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
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <footer>
        <span class="zhuce" @click="register">没有账户？去注册</span>
        <span class="youke" @click="zhuye">我是游客</span>
        <span class="zhaohui" @click="zhaohui">忘记密码？</span>
      </footer>
    </div>
    <!-- //找回密码 -->
    <div class="zhaohuipwd" v-if="!islogin">
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
  </div>
</template>

<script>
import jwt from "jwt-decode";
import { mapMutations } from "vuex";
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
</style>
