<template>
  <div class="main">
    <div class="demo-image" v-if="total">
      <div class="block" v-for="(item, id) in videoList" :key="id">
        <video
          controls="true"
          loop
          style="width: 200px; height: 200px"
          :src="item.video"
          alt="加载错误"
        ></video>
        <span class="title">{{ item.title }}</span>
      </div>
    </div>
    <Loading class="Loading" :show="loading" />
    <div class="loadText" v-if="total">
      <div @click="loadMore">
        {{ videoList.length >= total ? "没有更多了" : "加载更多" }}
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "../../../components/Loading/Loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      loading: true,
      n: 1,
      total: 0,
      pageSize: 8,
      videoList: [],
      currentPage: 1,
    };
  },
  methods: {
    loadMore() {
      this.n++;
      // console.log(this.n);
      this.http(this.n);
    },

    // 获取视频列表
    http(page) {
      this.$api.getVideo({ page }).then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          this.loading = false;
          console.log(res.data.data);
          this.videoList = this.videoList.concat(res.data.data);
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
        }
      });
    },
  },
  created() {
    this.http(1);
  },
};
</script>

<style lang="less" scoped>
.loading {
  cursor: pointer;
  position: absolute;
  bottom: 2px;
  left: 40%;
  transform: translate(-50%);
  color: red;
}
.demo-image {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  margin: 40px auto;
  height: auto;
  padding-bottom: 20px;
}
.main {
  padding-bottom: 20px;
}
.block:first-child {
  margin-top: 30px !important;
}
.block {
  position: relative;
  width: 500px;
  height: 300px;
  margin: 50px auto;
  video {
    width: 100% !important;
    height: 100% !important;
  }
}
span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
  padding-left: 10px;
  line-height: 20px;
  color: red;
  // background-color: aqua;
  background: radial-gradient(white, #999999);
}

.loadText {
  text-align: center;
  color: red;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>