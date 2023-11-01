<template>
  <div class="login">
    <h3 class="title">后台登录界面</h3>
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="60px"
      class="demo-loginForm"
    >
      <el-form-item label="账号" prop="adminname">
        <el-input
          type="text"
          v-model="loginForm.adminname"
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
        <el-button type="info" @click="$router.push('/')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import jwt from "jwt-decode";
import { mapMutations } from "vuex";
import moment from "moment";
export default {
  name: "AdminLogin",
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
      bodyImg: "url(" + require("../../assets/img/adminloginbg.jpg") + ")",
      loginForm: {
        adminname: "",
        password: "",
      },
      rules: {
        adminname: [{ validator: validateLname, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  //设置背景图片
  mounted() {
    document.body.style.backgroundImage = this.bodyImg;
    document.body.style.backgroundSize = "100%";
  },
  beforeMount() {
    document.body.style.backgroundImage = "";
  },
  // beforeDestroy() {
  //   this.$bus.$off("zxl");
  // },
  methods: {
    ...mapMutations("AdminLogin", ["setAdmin"]),
    ...mapMutations("AdminLoginAddress", ["setAddress"]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("校验通过", this.loginForm);
          let { adminname, password } = this.loginForm;
          // 请求登录接口
          this.$api
            .getAdminLogin({
              adminname,
              password,
            })
            .then((res) => {
              console.log("解析前", res.data);
              if (res.data.status === 200) {
                console.log("解析后", jwt(res.data.data));
                //登录成功后：1. 存储登录信息；  2. 跳转网页； 3. 顶部区域显示用户信息； 4. 持久化；
                axios.get("https://api.vvhan.com/api/getIpInfo").then((res) => {
                  console.log(
                    "地址",
                    res.data,
                    res.data.info.prov,
                    res.data.info.city
                  );
                  let zxl = {
                    prov: res.data.info.prov,
                    city: res.data.info.city,
                    time: moment().format("YYYY-MM-DD HH:mm:ss"),
                  };
                  this.setAddress(zxl);
                  localStorage.setItem("lwandzxladdress", JSON.stringify(zxl));
                });
                let obj = {
                  adminname: jwt(res.data.data).adminname,
                  token: res.data.data,
                  avatar: res.data.avatar,
                  email: res.data.email,
                  id: res.data.id,
                  type: res.data.type,
                };
                console.log("obj", obj);
                this.setAdmin(obj);
                //存储本地
                localStorage.setItem("lwandzxl", JSON.stringify(obj));
                //跳转
                this.$router.push("/admin/home");
                this.$message({
                  message: "恭喜您，登录成功😊",
                  type: "success",
                });
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
.title {
  margin-bottom: 30px;
  text-align: center;
  color: #666;
}
/deep/ .el-button {
  margin-left: 40px;
}
</style>
