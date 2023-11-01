<template>
  <div class="msg">
    <div class="msg_head">
      <h5 class="h3mes">请留下你的留言吧</h5>
    </div>
    <div class="form-content">
      <div class="avatar-info">
        <img class="avatar" v-if="userinfo.avatar" :src="userinfo.avatar" />
        <img
          class="avatar pointer"
          v-if="!userinfo.avatar"
          src="./avatar.png"
          @click="login"
        />
        <div class="nickname">
          {{ userinfo.username || "快来留个言～" }}
        </div>
        <div class="tips" v-if="!userinfo.username">(点击头像登录)</div>
      </div>
      <div class="form">
        <div class="text" :class="isShow ? 'active' : ''">
          <textarea
            @blur="getBlur"
            @focus="getFocus"
            v-model.trim="content"
            class="textarea"
            rows="5"
          ></textarea>
        </div>
        <div class="submit" @click="submit" :class="!content ? 'disabled' : ''">
          发布
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  components: {},
  data() {
    return {
      content: "",
      isShow: false,
    };
  },
  mounted() {
    // console.log("Commentarticleid", this.articleid);
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    getAvatar(avatar) {
      this.avatar = avatar;
    },
    getBlur() {
      this.isShow = false;
    },
    getFocus() {
      this.isShow = true;
    },
    login() {
      if (!this.userinfo.username) {
        this.$message.warning("请先登录哦😊😊～");
        this.$confirm("您还未登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/login");
            this.$message({
              type: "success",
              message: "请登录!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    async submit() {
      if (!this.content) {
        this.$message.warning("请填写留言信息哦😊😊～");
        return;
      }
      // const { avatar, email, username } = this.userinfo;
      if (!this.userinfo.username) {
        this.$message.warning("请先登录再留言哦😊～");
        return;
      }
      // let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
      let params = {
        pid: 0,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        // avatar: this.userinfo.avatar,
        content: this.content,
        // email: this.userinfo.email,
        senderid: this.userinfo.id,
      };
      await this.$api.postMessage(params).then((res) => {
        if (res.data.status === 200) {
          this.content = "";
          this.$message({
            message: "留言成功😊",
            type: "success",
          });
          // this.$router.go(0);
          this.$emit("updatemessage", "宝宝");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.msg {
  margin: 20px auto;
  padding: 15px;
  box-sizing: border-box;
  min-height: 120px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 4px 0px 0px #999;
  .msg_head {
    width: 100%;
    text-align: center;
    .h3mes {
      color: rgb(81, 82, 80);
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
    }
  }
  .form-content {
    box-sizing: border-box;
    display: flex;
    .avatar-info {
      margin-right: 20px;
      padding-top: 10px;
      width: 80px;
      .avatar {
        margin: 0 auto;
        width: 60px;
        height: 60px;
      }
      .nickname {
        color: #4ebbaa;
        text-align: center;
        font-size: 12px;
        margin-top: 10px;
        margin-right: 18px;
      }
      .tips {
        color: #999;
        font-size: 11px;
      }
    }
    .form {
      position: relative;
      width: 60%;
      flex: 1;
      margin-top: 8px;
      display: flex;
    }
    .text {
      position: relative;
      width: 60%;
      overflow: hidden;
    }
    .textarea {
      resize: none;
      padding: 10px;
      min-height: 140px;
      max-height: 200px;
      width: 87%;
      font-size: 14px;
      border: 1px solid;
    }
    .submit {
      cursor: pointer;
      position: absolute;
      top: 30%;
      right: 30px;
      width: 120px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 4px;
      color: aqua;
      font-size: 14px;
      border: 2px solid #4ebbaa;
      background: -webkit-linear-gradient(left, blue, #999999);
    }
  }
}
.disabled {
  opacity: 0.5;
}
.active {
  outline: none;
  // border: 1px solid #6bc30d;
}
</style>
