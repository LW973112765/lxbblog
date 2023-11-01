<template>
  <div>
    <div class="video-upload-com">
      <el-upload
        :action="uploadUrl"
        :before-upload="beforeAvatarUpload"
        :file-list="mediaList"
        :on-success="handleSuccess"
        :on-exceed="exceedTips"
        :limit="1"
        :on-remove="handleRemove"
      >
        <!-- <video :src="mediaurl" controls="controls"></video> -->
        <el-button size="mini" type="primary">点击上传视频</el-button>
        <p v-if="tips" slot="tip" class="el-upload__tip">{{ tips }}</p>
      </el-upload>
      <div v-if="mediaurl">
        <video
          :src="mediaurl"
          style="width: 320px; height: 200px"
          controls="controls"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import base from "../../api/base";
export default {
  name: "VideoUpload",
  componentName: "VideoUpload",
  data() {
    return {
      baseurl: "",
      mediaurl: "",
      mediaUrl: null,
      mediaList: [],
      uploadUrl: null,
      playTime: 0,
      videoSize: 0,
      videoWidth: 0,
      videoHeight: 0,
    };
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    tips: {
      type: String,
      default: "仅支持上传mp4或者MP4文件（限制50M以内）",
    },
    limitSize: {
      type: Number,
      default: 50,
    },
    busiType: {
      type: Number,
      default: 2,
    },
  },
  components: {},
  created() {
    this.uploadUrl = base.uploadUrl; // 上传接口url地址
    if (this.value) {
      this.mediaList = this.value;
    }
  },
  watch: {
    value(val) {
      this.mediaList = this.value;
    },
  },
  mounted() {
    this.baseurl = base.host;
  },
  methods: {
    exceedTips(file, fileList) {
      this.$message(`最多上传${fileList.length}个文件！`);
    },
    // 移除分享图片
    handleRemove(file, fileList) {
      this.mediaList = [];
      this.mediaurl = "";
    },
    handleSuccess(res, file, fileList) {
      console.log("上传成功了", res);
      this.mediaurl = this.baseurl + "/" + res.url.slice(7);
      console.log("视频地址", this.mediaurl);
      this.mediaList = fileList;
      this.$emit("geturl", this.mediaurl);
      // console.log('handleSuccess', this.mediaList, this.playTime, this.videoWidth, this.videoHeight)
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "mp4" || testmsg === "MP4";
      const size = file.size / 1024 / 1024;
      this.videoSize = size;
      const isLimitM = size < this.limitSize;
      if (!extension) {
        this.$message.error("视频格式不正确，仅支持 mp4");
      }
      if (!isLimitM) {
        this.$message.error(`上传视频大小不能超过${this.limitSize}MB!`);
      }
      if (extension && isLimitM) {
        // 获取视频时长
        const videoUrl = URL.createObjectURL(file);
        console.log(videoUrl);
        const videoObj = document.createElement("video");
        videoObj.onloadedmetadata = () => {
          URL.revokeObjectURL(videoUrl);
          // console.log('当前视频长度', videoObj.duration, videoObj.videoWidth, videoObj.videoHeight)
          this.playTime = videoObj.duration; // 视频时长
          this.videoWidth = videoObj.videoWidth; // 视频宽度
          this.videoHeight = videoObj.videoHeight; // 视频高度
          // 执行上传的方法，获取外网路径，上传进度等
          // resolve(videoObj)
        };
        videoObj.src = videoUrl;
        videoObj.load();
      }
      // 获取文件大小
      return isLimitM && extension;
    },
  },
};
</script>

<style lang='less'>
video {
  width: 300px;
  height: 300px;
}
.video-upload-com {
  .video .el-upload-list {
    width: 326px;
    padding-left: 157px;
    background-color: aqua;
  }
  .el-upload-list__item {
    margin: 0 8px 0 0;
  }
  .el-upload-list__item-status-label {
    right: -24px;
    line-height: 0px;
    // text-align: left;
    i {
      position: relative;
      top: 0px;
      left: -6px;
    }
  }
}
</style>
