<template>
  <div class="main">
    <div class="top">
      <el-tooltip
        class="item"
        effect="light"
        content="点我获取哦😊"
        placement="top"
      >
        <el-button type="primary" round @click="getword"
          >愿你每天开心😊</el-button
        >
      </el-tooltip>
    </div>
    <div class="content">{{ value }}</div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      value: "",
    };
  },
  methods: {
    getword() {
      axios.get("https://api.vvhan.com/api/joke?type=json").then((res) => {
        //   console.log(res.data);
        this.value = res.data.joke;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin-top: 41px;
  min-height: 300px;
  padding-top: 10px;
  width: 100%;
  height: auto;
  //   margin-top: 20px;
  margin-right: 30px;
  background: radial-gradient(aqua, white);
}
.top,
.content,
.type {
  position: relative;
  margin: 0 auto;
  width: 80%;
}

/deep/ .el-button {
  position: relative;
  left: 50%;
  transform: translate(-50%);
  margin-bottom: 20px;
}
</style>