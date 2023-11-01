<template>
  <div class="mainzxl">
    <section class="lw">
      <h3 class="zxl">狼小宝天气预报</h3>
      <div class="search">
        <input
          type="text"
          placeholder="请输入你要翻译的句子"
          v-model="keyWord"
        />&nbsp;
        <button @click="searchUsers">查询</button>
      </div>
      <!-- <div class="main">
      <h3>hello {{ city }}</h3>
    </div> -->
      <ul class="main">
        <li>
          <h3>hello {{ city }}</h3>
        </li>
        <li>
          <span>{{ type }}</span
          >{{ low }}<span></span><span>{{ high }}</span>
        </li>
        <li>
          <span>{{ fengxiang }}</span
          ><span>{{ fengli }}</span>
        </li>

        <li>{{ tip }}</li>
        <li>
          <span>{{ zdate }}</span
          ><span>{{ week }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Search",
  data() {
    return {
      keyWord: "武汉",
      city: "",
      zdate: "",
      fengli: "",
      fengxiang: "",
      high: "",
      low: "",
      tip: "",
      type: "",
      week: "",
    };
  },
  mounted() {
    axios.get(`https://api.vvhan.com/api/weather?city=${this.keyWord}`).then(
      (response) => {
        console.log(response.data);

        this.city = response.data.city;
        this.zdate = response.data.info.date;
        this.fengli = response.data.info.fengli;
        this.fengxiang = response.data.info.fengxiang;
        this.high = response.data.info.high;
        this.low = response.data.info.low;
        this.tip = response.data.info.tip;
        this.type = response.data.info.type;
        this.week = response.data.info.week;
      },

      (error) => {}
    );
  },
  methods: {
    searchUsers() {
      axios.get(`https://api.vvhan.com/api/weather?city=${this.keyWord}`).then(
        (response) => {
          console.log(response.data);

          this.city = response.data.city;
          this.zdate = response.data.info.date;
          this.fengli = response.data.info.fengli;
          this.fengxiang = response.data.info.fengxiang;
          this.high = response.data.info.high;
          this.low = response.data.info.low;
          this.tip = response.data.info.tip;
          this.type = response.data.info.type;
          this.week = response.data.info.week;
        },

        (error) => {}
      );
    },
  },
};
</script>
<style lang="less" scoped>
.mainzxl {
  margin-top: 41px;

  padding-top: 10px;
  width: 100%;
  height: auto;
  margin-right: 30px;
  background: radial-gradient(aqua, white);
}

.lw {
  margin: 0 auto;
  text-align: center;
}
.search {
  margin-top: 20px;
}
.main {
  margin: 10px auto;
  width: 400px;
  height: 280px;
}
li {
  list-style: none;
  margin: 10px auto;
  color: red;
}
button {
  cursor: pointer;
}
span {
  margin: 0 10px 0 2px;
}
</style>
