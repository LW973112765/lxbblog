<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <header>一些有趣的小工具</header>
      <div class="top">
        <el-tooltip
          class="item"
          effect="light"
          content="遇到困难找我哦😊"
          placement="top"
        >
          <button class="fanyi">
            <router-link to="/tools/fanyi">翻译</router-link>
          </button>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="light"
          content="注意增减衣物哦😊"
          placement="top"
        >
          <button class="zxl1">
            <router-link to="/tools/weather">天气查询</router-link>
          </button>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="light"
          content="学习累了看看美图吧😊"
          placement="top"
        >
          <button class="zxl2">
            <router-link to="/tools/photos">随机美图</router-link>
          </button>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="light"
          content="要多笑笑哦😊"
          placement="top"
        >
          <button class="zxl3">
            <router-link to="/tools/word"> 每日一笑</router-link>
          </button>
        </el-tooltip>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </transition>
</template>
<script>
import "animate.css";
export default {
  name: "Tools",
  components: {},
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.main {
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  //   position: relative;
  font-size: 16px;
  min-height: 200px;
  padding-bottom: 20px;
  width: 600px;
  height: auto;
  margin: 0 auto;
  margin-top: 50px;
  // background-color: rgba(0, 0, 0, 0.5);
  background-color: #999999;
}
header {
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  background: radial-gradient(white, #999999);
}
.content {
  margin-top: 0px;
  width: 100%;
  height: auto;
}
button {
  width: 80px;
  margin-left: 30px;
  line-height: 40px;
  text-align: center;
  height: 40px;
  border-radius: 5px;
  border: none;
}
.fanyi {
  background: radial-gradient(white, #999999);
}
.zxl1 {
  background: radial-gradient(white, #cf279d);
}
.zxl2 {
  background: radial-gradient(#999999, yellow);
}
.zxl3 {
  background: radial-gradient(white, aqua);
}
a {
  color: blue;
}
a:hover {
  color: red;
}
</style>