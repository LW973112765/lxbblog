<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div class="photo" v-show="userinfo.username">
        <img :src="avatar" alt="" v-show="username" />
      </div>
      <div class="photo" v-show="userinfo.username === ''">
        <img src="../../assets/img/1.png" alt="" />
      </div>
      <ul>
        <li>
          用户名：<span>{{ username }}</span>
        </li>
        <li>
          邮箱 : <span>{{ email }}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import "animate.css";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  name: "Userinfo",
  data() {
    return {
      email: "您未登录,无法获取哦😊",
      avatar: "",
      username: "您是游客",
      userinfo1: {},
    };
  },
  methods: {
    ...mapMutations("loginModule", ["setUser"]),
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  created() {
    let zxl = JSON.parse(localStorage.getItem("username"));
    if (zxl) {
      this.userinfo1 = zxl;
      let username = this.userinfo1.username;
      this.$api.getUserinfo({ username }).then((res) => {
        if (res.data.status === 200) {
          this.email = res.data.data.email;
          this.username = res.data.data.username;
          this.avatar = res.data.data.avatar;
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  display: flex;

  width: 300px;
  height: 120px;
  background: -webkit-linear-gradient(left, aqua, blue);
}
.photo {
  margin-left: 5px;
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  animation: xuanzhuan 15s linear infinite;
}
.photo:hover {
  animation-play-state: paused;
}
img {
  width: 100px;
  height: 100px;
}
li {
  margin-bottom: 5px;
}
ul {
  flex: 1;
  display: inline-block;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-top: 13px;
  padding-left: 15px;
  margin-left: 10px;
}
@keyframes xuanzhuan {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.zxl-enter-active {
  animation: zxl 0.5s linear;
}

.zxl-leave-active {
  animation: zxl 0.5s linear reverse;
}

@keyframes zxl {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>