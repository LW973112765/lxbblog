<template>
  <div class="form">
    <h3 class="title">注册界面</h3>
    <el-form
      :model="registerForm"
      status-icon
      :rules="rules"
      ref="registerForm"
      label-width="60px"
      class="demo-registerForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          type="text"
          v-model="registerForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="registerForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          type="email"
          v-model="registerForm.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <div class="code_input">
          <el-input v-model="registerForm.code" :disabled="disabled"></el-input>
          <el-button size="mini" @click="send" :disabled="!disabled">{{
            sendmsg
          }}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :http-request="uploadImage"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registerForm')"
          >注册</el-button
        >
        <el-button @click="resetForm('registerForm')">重置</el-button>

        <span class="zhuce" @click="register">已有账户？去登录</span>
        <span class="youke" @click="zhuye">我是游客</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import base from "../../../api/base";
export default {
  name: "Register",
  data() {
    var validateLname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("账户不能为空😊"));
      } else if (value.length > 20) {
        callback(new Error("用户名不能太长😊"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空😊"));
      } else {
        callback();
      }
    };
    return {
      sendmsg: "发送验证码",
      disabled: true,
      code: "",
      bodyImg: "url(" + require("../../../assets/img/loginbg.jpg") + ")",
      url: base.uploadUrl,
      qiniu: base.qiniu,
      baseurl: "",
      imageUrl: "",
      registerForm: {
        username: "",
        password: "",
        email: "",
        avatar: "/upload/1.png",
        code: "",
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
    this.baseurl = base.host;
  },
  beforeMount() {
    document.body.style.backgroundImage = "";
  },
  methods: {
    //获取邮箱验证码
    send() {
      if (!this.registerForm.email) {
        this.$message({
          showClose: true,
          message: "请填写邮箱后获取验证码！",
          type: "warning",
        });
      } else if (
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
          this.registerForm.email
        ) == false
      ) {
        this.$message({
          showClose: true,
          message: "请填写正确的邮箱后获取验证码！",
          type: "warning",
        });
      } else {
        this.$message({
          showClose: true,
          message: "验证码已发送，请注意接收！",
          type: "success",
        });
        this.$api.getCode({ email: this.registerForm.email }).then((res) => {
          if (res.data.status == 200) {
            // console.log(res.data.data, "验证码");
            this.code = res.data.data;
            this.disabled = false;
            this.disabledsend = true;
            let timer = 60;
            this.sendmsg = timer + "s";
            this.timeFun = setInterval(() => {
              --timer;
              this.sendmsg = timer + "s";
              if (timer == 0) {
                this.disabled = true;
                this.disabledsend = false;
                this.sendmsg = "重新发送";
                clearInterval(this.timeFun);
              }
            }, 1000);
          }
        });
      }
    },

    //游客身份跳转主页
    zhuye() {
      this.$router.push("/");
    },
    register() {
      this.$router.push("/login");
    },
    //qiniu
    uploadImage(content) {
      // 重命名要上传的文件
      const fileName = +new Date() + content.file.name;
      axios("/api/api/get-qiniu-token")
        .then((res) => {
          // 从后端获取上传凭证token
          const formData = new FormData();
          formData.append("file", content.file);
          formData.append("token", res.data.token);
          formData.append("key", fileName);
          /*
           * 另外一种常见的媒体格式是上传文件之时使用的：
           * multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式
           * */
          // 获取到凭证之后再将文件上传到七牛云空间

          return axios({
            url: this.url,
            method: "POST",
            data: formData,
          });
        })
        .then((res) => {
          const imageUrl = this.qiniu + "/" + res.data.key;
          this.imageUrl = imageUrl;
          // console.log("更新头像成功", this.imageUrl);
          this.$message.success("上传成功");
          this.registerForm.avatar = this.imageUrl;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("校验通过", this.registerForm);
          let { username, password, email, avatar } = this.registerForm;
          let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
          // 请求登录接口

          if (this.registerForm.code != this.code) {
            this.$message({
              showClose: true,
              message: "验证码错误！",
              type: "warning",
            });
          } else {
            this.$api
              .getRegister({
                username,
                password,
                email,
                created_at,
                avatar,
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$router.push("/login");
                  this.$message({
                    message: "恭喜您，注册成功，请登录😊",
                    type: "success",
                  });
                  //把注册成功的账户和密码存在localStorage里，方便传到登录界面去
                  let obj = {
                    username: this.registerForm.username,
                    password: this.registerForm.password,
                  };
                  localStorage.setItem("register", JSON.stringify(obj));
                } else if (res.data.status === 304) {
                  this.$message({
                    message: "警告哦，该账户已经存在,换一个名字吧😊",
                    type: "warning",
                  });
                  this.username = "";
                }
              });
          }
        } else {
          console.log("error submit!!");
          this.$message.error("注册失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt3M = file.size / 1024 / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!😊");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!😊");
      }
      return isJPG && isLt3M;
    },
  },
};
</script>

<style lang="less" scoped>
.youke {
  position: absolute;
  bottom: 1px;
  right: 6px;
  font-size: 16px;
  cursor: pointer;
  color: red;
}
.youke:hover {
  text-decoration: underline;
  color: aqua;
}
.form {
  width: 450px;
  height: 560px;
  padding: 20px;
  margin: 0 auto;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: -webkit-linear-gradient(left, aqua, #999999);
  position: relative;
}
.title {
  margin-bottom: 30px;
  text-align: center;
  color: #666;
}
.zhuce {
  margin-left: 15px;
  font-size: 16px;
  color: blueviolet;
  cursor: pointer;
}
.zhuce:hover {
  text-decoration: underline;
  color: brown;
}
.avatar-uploader .el-upload {
  margin-left: 5px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff !important;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  background-color: white;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
