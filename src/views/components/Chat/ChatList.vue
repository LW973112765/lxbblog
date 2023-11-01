<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div
        class="nochatlist"
        v-if="chatlist.length == 0 && userinfo.username != 'admin'"
      >
        <div class="iconfont icon-shequpinglun"></div>
        <div class="mmm">暂无消息</div>
      </div>
      <!-- <div class="nochatlisttwo" v-if="userinfo.username == 'admin'">
        <div class="iconfont icon-shequpinglun"></div>
        <div class="mmm">您是管理员，请登录后台查看自己的信息</div>
      </div> -->
      <div
        class="chatlist"
        v-for="(item, index) in chatlist"
        :key="'1' + index"
      >
        <router-link
          :to="{
            name: 'chatinfo',
            query: {
              data: {
                avatar: item.avatar,
                answerid: item.id,
                answername: item.answername,
              },
            },
          }"
        >
          <div class="chat" @click="gotoinfo(item)">
            <div class="tupian"><img :src="item.avatar" alt="" /></div>
            <div class="wenzi">{{ item.answername }}</div>
            <div
              class="lastchat"
              v-for="(lastchat, id) in lastchat"
              :key="'3' + id"
            >
              <span v-if="lastchat.answerid == item.id">
                {{ lastchat.content }}
              </span>
            </div>
            <div
              class="chatno"
              v-for="(chat, chatindex) in chatno"
              :key="'2' + chatindex"
            >
              <span v-if="chat.senderid == item.id">
                {{ chat.total <= 99 ? chat.total : "99+" }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
      <div class="pagination-wrapper"></div>
    </div>
  </transition>
</template>
<script>
import "animate.css";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  name: "chatlist",
  data() {
    return {
      chatlist: [],
      chatno: [],
      lastchat: [],
    };
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    ...mapMutations("UserChat", ["setUserChat"]),
    ...mapMutations("UserChat", ["clearUserChat"]),

    gotoinfo(item) {
      console.log("hhhhhhhhhhhhhh");
      let obj = {
        userid: this.userinfo.id,
        adminid: item.id,
        name: item.answername,
        avatar: item.avatar,
      };
      this.clearUserChat();
      this.setUserChat(obj);
      localStorage.removeItem("userchatinfo");
      localStorage.setItem("userchatinfo", JSON.stringify(obj));
    },
    //获取聊天里最后一条信息
    getlastchat() {
      this.$api.GetLastChat({ senderid: this.userinfo.id }).then((res) => {
        this.lastchat = res.data.data;
      });
    },
    //获取未读信息
    getchatno() {
      // console.log("收到了", page);
      this.$api
        .GetChatNo({
          senderid: this.userinfo.id,
        })
        .then((res) => {
          if (res.data.status === 200) {
            console.log("获取未读信息", res.data.data);
            this.chatno = res.data.data;
          }
        });
    },
    // 获取聊天列表
    http() {
      // console.log("收到了", page);
      this.$api
        .GetChatList({
          senderid: this.userinfo.id,
        })
        .then((res) => {
          if (res.data.status === 200) {
            console.log("聊天", res.data);
            this.chatlist = res.data.data;
          }
        });
    },
  },
  created() {
    this.http();
    this.getchatno();
    this.getlastchat();
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.nochatlist,
.nochatlisttwo {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #999;
  div:first-child {
    position: absolute;
    font-size: 30px;
    color: #333;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
  }
  .mmm {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    color: #333;
    text-align: center;
    transform: translateX(-50%);
  }
}
.chatno {
  // background-color: aqua;
  min-width: 50px;
  width: auto;
  height: 50px;
  // color: red;
  position: absolute;
  right: 10px;
  top: 18px;

  span {
    display: inline-block;
    min-width: 20px;
    width: auto;
    height: 20px;
    color: white;
    border-radius: 50%;
    text-align: center;
    background: linear-gradient(to right, green, red);
  }
}

.main {
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  padding-top: 10px;
  padding-left: 20px;
  padding-bottom: 10px;
  width: 600px;
  height: auto;
  margin: 50px auto;
  // background-color: rgba(0, 0, 0, 0.5);
  // background-color: #999999;
}

.lastchat {
  position: absolute;
  left: 110px;
  top: 50%;
  font-size: 15px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // background-color: red;
  span {
    // background-color: red;
    color: #333;
  }
}

.chatlist {
  width: 95%;
  height: auto;

  .chat {
    background: #7bbfea;
    position: relative;
    width: 100%;
    height: 60px;
    padding-top: 10px;

    .tupian {
      margin-left: 10px;
      border-bottom: 1px solid #999;
    }

    .wenzi {
      color: #333;
      position: absolute;
      top: 10px;
      left: 70px;
    }
  }

  img {
    width: 50px;
    height: 50px;
  }
}

.pagination-wrapper {
  width: 95%;
  background-color: #fff;
}

// .chat:hover{
//   z-index: 10;
//   box-shadow: 0px 0px 8px 3px aqua;
// }
.chat:hover {
  z-index: 10;
  background: linear-gradient(to right, red, blue);
}
</style>
