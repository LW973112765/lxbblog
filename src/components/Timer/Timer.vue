<template>
  <div class="main">
    <div class="zxl">{{ timer }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: "",
      value: new Date(),
    };
  },
  created() {
    this.currentTime();
  },
  methods: {
    currentTime() {
      setInterval(this.getTime, 1000);
    },
    getTime() {
      let date1 = +new Date();
      let beforedate = +new Date("2021-9-21 00:00:00");
      let time = (date1 - beforedate) / 1000;
      let d = Math.ceil(time / 60 / 60 / 24);
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let dates = date.getDate();
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      let arr = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let day = date.getDay();
      // document.querySelector('.z').innerHTML = h;
      // document.querySelector('.x').innerHTML = m;
      // document.querySelector('.l').innerHTML = s;
      this.timer =
        year +
        "年" +
        month +
        "月" +
        dates +
        "日" +
        "\t" +
        h +
        ":" +
        m +
        ":" +
        s +
        "\t" +
        "\t" +
        arr[day];
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 300px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  margin-bottom: 5px;
  color: red;
  background: radial-gradient(white, aqua);
}
</style>