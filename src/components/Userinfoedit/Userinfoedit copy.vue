<template>
  <div class="main">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-height="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          type="text"
          v-model="ruleForm.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          type="email"
          v-model="ruleForm.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio text="radio" v-model="ruleForm.sex" label="男">男</el-radio>
        <el-radio text="radio" v-model="ruleForm.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduction">
        <el-input
          type="textarea"
          resize="none"
          maxlength="50"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 6 }"
          v-model="ruleForm.introduction"
        ></el-input>
      </el-form-item>
      <el-form-item label="个人头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
            title="点击更改头像"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" plain @click="fanhui">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import base from "../../api/base";
import moment from "moment";
export default {
  name: "Userinfoedit",
  data() {
    var checkAge = (rule, value, callback) => {
      setTimeout(() => {
        if (!Number(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 1 || value > 100) {
            callback(new Error("年龄格式错误"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      url: base.uploadUrl,
      baseurl: "",
      imageUrl: "",
      isShangchuan: true,
      ruleForm: {
        id: "",
        username: "",
        password: "",
        email: "",
        sex: "",
        age: "",
        avatar: "",
        nickname: "",
        introduction: "",
        // updated_at: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址😊", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址😊",
            trigger: ["blur", "change"],
          },
        ],
        age: [{ validator: checkAge, trigger: "blur" }],
      },
    };
  },
  mounted() {
    console.log(this.$route);
    this.baseurl = base.host;
    this.ruleForm = this.$route.query;
    // this.imageUrl = `http://localhost:8989/1.png`;
    this.imageUrl = this.$route.query.avatar;
    console.log("挂载时 this.imageUrl", this.imageUrl);

    this.ruleForm.avatar = this.imageUrl;

    // console.log(this.isShangchuan);
    console.log("挂载时this.ruleForm.avatar", this.ruleForm.avatar);

    // if (this.isShangchuan === true) {
    //   this.imageUrl = `http://localhost:8989${this.$route.query.avatar.slice(
    //     7
    //   )}`;
    //   this.ruleForm.avatar = this.imageUrl.slice(21);
    //   console.log("没有上传图片时 this.imageUrl", this.imageUrl);
    //   console.log("没有上传图片时this.ruleForm.avatar", this.ruleForm.avatar);
    // }
    // if (this.isShangchuan === false) {
    //   this.imageUrl = `http://localhost:8989${this.$route.query.avatar.slice(
    //     7
    //   )}`;
    //   this.ruleForm.avatar = this.imageUrl.slice(21);
    //   console.log("上传图片时 this.imageUrl", this.imageUrl);
    //   console.log("上传图片时this.ruleForm.avatar", this.ruleForm.avatar);
    // }
  },
  /*watch: {
    // immediate: true,
    ruleForm(val, oldval) {
      console.log("新", val);
      console.log("旧", oldval);
      console.log(val === oldval);
      if (val === oldval) {
        this.ruleForm.updated_at = new Date();
        console.log(this.ruleForm.updated_at);
      }
    },
  },*/
  // watch: {
  //   isShangchuan(val, oldval) {
  //     console.log("新", val);
  //     console.log("旧", oldval);
  //   },
  // },
  methods: {
    fanhui() {
      // this.$router.push("/usercenter");
      this.$router.go(-1);
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$message("已提交");
          // console.log(this.ruleForm);
          let updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
          let {
            id,
            username,
            password,
            email,
            sex,
            age,
            avatar,
            nickname,
            introduction,
            // updated_at,
          } = this.ruleForm;
          this.$api
            .editUser({
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
            })
            .then((res) => {
              // console.log("状态码", res.data.status);
              if (res.data.status === 200) {
                this.$message({
                  message: "恭喜您，编辑成功,请重新登录",
                  type: "success",
                });
                this.$router.push("/login");
                // let user = JSON.parse(localStorage.getItem("username"));
                // console.log("用户", user.username);
                // console.log("token", user.token);
                // console.log("hahaha", this.ruleForm.username);
                // let obj = {
                // username: this.ruleForm.username,
                // token: user.token,
                // };
                // localStorage.removeItem("username");
                // localStorage.setItem("username", JSON.stringify(obj));
                // location.reload();
                // this.$refs.ruleForm.resetFields();
              } else if (res.data.status === 304) {
                this.$message({
                  showClose: true,
                  message: "警告哦，该账号已存在😊",
                  type: "warning",
                });
              } else if (res.data.status === 520) {
                this.$message({
                  message: "您未进行任意更新操作😊",
                  type: "warning",
                });
              }
            });
        } else {
          // console.log("error submit!!");
          this.$message.error("提交失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.imageUrl = "";
    },
    // 上传图片成功
    handleAvatarSuccess(res, file, fileList) {
      console.log("上传成功了", res, file, fileList);
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file.raw.name, ".........", res.url);
      const imgurl = file.raw.name;
      console.log("imgurl", imgurl);
      this.$message({
        message: "恭喜你，图片上传成功成功",
        type: "success",
      });
      // this.ruleForm.pic = base.host + "/" + res.url.slice(7);
      // this.isShangchuan = false;
      // this.imageUrl = `http://localhost:8989${this.$route.query.avatar.slice(
      //   7
      // )}`;
      // this.imageUrl = `http://localhost:8989/${imgurl}`;
      this.imageUrl = `${base.host}/${res.url.slice(7)}`;
      console.log("this.imageUrl", this.imageUrl);
      this.ruleForm.avatar = this.baseurl + "/" + res.url.slice(7);
      console.log("图片地址", this.ruleForm.avatar);
      // console.log("图片地址", this.imageUrl);
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt3M = file.size / 1024 / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isJPG && isLt3M;
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding-top: 40px;
  padding-right: 30px;
  width: 583px;
  min-height: 500px;
  margin-top: 50px;
  margin-right: 30px;
  background-color: rgba(0, 0, 0, 0.5);
}
button:first-child {
  margin-left: 103px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
label {
  color: red;
}
/deep/ .el-form-item__label {
  color: aqua;
}
</style>