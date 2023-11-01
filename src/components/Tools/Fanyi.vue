<template>
  <div class="main">
    <section class="fanyi">
      <h3 class="jumbotron-heading">翻译官</h3>
      <div class="zxl">
        <input
          type="text"
          placeholder="请输入你要翻译的内容"
          v-model="keyWord"
        />&nbsp;
        <button @click="searchUsers">翻译</button>
      </div>
      <div class="content">
        {{ value }}
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Search",
  data() {
    return {
      keyWord: "",
      value: "",
    };
  },
  methods: {
    searchUsers() {
      axios.get(`https://api.vvhan.com/api/fy?text=${this.keyWord}`).then(
        (response) => {
          console.log(response.data);
          //请求成功后更新List的数据

          this.value = response.data.data.fanyi;
        },
        (error) => {
          //请求后更新List的数据
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.fanyi {
  margin: 0 auto;
  width: 300px;
  // height: 40px;
}
input {
  outline: none;
  border-radius: 5px;
  height: 30px;
}
h3 {
  text-align: center;
  margin-bottom: 10px;
}
textarea {
  margin-top: 20px;
  text-align: center;
  resize: none;
  outline: none;
  color: red;
  border-radius: 5px;
  background: radial-gradient(white, aqua);
}
.zxl {
  text-align: center;
  button {
    cursor: pointer;
    width: 50px;
    height: 30px;
    border-radius: 5px;
    background: radial-gradient(white, #999999);
  }
}
.main {
  margin-top: 41px;
  padding-top: 10px;
  width: 100%;
  height: auto;
  background: radial-gradient(aqua, blue);
}
.content {
  text-align: center;
  width: 100%;
  height: 200px;

  text-align: center;
  font-size: 20px;
  color: red;
  border-radius: 5px;
  background: radial-gradient(white, aqua);
  margin: 0 auto;
  margin-top: 20px;
}
</style>
