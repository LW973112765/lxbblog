<template>
  <div class="menu">
    <Timer />
    <Userinfo v-if="isHome"></Userinfo>

    <div class="yy">
      <Music />
    </div>
    <Contact v-if="isHome" />
    <div class="hot" v-if="!isHome"><HotArticle /></div>
  </div>
</template>

<script>
import HotArticle from "../../components/HotArticle/HotArticle.vue";
import Userinfo from "../../components/Userinfo/Userinfo.vue";
import Music from "../../components/Music/Music.vue";
import Timer from "../../components/Timer/Timer.vue";
import Contact from "../../components/Contact/Contact.vue";
export default {
  name: "Rightmenu",
  data() {
    return {
      isHome: true,
    };
  },
  components: { Userinfo, Music, HotArticle, Timer, Contact },
  //监听路由变化
  watch: {
    $route(to, from) {
      // console.log("to", to);
      // console.log("from", from);
      if (to.name !== "home") {
        this.isHome = false;
      } else {
        this.isHome = true;
      }
    },
  },
  //  watch: {
  //   $route: {
  //     deep: true,
  //     handler(to, from) {
  //       console.log("to", to);
  //       console.log("from", from);
  //     },
  //   },
  // },
  mounted() {
    // console.log("路由地址", this.$route.path);
  },
};
</script>

<style lang="less" scoped>
.menu {
  position: fixed;
  right: 0;
  top: 46px;
  right: 30px;
  height: auto;
  width: auto;
  background-color: rgba(0, 0, 0, 0.6);
}
.yy {
  width: 300px;
  height: auto;
  ::-webkit-scrollbar {
    width: 10px;
    height: 20px;
    background-color: gray;
  }
  ::-webkit-scrollbar-track {
    background: #999;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #f0bbc3, #10a44a);
    border-radius: 10px;
  }
}

.hot {
  width: 300px;
  height: 300px;
}
</style>
