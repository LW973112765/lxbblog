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
      <el-form-item label="账户" prop="adminname">
        <el-input
          type="text"
          v-model="ruleForm.adminname"
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
      <el-form-item label="管理员权限" prop="type">
          <el-select
            style="width: 400px"
            v-model="ruleForm.type"
            placeholder="请选择"
          >
            <el-option
              label="超级管理员"
              :value="1"
            >
            </el-option>
            <el-option
              label="普通管理员"
              :value="2"
            >
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          type="email"
          v-model="ruleForm.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio text="radio" v-model="ruleForm.sex" label="男">男</el-radio>
        <el-radio text="radio" v-model="ruleForm.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="个人头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="url"
          :http-request="uploadImage"
          :show-file-list="false"
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
      qiniu: base.qiniu,
      baseurl: "",
      imageUrl: "",
      isShangchuan: true,
      ruleForm: {
        id: "",
        adminname: "",
        password: "",
        email: "",
        sex: "",
        age: "",
        avatar: "",
       type:''
      },
      rules: {
        adminname: [
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
    this.imageUrl = this.$route.query.avatar;
    this.ruleForm.avatar = this.imageUrl;
    console.log("挂载时this.ruleForm.avatar", this.ruleForm.avatar);
  },
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
          let {
            id,
            adminname,
            password,
            email,
            sex,
            age,
            avatar,
            type
          } = this.ruleForm;
          this.$api
            .editAdmin({
              id,
              adminname,
              password,
              email,
              sex,
              age,
              avatar,
              type
            })
            .then((res) => {
              // console.log("状态码", res.data.status);
              if (res.data.status === 200) {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                });
                this.$router.go(-1);
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
          this.$message.error("提交失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.imageUrl = "";
    },
    //qiniu
    uploadImage(content) {
      // 重命名要上传的文件
      const fileName = +new Date() + content.file.name;
      this.$axios("/api/api/get-qiniu-token")
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

          return this.$axios({
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
          this.ruleForm.avatar = this.imageUrl;
        });
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
  padding-top: 60px;
  padding-right: 30px;
  padding-bottom: 30px;
  width: 583px;
  min-height: 500px;
  margin: 0 auto;
  //   background-color: rgba(0, 0, 0, 0.5);
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