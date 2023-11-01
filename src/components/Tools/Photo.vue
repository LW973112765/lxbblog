<template>
  <div class="main">
    <div class="top">
      <el-button type="primary" round @click="getphoto">获取美图</el-button>
      <div class="type">
        <el-select v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="content"><img :src="img" /></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      img: require("../../assets/img/bg111.jpg"),
      options: [
        {
          value: "动漫",
          label: "动漫",
        },
        {
          value: "风景",
          label: "风景",
        },
      ],
      value: "",
    };
  },
  methods: {
    getphoto() {
      if (this.value === "动漫") {
        axios.get("https://api.vvhan.com/api/acgimg?type=json").then((res) => {
          //   console.log(res.data);
          this.img = res.data.imgurl;
        });
      }
      if (this.value === "风景") {
        axios
          .get("https://res.abeim.cn/api-bing_img?export=json&idx=sj")
          .then((res) => {
            console.log(res.data);
            this.img = res.data.img_url;
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin-top: 41px;

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
/deep/ .el-select {
  position: relative;
  left: 50%;
  transform: translate(-50%);
  margin-bottom: 20px;
}
/deep/ .el-button {
  position: relative;
  left: 50%;
  transform: translate(-50%);
  margin-bottom: 20px;
}

img {
  width: 100%;
  height: 300px;
}
</style>