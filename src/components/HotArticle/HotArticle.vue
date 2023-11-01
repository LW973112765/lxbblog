<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div>
      <div class="aside-box" v-if="hotlist.length > 0">
        <h3 class="aside-title">
          热门文章 <img src="../../assets/img/hot.png" alt="" />
        </h3>
        <ul class="aside-content">
          <router-link
            :to="{ path: `/articleinfo/?id=${item.id}` }"
            tag="li"
            class="aside-item-article pointer"
            v-for="(item, index) in hotlist"
            :key="index"
          >
            <div class="aside-name">
              <span>{{ index + 1 }}</span
              >{{ item.title }}
            </div>
            <div class="aside-count">阅读量： {{ item.total }}</div>
          </router-link>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import "animate.css";
export default {
  data() {
    return {
      hotlist: [],
    };
  },
  methods: {
    getHotList() {
      this.$api.getHotList().then((res) => {
        // console.log(res.data.data);
        if (res.data.status === 200) {
          this.hotlist = res.data.data;
        }
      });
    },
  },
  mounted() {
    setInterval(this.getHotList, 10000);
  },
  created() {
    this.getHotList();
  },
};
</script>

<style lang="less" scoped>
h3.aside-title {
  padding: 0 15px;
  height: 38px;
  border-bottom: 1px solid;
  background: #fff;
  color: #3d3d3d;
  font-size: 16px;
  line-height: 38px;
}
.aside-content {
  padding: 15px 15px 20px 15px;
  background: #fff;
  cursor: pointer;
}
h3 img {
  width: 28px;
  height: 28px;
  vertical-align: middle;
}
.aside-box {
  width: 100%;
  height: auto;
  // margin-bottom: 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.aside-item {
  display: flex;
  padding: 7px 0;
  color: #333;
  font-size: 14px;
  .aside-name {
    flex: 1;
  }
}
.aside-item-article {
  padding: 7px 0;
  color: #333;
  font-size: 14px;
  .aside-name {
    font-size: 16px;
    line-height: 1.4;
    transition: all, 0.3s;
    span {
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      line-height: 15px;
      text-align: center;
      margin-right: 5px;
      background: radial-gradient(white, #999999);
    }
  }
  .aside-name:hover {
    font-weight: 700;
    color: blue;
    transform: translate(30px);
  }
  .aside-count {
    margin-top: 4px;
    font-size: 12px;
  }
}
</style>