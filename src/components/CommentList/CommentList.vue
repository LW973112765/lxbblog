<template>
  <div class="commentlist">
    <ul class="ul">
      <li class="li">
        <div class="li-item">
          <img class="img" :src="item.avatar" />
          <div class="top">
            <div class="fw username">
              <span>{{ item.username }}</span
              ><span class="email">{{ item.email }}</span>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="value">
              {{ item.created_at | dateFormat }}
            </div>
            <div class="lw" @click="currentShow = item.id">
              <span><i class="el-icon-chat-dot-round"></i></span>
              <span v-show="item.username === userinfo.username"
                ><i
                  class="el-icon-delete"
                  @click.stop="deletecommentfather(item.id)"
                ></i
              ></span>
            </div>
            <div class="fatherinput" v-show="currentShow == item.id">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="textarea1"
                maxlength="500"
                show-word-limit
                resize="none"
              >
              </el-input>
              <img
                src="./1.png"
                alt=""
                @click="submit(item.id, item.senderid)"
              />
              <span class="el-icon-close" @click="currentShow = -2"></span>
            </div>
            <ul v-show="isopen">
              <li v-for="code in commentList" :key="code.id">
                <div class="li-item">
                  <img class="img" :src="code.avatar" alt="" />
                  <div class="top">
                    <div class="lw" @click="currentShow = code.id">
                      <span><i class="el-icon-chat-dot-round"></i></span>
                      <span v-show="code.senderid == userinfo.id"
                        ><i
                          class="el-icon-delete"
                          @click.stop="deletecomment(code.id)"
                        ></i
                      ></span>
                    </div>
                    <div class="nickanme">
                      <span class="fw">{{ code.sendername }}</span>
                      <span> 回复 {{ code.answername }}: </span>
                      <div class="replycontent">{{ code.content }}</div>
                    </div>
                    <div class="value">
                      {{ code.created_at | dateFormat }}
                    </div>
                    <div class="fatherinput" v-show="currentShow == code.id">
                      <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="textarea1"
                        maxlength="500"
                        show-word-limit
                        resize="none"
                      >
                      </el-input>
                      <img
                        src="./1.png"
                        alt=""
                        @click="submit2(item.id, code.senderid)"
                      />
                      <span
                        class="el-icon-close"
                        @click="currentShow = -2"
                      ></span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="open"
          v-show="isopen === false && total"
          @click="isopen = true"
        >
          <i class="iconfont icon-hr"></i><span>展开{{ total }}条回复</span
          ><i class="iconfont icon-haofangtuo400iconfontshaixuanzhedie"></i>
        </div>
        <div class="open" v-show="isopen === true" @click="isopen = false">
          <i class="iconfont icon-hr"></i><span>收起</span
          ><i
            class="iconfont icon-haofangtuo400iconfontshaixuanzhedieguanbi"
          ></i>
        </div>
      </li>
    </ul>
    <!-- <div class="loadText">
      <div
        ref="load"
        :class="{ pointer: pageIndex < totalPages }"
        @click="loadMore"
      >
        {{ pageIndex >= totalPages ? "没有更多了" : "加载更多" }}
      </div>
    </div> -->
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
export default {
  props: ["articleid", "item"],
  data() {
    return {
      isopen: false,
      textarea1: "",
      textarea2: "",
      totalPages: 0,
      pageIndex: 1,
      pageSize: 5,
      total: 0,
      commentList: [],
      currentShow: -1,
    };
  },
  // mounted() {
  //   console.log("评论收到的id", this.articleid);
  // },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  mounted() {
    // console.log("评论列表", this.item.id);
  },
  methods: {
    //删除父级评论
    deletecommentfather(id) {
      this.$api.deleteComment({ id }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        // this.getcomment(1, this.item.id);
        this.$emit("etitcomment", "宝宝");
      });
    },
    //删除子级评论
    deletecomment(id) {
      this.$api.deleteComment({ id }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getcomment(1, this.item.id);
      });
    },
    getcomment(page, id) {
      this.$api.getCommentAnswer({ page, id }).then((res) => {
        if (res.data.status === 200) {
          console.log("数据", res.data);
          this.commentList = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    async loadMore() {},
    async submit(id, username) {
      console.log(id, username);
      if (!this.textarea1) {
        this.$message.warning("请填写回复信息哦😊😊～");
        return;
      }
      let params = {
        articleid: this.articleid,
        come: id,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        content: this.textarea1,
        senderid: this.userinfo.id,
        answerid: username,
      };
      console.log(params);
      await this.$api.postComment(params).then((res) => {
        if (res.data.status === 200) {
          this.textarea1 = "";
          this.$message({
            message: "回复成功，等待管理员审核😊",
            type: "success",
          });
        }
      });
    },
    async submit2(id, username) {
      console.log(id, username);
      if (!this.textarea1) {
        this.$message.warning("请填写回复信息哦😊😊～");
        return;
      }
      let params = {
        articleid: this.articleid,
        come: id,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        content: this.textarea1,
        senderid: this.userinfo.id,
        answerid: username,
      };
      console.log(params);
      await this.$api.postComment(params).then((res) => {
        if (res.data.status === 200) {
          this.textarea1 = "";
          this.$message({
            message: "回复成功，等待管理员审核😊",
            type: "success",
          });
        }
      });
    },
  },
  created() {
    this.getcomment(1, this.item.id);
  },
};
</script>

<style lang="less" scoped>
.commentlist {
  width: 100%;
  height: auto;
}
.callback {
  color: #337ab7;
  font-size: 14px;
}

.loadText {
  text-align: center;
  color: #337ab7;
  font-size: 16px;
}

.ul {
  padding: 0 30px;
}

.fw {
  font-weight: 900;
}
.replycontent {
  margin: 4px 0;
}
.username {
  font-size: 12px;
  margin-bottom: 4px;
}
.content {
  margin-bottom: 4px;
  color: #555;
}
.email {
  margin-left: 10px;
}
ul {
  color: #333;
  font-size: 14px;
  li {
    margin-bottom: 10px;
    .li-item {
      display: flex;
    }
    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .top {
      position: relative;
      flex: 1;
      padding-left: 15px;
    }
    .value {
      margin-bottom: 10px;
    }
  }
}
.lw {
  position: absolute;
  top: 5px;
  right: 30px;
  i {
    font-size: 20px;
    color: #999;
  }
  span {
    margin-left: 5px;
    padding-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
.fatherinput {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fatherinput img {
  display: inline-block;
  text-align: center;
  margin-left: 10px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.fatherinput .el-icon-close {
  font-size: 30px;
  cursor: pointer;
  margin-left: 15px;
}
.open {
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  margin-left: 50px;
  i,
  span {
    margin-left: 5px;
    color: #999;
  }
}
</style>
