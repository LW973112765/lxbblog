<template>
  <div class="main">
    <!-- 顶部区域 -->
    <div class="header">
      <div class="logo">
        <button class="zhankai" @click="show">点击</button>
        <div class="zxl"><img src="../../assets/img/logo3.png" alt="" /></div>
        <div class="lw"><img src="../../assets/img/logo2.png" alt="" /></div>
      </div>
      <div class="search">
        <el-input
          placeholder="请输入内容"
          v-model="val"
          @input="goSearchArticle(val.trim())"
          @keydown.native.enter="goSearch(val.trim())"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <button class="hhh" @click="goSearch(val.trim())">搜索</button>
      </div>
      <div class="login">
        <i v-show="userinfo.username === 'admin'">欢迎超级管理员：</i>
        <i v-show="userinfo.username !== 'admin'">欢迎：</i>
        {{ userinfo.username || " 游客" }}
        <span v-show="userinfo.username" @click="loginout"
          ><i class="el-icon-loading"></i> 退出登录</span
        >
        <span v-show="userinfo.username === ''" @click="login"
          ><i class="el-icon-loading"></i> 登录</span
        >
        <span v-show="userinfo.username === ''" @click="register"> 注册</span>

        <!-- <span @click="loginout"> 退出登录</span> -->
      </div>
      <!-- <div class="light"><Light @changeBackground="changeBG"></Light></div> -->
    </div>
    <!-- 内容区域 -->
    <div class="light">
      <Light @changeBackground="changeBG" :selection="selection"></Light>
    </div>
    <div class="layout">
      <el-collapse-transition>
        <Leftmenu class="leftmenu"></Leftmenu>
      </el-collapse-transition>
      <Rightmenu class="rightmenu"></Rightmenu>
      <Content class="content"></Content>
      <Fengche class="fengche"></Fengche>
    </div>
    <transition
      appear
      name="animate__animated animate__bounce"
      enter-active-class="animate__backInUp"
      leave-active-class="animate__backOutDown"
    >
      <div class="gotop" v-if="istop" @click="gotop">
        <img src="../../assets/img/gotop.png" alt="" />
      </div>
    </transition>
  </div>
</template>

<script>
import "animate.css";
import debounce from "../../util/debounce";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import Fengche from "../../components/Fengche/Fengche";
import Content from "./Content";
import Leftmenu from "./Leftmenu";
import Rightmenu from "./Rightmenu";
import Light from "../../components/Light/Light";
export default {
  name: "index",
  data() {
    return {
      selection: "",
      istop: false,
      val: "",
      bodyImg: "",
      isclick: true,
      timer: null,
      isshow: false,
    };
  },
  components: {
    Content,
    Leftmenu,
    Rightmenu,
    Light,
    Fengche,
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
    ...mapState("bgColor", ["bginfo"]),
  },
  watch: {
    selection(val) {
      console.log("langweu", val);
      if (val === "on") {
        this.bodyImg = "url(" + require("../../assets/img/night.gif") + ")";
        document.body.style.backgroundImage = this.bodyImg;
        document.body.style.backgroundSize = "100%";
        document.body.style.backgroundAttachment = "fixed";
      } else {
        this.bodyImg = "url(" + require("../../assets/img/bg111.jpg") + ")";
        document.body.style.backgroundImage = this.bodyImg;
        document.body.style.backgroundSize = "100%";
        document.body.style.backgroundAttachment = "fixed";
      }
    },
  },
  methods: {
    show() {
      let leftmenu = document.querySelector(".leftmenu");
      this.isshow = !this.isshow;
      console.log(this.isshow);
      if (this.isshow) {
        leftmenu.style.display = "block";
      } else {
        leftmenu.style.display = "none";
      }
    },
    //搜索
    search(val) {
      this.$router.push(`/search?content=${val}`);
    },

    goSearchArticle(val) {
      if (val == "") {
        return this.$message.error("错了哦，输入不能为空");
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search(val);
        console.log(this.input);
      }, 1000);
    },

    goSearch(val) {
      if (val == "") {
        return this.$message.error("错了哦，输入不能为空");
      }
      this.$router.push(`/search?content=${val}`);
    },
    changeBG() {
      if (this.selection == "off") this.selection = "on";
      else {
        this.selection = "off";
      }
      this.$nextTick(() => {
        let obj = {
          selection: this.selection,
          bg: this.bodyImg,
        };
        console.log("obj", obj);
        this.clearBg(obj);
        this.setBg(obj);
        //存储本地
        localStorage.setItem("bginfo", JSON.stringify(obj));
      });
    },
    ...mapMutations("loginModule", ["clearUser"]),
    ...mapMutations("bgColor", ["clearBg"]),
    ...mapMutations("bgColor", ["setBg"]),
    //退出登录
    loginout() {
      //清空vuex数据
      this.clearUser();
      //清空本地数据
      localStorage.removeItem("username");
      localStorage.removeItem("loginStatus");
      //返回登录
      this.$router.push("/login");
    },

    login() {
      this.$router.push("/login");
    },
    register() {
      this.$router.push("/register");
    },
    handleScroll(e) {
      let scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollTop >= 480) {
        this.istop = true;
      }
      if (scrollTop < 480) {
        this.istop = false;
      }
      // if (e.target.scrollTop > 700) this.istop = true;
    },
    gotop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      const timeTop = setInterval(() => {
        document.body.scrollTop =
          document.documentElement.scrollTop =
          top -=
            50;
        if (top < 0) {
          clearInterval(timeTop);
        }
      }, 10);
    },
  },
  mounted() {
    this.bodyImg =
      this.bginfo.bg || "url(" + require("../../assets/img/bg111.jpg") + ")";
    this.selection = this.bginfo.selection || "off";
    document.body.style.backgroundImage = this.bodyImg;
    document.body.style.backgroundSize = "100%";
    document.body.style.backgroundAttachment = "fixed";
    window.addEventListener("scroll", this.handleScroll);
    console.log("背景图", this.bginfo);
  },
  beforeMount() {
    document.body.style.backgroundImage = "";
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
}
.layout {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  .leftmenu {
    border: 0;
    position: fixed;
    overflow: auto;
    top: 46px;
    left: 100px;
    bottom: 0;
    width: 200px;
    min-height: 500px;
    background-color: #545c64;
  }
}
.login {
  color: aqua;
  font-size: 16px;
  position: absolute;
  top: 10px;
  right: 20px;
}
span {
  font-size: 16px;
  z-index: 99;
  color: red;
  cursor: pointer;
  margin-left: 10px;
}
i {
  font-style: normal;
}
.light {
  position: absolute;
  top: 40px;
  left: 100px;
  width: 50px;
  height: 100px;
}
.header {
  z-index: 0;
  position: fixed;
  top: 0;
  height: 40px;
  width: 100%;
  background-color: #00879e;
  .logo {
    position: absolute;
    display: flex;
    width: 300px;
    height: 100%;
    margin-left: 40px;
    .zxl {
      z-index: 5;
      width: 100px;
      height: 100%;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .lw {
      margin-left: -20px;
      img {
        width: 300px;
        height: 100%;
      }
    }
  }
  .search {
    position: relative;
    width: 300px;
    height: 100%;
    margin-left: 450px;
    .hhh {
      position: absolute;
      top: 50%;
      right: -124px;
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
      color: #0ebeff;
    }

    .hhh::before {
      content: "";
      position: absolute;
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
      position: absolute;
      background: #c937b1;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      left: 2px;
      top: 2px;
      z-index: -1;
      border-radius: 10px;
    }
  }
}
.content {
  position: relative;
  z-index: -1;
  flex: 1;
  margin-top: 15px;
  max-height: 50px;
  margin-left: 380px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
// .el-col {
//   border-radius: 4px;
// }
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  // border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.gotop {
  position: fixed;
  cursor: pointer;
  right: 50px;
  top: 70%;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: radial-gradient(blue, red);
  img {
    width: 95%;
    height: 95%;
  }
}
.fengche {
  position: fixed;
  bottom: 0;
  left: 18px;
}
.zhankai {
  display: none;
}
@media screen and (max-width: 768px) {
  .leftmenu,
  .rightmenu {
    position: absolute;
    display: none;
  }
  .zhankai {
    display: block;
  }
  .layout {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
  }
  .content {
    position: relative;
    z-index: -1;
    flex: 1;
    margin-top: 15px;
    width: 100%;
  }
}
</style>
