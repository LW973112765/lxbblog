<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div class="content">
        <div class="comment">
          <MessagePost @updatemessage="updatemessage" />
        </div>
        <div class="commentlist">
          <MessageList
            v-for="(item, index) in messageList"
            :key="index"
            :item="item"
            @updatalist="updatalist"
          />
        </div>
        <div class="loadText" v-if="total">
          <div ref="load" @click="loadMore">
            {{ messageList.length >= total ? "没有更多了" : "加载更多" }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import "animate.css";
import MessagePost from "./MessagePost";
import MessageList from "./MessageList";
export default {
  name: "MessageInfo",
  components: { MessagePost, MessageList },
  data() {
    return {
      n: 1,
      infoData: [],
      total: 0,
      pageSize: 8,
      liulanliang: "",
      messageList: [],
    };
  },

  created() {
    this.n = 1;
    this.getMessage(1);
  },
  methods: {
    updatalist(val) {
      // alert(val);
      this.onegetMessage(1);
    },
    updatemessage(val) {
      this.onegetMessage(1);
    },
    onegetMessage(page) {
      this.$api.getMessage({ page }).then((res) => {
        if (res.data.status === 200) {
          this.messageList = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    loadMore() {
      this.n++;
      this.getMessage(this.n);
    },
    getMessage(page) {
      this.$api.getMessage({ page }).then((res) => {
        if (res.data.status === 200) {
          this.messageList = this.messageList.concat(res.data.data);
          this.total = res.data.total;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.main {
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  // padding-top: 10px;
  // padding-left: 20px;
  padding-bottom: 20px;
  width: 600px;
  height: auto;
  margin: 50px auto;
  // background-color: rgba(0, 0, 0, 0.5);
  background-color: #999999;
}
.content {
  width: 100%;
  margin-top: 30px;
  // padding-bottom: 30px;
  // margin-bottom: 20px;
  margin-right: 40px;
  background-color: #fff;
  .title {
    width: 100%;
    font-size: 18px;
    text-align: center;
    padding-top: 35px;
    border-bottom: 1px solid #eae6e6;
    .stat {
      padding: 30px 42px 28px 20px;
      font-size: 12px;
      color: #919898;
      .iconfont {
        margin-right: 5px;
      }
      span {
        margin-left: 30px;
      }
    }
  }
  .comment {
    width: 100%;
    height: 242px;
    // background-color: aqua;
  }
  .commentlist {
    padding-top: 10px;
    padding-bottom: 20px;
    width: 100%;
    height: auto;
    background-color: #fff;
  }
}
.loadText {
  text-align: center;
  color: #337ab7;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>
