<template>
  <div :class="style">
    <!-- <div class="header">恭喜你发现了宝藏 (๑•̀ㅂ•́)و✧"</div> -->
    <el-dropdown :hide-on-click="false">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          ><span @click="switchCol('2')">切换为2列</span></el-dropdown-item
        >
        <el-dropdown-item
          ><span @click="switchCol('3')">切换为3列</span></el-dropdown-item
        >
        <el-dropdown-item
          ><span @click="switchCol('4')">切换为4列</span></el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <waterfall
      :col="col"
      :data="photoList"
      :width="itemWidth"
      :gutterWidth="gutterWidth"
    >
      <template>
        <div class="cell-item" v-for="(item, id) in photoList" :key="id">
          <img v-if="item.url" :src="item.url" alt="加载错误" v-viewer/>
          <div class="item-body">
            <div class="item-desc">{{ item.title }}</div>
          </div>
        </div>
      </template>
    </waterfall>
    <Loading class="Loading" :show="loading" />
    <div class="loading" @click="loadmore" disabled="true" v-show="isLoading1">
      {{ photoList.length >= total ? "到底啦~😊" : "加载更多" }}
    </div>
  </div>
</template>
 
<script>
/*
  注意 :
  1.itemWidth需要与gutterWidth一起使用才会生效，否则会进行自适应宽度
  2.使用了waterfall的组件不允许使用scoped,否则样式会有问题
*/
import Loading from "../../../components/Loading/Loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      loading: true,
      isLoading1: false,
      total: 0,
      n: 1,
      style: "style3",
      photoList: [],
      col: 3,
    };
  },
  computed: {
    itemWidth() {
      // return 120 * 0.5 * (document.documentElement.clientWidth / 375);
      if (this.col == 2) return 200;
      if (this.col == 3) return 170;
      if (this.col == 4) return 150;
    },
    gutterWidth() {
      if (this.col == 2) return 30;
      if (this.col == 3) return 20;
      if (this.col == 4) return 10;
    },
  },
  methods: {
    switchCol(col) {
      this.col = col;
      if (this.col == 2) {
        this.style = "style2";
      }
      if (this.col == 3) {
        this.style = "style3";
      }
      if (this.col == 4) {
        this.style = "style4";
      }
    },
    scroll(scrollData) {
      console.log(scrollData);
    },
    http(page) {
      this.$api.getPhoto({ page }).then((res) => {
        if (res.data.status === 200) {
          this.loading = false;
          console.log(res.data);
          this.photoList = this.photoList.concat(res.data.data);
          this.total = res.data.total;
          setTimeout(() => {
            this.isLoading1 = true;
          }, 1000);
        }
      });
    },
    //点击加载更多，再次向服务器发送请求
    loadmore() {
      this.n++;
      console.log(this.n);
      this.http(this.n);
    },
  },
  created() {
    this.n = 1;
    this.http(1);
  },
};
</script>
<style  lang="less" scoped>
.loading {
  cursor: pointer;
  position: absolute;
  bottom: 2px;
  left: 40%;
  transform: translate(-50%);
  color: red;
}
.style3 {
  position: relative;
  margin-top: 66px;
  margin-left: 130px;
  padding-left: 10px;
  width: 700px;
  box-sizing: border-box;
}
.style4 {
  position: relative;
  margin-top: 66px;
  margin-left: 64px;
  padding-left: 15px;
  width: 700px;
  box-sizing: border-box;
}
.style2 {
  position: relative;
  margin-top: 66px;
  margin-left: 140px;
  padding-left: 66px;
  width: 700px;
  box-sizing: border-box;
}
// background-color: red;
.cell-item:hover {
  transform: translateY(-10px);
}
.header {
  // text-align: center;
  position: relative;
  top: 80px;
  left: 200px;
  color: aqua;
  font-size: 20px;
  top: -5px;
}
.cell-item {
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 6px;
  margin-top: 10px;
  margin-bottom: 30px;
  transition: all 0.5s;
  img {
    // border-radius: 12px 12px 0 0;
    width: 100%;
    height: auto;
    display: block;
  }
}
.item-body {
  width: 100%;
  height: 50px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
button:first-child {
  margin-left: 40px;
}

/deep/ .el-dropdown {
  position: fixed;
  top: 60px;
  left: 330px;
}
</style>