<template>
  <div class="main">
    <div class="change">
      <button class="hhh" @click="changestatus">
        <span v-if="!ischange">切换到手动上传</span>
        <span v-if="ischange">切换到链接上传</span>
      </button>
    </div>

    <!-- //手动上传 -->
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-height="100px"
      class="demo-ruleForm"
      v-if="ischange"
    >
      <el-form-item label="音乐名" prop="title">
        <el-input
          disabled
          placeholder="上传音乐后会自动读取音乐名"
          type="text"
          v-model="ruleForm.title"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="歌词" prop="lrc">
        <el-input
          type="textarea"
          resize="none"
          maxlength="10000"
          placeholder="请粘贴歌词到此"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 6 }"
          v-model="ruleForm.lrc"
        ></el-input>
      </el-form-item>
      <el-form-item label="歌手" prop="artist">
        <el-input
          type="text"
          v-model="ruleForm.artist"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="pic">
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
            title="点击上传图片"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="音乐" prop="src">
        <musicUpload @geturl="geturl" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button type="primary" plain @click="fanhui">返回</el-button>
      </el-form-item>
    </el-form>
    <!-- //链接上传 -->
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-height="100px"
      class="demo-ruleForm"
      v-if="!ischange"
    >
      <el-form-item label="音乐名" prop="title">
        <el-input
          type="text"
          v-model="ruleForm.title"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="歌词" prop="lrc">
        <el-input
          type="textarea"
          resize="none"
          maxlength="10000"
          placeholder="请粘贴歌词到此"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 6 }"
          v-model="ruleForm.lrc"
        ></el-input>
      </el-form-item>
      <el-form-item label="歌手" prop="artist">
        <el-input
          type="text"
          v-model="ruleForm.artist"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="pic">
        <el-input
          type="text"
          v-model="ruleForm.pic"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="音乐" prop="src">
        <el-input
          type="text"
          v-model="ruleForm.src"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button type="primary" plain @click="fanhui">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import musicUpload from "../../components/MusicUpload/music-upload.vue";
import base from "../../api/base";
import axios from "axios";
import moment from "moment";
export default {
  components: { musicUpload },
  name: "AddPhoto",
  data() {
    return {
      ischange: true,
      url: base.uploadUrl,
      qiniu: base.qiniu,
      baseurl: "",
      imageUrl: "",
      ruleForm: {
        title: "",
        src: "",
        pic: "",
        artist: "",
        lrc: "",
        duration: "",
      },
      rules: {
        title: [{ required: true, message: "请输入音乐名", trigger: "blur" }],
        src: [{ required: true, message: "请上传音乐", trigger: "blur" }],
        // pic: [{ required: true, message: "请上传封面", trigger: "blur" }],
        artist: [{ required: true, message: "请输入歌手名", trigger: "blur" }],
        // lrc: [{ required: true, message: "请输入歌词", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.baseurl = base.host;
  },
  methods: {
    changestatus() {
      this.ischange = !this.ischange;
      this.$refs.ruleForm.resetFields();
    },
    //通过自定义事件获取上传的音乐的地址
    geturl(val, name) {
      this.ruleForm.src = val;
      this.ruleForm.title = name.substring(0, name.length - 4);
    },
    fanhui() {
      this.$router.push("/admin/home");
    },
    submitForm() {
      console.log(typeof this.ruleForm.lrc, "88888");
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$message("已提交");
          let time = moment().format("YYYY-MM-DD HH:mm:ss");
          let lrc = this.ruleForm.lrc.replace(/\\n/g, "");
          var audioElement = new Audio(this.ruleForm.src);
          var duration;
          var that = this;
          audioElement.addEventListener("loadedmetadata", function (_event) {
            duration = audioElement.duration;
            let { title, src, artist, pic } = that.ruleForm;
            that.$api
              .addMusic({
                title,
                src,
                artist,
                lrc,
                pic,
                time,
                duration,
              })
              .then((res) => {
                if (res.data.status === 200) {
                  that.$message({
                    message: "恭喜您，添加成功",
                    type: "success",
                  });
                  that.$refs.ruleForm.resetFields();
                  that.imageUrl = "";
                  that.$bus.$emit("deletemusic");
                }
              });
          });
        } else {
          this.$message.error("提交失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$bus.$emit("deletemusic");
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
          this.ruleForm.pic = this.imageUrl;
        });
    },
    // 上传图片成功

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
/deep/ button[data-v-464a1227]:first-child {
  margin-left: 174px;
}
.main {
  padding-top: 5px;
  padding-left: 15px;
  padding-right: 30px;
  width: 70%;
  min-height: 500px;
  margin: 30px auto;
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
/deep/ .el-button {
  margin-left: 80px;
}
/deep/ .el-form-item {
  margin-top: 30px;
}
.change {
  width: 100px;
  height: 30px;
  position: fixed;
  top: 60px;
  left: 230px;
  cursor: pointer;

  .hhh {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-50%);
    cursor: pointer;
    width: 100px;
    height: 30px;
    outline: 1px solid #fff;
    display: block;
    background: -webkit-linear-gradient(left, aqua, red);
    z-index: 1;
    border-radius: 10px;
    overflow: hidden;
    color: #fff;
  }

  .hhh::before {
    content: "";
    position: absolute;
    cursor: pointer;
    width: 200%;
    height: 200%;
    background: blue;
    z-index: -2;
    animation: rotate 3s linear infinite;
    left: 50%;
    top: 50%;
    transform-origin: 0 0;
  }

  .hhh::after {
    content: "";
    cursor: pointer;
    position: absolute;
    background: #37acc9;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    left: 2px;
    top: 2px;
    z-index: -1;
    border-radius: 10px;
  }
}
</style>
