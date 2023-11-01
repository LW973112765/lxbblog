<template>
  <div class="main">
    <canvas id="mycanvas" style="display: none"></canvas>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-height="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="描述" prop="title">
        <el-input
          type="text"
          v-model="ruleForm.title"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="视频" prop="video">
        <VideoUpload @geturl="geturl" />
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
import VideoUpload from "../../components/VideoUpload/video-upload.vue";
import base from "../../api/base";
import moment from "moment";
export default {
  components: { VideoUpload },
  name: "AddPhoto",
  data() {
    return {
      url: base.uploadUrl,
      baseurl: "",
      //   videoUrl: "",
      ruleForm: {
        title: "",
        video: "",
        duration: "",
        cover: "",
      },
      rules: {
        title: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 2 到 30个字符", trigger: "blur" },
        ],
        video: [{ required: true, message: "请上传视频", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.baseurl = base.host;
  },
  methods: {
    //通过自定义事件获取上传的视频的地址
    geturl(val, zxl) {
      // console.log(val, zxl, "//通过自定义事件获取上传的视频的地址");
      this.ruleForm.video = val;
      this.ruleForm.duration = moment(zxl * 1000).format("mm:ss");
      // console.log(
      //   this.ruleForm.duration,
      //   "//通过自定义事件获取上传的视频的地址"
      // );
      this.findcover(val);
    },

    findcover(url) {
      let video = document.createElement("video");
      video.style = "position:fixed; top: 9999px;left:9999px;z-index:-9999";
      video.preload = "metadata";
      video.currentTime = 3; //截取的视频第一秒作为图片
      video.src = url;
      video.setAttribute("crossOrigin", "anonymous");
      video.width = 113;
      video.height = 75;
      document.body.appendChild(video);
      var that = this;
      video.onloadeddata = function () {
        let canvas = document.createElement("canvas");
        canvas.width = 113;
        canvas.height = 75;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        that.ruleForm.cover = canvas.toDataURL("image/jpeg");
        console.log(this.ruleForm.cover);
      };
    },
    fanhui() {
      this.$router.push("/admin/home");
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$message("已提交");
          let { title, video, duration, cover } = this.ruleForm;
          this.$api
            .addVideo({
              title,
              video,
              duration,
              cover,
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$message({
                  message: "恭喜您，添加成功",
                  type: "success",
                });
                this.$refs.ruleForm.resetFields();
                this.$bus.$emit("deletevideo");
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
      this.$bus.$emit("deletevideo");
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ button[data-v-d1db1a32]:first-child {
  margin-left: 174px;
}
.main {
  padding-top: 50px;
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
</style>
