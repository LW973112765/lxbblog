<template>
  <div class="main">
    <div class="pagebox-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        width="100%"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title" style="width: 500px">
          <el-input v-model.trim="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="introduction">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="ruleForm.introduction"
            maxlength="30"
            show-word-limit
            resize="none"
            style="width: 400px"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-select
            style="width: 400px"
            v-model="ruleForm.tag"
            multiple
            placeholder="请选择"
            :multiple-limit="multiplelimit"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="封面" prop="url">
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

        <el-form-item label="内容" prop="content">
          <mavon-editor
            ref="md"
            :ishljs="true"
            v-model="ruleForm.content"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
            v-highlight
            codeStyle="gradient-dark"
          />
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
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapState } from "vuex";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import "mavon-editor/dist/markdown/github-markdown.min.css";
// import "../../assets/highlight.scss";
import base from "../../api/base";
export default {
  name: "ArticleAdd",
  components: {
    mavonEditor,
  },
  computed: {},
  data() {
    return {
      img_file: {},
      multiplelimit: 3,
      categoryList: [],
      dialogVisible: false,
      imageUrl: "",
      url: base.uploadUrl,
      qiniu: base.qiniu,
      ruleForm: {
        title: "",
        content: "",
        introduction: "",
        cover: "",
        tag: "",
      },
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        tag: [{ required: true, message: "至少选择一个分类", trigger: "blur" }],
        introduction: [
          { required: true, message: "请输入文章简介", trigger: "blur" },
        ],
        // cover: [{ required: true, message: "请上传封面图", trigger: "blur" }],
        // tag: [{ required: true, message: "请选择标签", trigger: "change" }],
        content: [{ required: true, message: "请填写文章", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.baseurl = base.host;
  },
  computed: {
    ...mapState("AdminLogin", ["admininfo"]),
  },
  methods: {
    fanhui() {
      this.$router.push("/admin/articlelist");
    },
    // markdown 上传图片
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      console.log($file);
      this.img_file[pos] = $file;
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("file", $file);
      this.img_file[pos] = $file;
      const fileName = +new Date() + $file.name;
      axios("/api/api/get-qiniu-token")
        .then((res) => {
          // 从后端获取上传凭证token
          const formData = new FormData();
          formData.append("file", $file);
          formData.append("token", res.data.token);
          formData.append("key", fileName);
          return axios({
            url: this.url,
            method: "POST",
            data: formData,
          });
        })
        .then((res) => {
          const zxl = this.qiniu + "/" + res.data.key;
          this.$refs.md.$img2Url(pos, zxl);
          console.log("langwei郎伟", zxl);
        });
    },
    $imgDel(pos) {
      delete this.img_file[pos];
    },
    getCategory() {
      this.$api.getCategoryList().then((res) => {
        if (res.data.status === 200) {
          console.log(res.data.data);
          this.categoryList = res.data.data;
        }
      });
    },
    submitForm() {
      // if (this.ruleForm.tag == "") {
      //   alert("5555");
      // }
      this.$refs.ruleForm.validate((valid) => {
        console.log("表单", this.ruleForm.tag);
        if (valid) {
          this.$message("已提交");
          let tag = this.ruleForm.tag.join(",");
          this.$api
            .addArticle({
              ...this.ruleForm,
              tag,
              created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              authorid: this.admininfo.id,
              // avatar: this.admininfo.avatar,
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$message({
                  message: "恭喜您，添加成功",
                  type: "success",
                });
                this.imageUrl = "";
                this.$refs.ruleForm.resetFields();
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
    },
    //qiniu
    uploadImage(content) {
      // 重命名要上传的文件
      console.log(content.file, "content.file");
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
          this.ruleForm.cover = this.imageUrl;
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
  created() {
    this.getCategory();
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-top: 29px;
  padding-left: 15px;
  padding-right: 30px;
  padding-bottom: 30px;
  width: 90%;
  min-height: 500px;
  margin: 30px auto;
  background-color: rgba(0, 0, 0, 0.5);
}
/deep/ .el-form-item__label {
  color: aqua;
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
</style>
