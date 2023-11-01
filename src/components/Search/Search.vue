<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div class="tishi" v-show="total === 0">
        <img src="../../assets/img/result.png" alt="" /> 搜索【<span>{{
          searchval
        }}</span
        >】的结果(<span>为空</span>)<button @click="gohome">返回首页</button>
      </div>
      <div class="tishi" v-if="total">
        <img src="../../assets/img/result.png" alt="" /> 搜索【<span>{{
          searchval
        }}</span
        >】的结果(共<span>{{ total }}</span
        >条)<button @click="gohome">返回首页</button>
      </div>
      <div class="search" v-if="total">
        <SearchItem
          class="searchitem"
          v-for="(item, index) in searchData"
          :key="index"
          :item="item"
        ></SearchItem>
      </div>
      <div class="pagination-wrapper" v-if="total">
        <Mypage
          v-if="total"
          :total="total"
          :pageSize="pageSize"
          @changePage="changePage"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import "animate.css";
import moment from "moment";
import Mypage from "../../components/Mypage/Mypage";
import SearchItem from "./SearchItem.vue";
export default {
  name: "search",
  components: { SearchItem, Mypage },
  data() {
    return {
      searchval: "",
      searchData: [],
      searchData1: [],
      total: 0,
      pageSize: 8,
    };
  },
  watch: {
    $route(to, from) {
      // 监听路由是否变化
      console.log("to", to);
      console.log("from", from);
      if (to.query.content !== from.query.content) {
        this.searchval = to.query.content;
        this.search(1, to.query.content);
      }
    },
  },
  mounted() {
    this.searchval = this.$route.query.content;
  },
  methods: {
    changeColor(searchData1) {
      //searchData为接口返回的数据
      searchData1.map((item, index) => {
        if (this.searchval) {
          /**
           * 使用正则表达式进行全文匹配关键词
           * ig : 表示 全文查找 ,忽略大小写
           *  i : 忽略大小写
           *  g : 全文查找
           *
           * 使用字符串的replace方法进行替换
           * stringObject.replace('被替换的值',替换的值)
           */
          let replaceReg = new RegExp(this.searchval, "ig");
          let replaceString = `<span style="color: #ed4014">${this.searchval}</span>`;
          searchData1[index].title = item.title.replace(
            replaceReg,
            replaceString
          );
          searchData1[index].introduction = item.introduction.replace(
            replaceReg,
            replaceString
          );
          searchData1[index].author = item.author.replace(
            replaceReg,
            replaceString
          );
        }
      });
      this.searchData = searchData1;
    },

    gohome() {
      this.$router.push("/home");
    },
    changePage(num) {
      this.search(num, this.$route.query.content);
    },
    search(page, content) {
      this.$api.getSearch({ search: content, page: page }).then((res) => {
        console.log(res.data);
        this.currentPage = page;
        if (res.data.status === 200) {
          res.data.data.forEach((data) => {
            data.created_at = moment(data.created_at).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          this.searchData1 = res.data.data;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.changeColor(this.searchData1);
        }
        if (res.data.status === 500) {
          this.total = 0;
        }
      });
    },
  },
  created() {
    this.search(1, this.$route.query.content);
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.main {
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  width: 690px;
  height: auto;
  margin: 50px auto;
  padding-bottom: 15px;
  //   background-color: red;
  // background-color: rgba(0, 0, 0, 0.5);
  // background-color: #999999;
}
.tishi {
  box-sizing: border-box;
  width: 95%;
  height: auto;
  border-radius: 10px;
  background-color: #fff;
  font-size: 20px;
  line-height: 50px;
  padding-left: 50px;
  span {
    color: red;
  }
  img {
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
  button {
    cursor: pointer;
    margin-left: 15px;
    color: black;
    height: 30px;
    width: 60px;
    border-radius: 5px;
    background: -webkit-linear-gradient(left, aqua, red);
  }
}
.search {
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-wrap: wrap;
  width: 95%;
  height: auto;
  //   background-color: blue;
  .searchitem {
    width: 300px;
    height: 200px;
    // margin-left: 15px;
    // margin-right: 10px;
    // margin-top: 20px;
    margin: 20px 10px 10px 15px;
    // background-color: aqua;
    z-index: 5;
  }
  //   .searchitem:hover {
  //     box-shadow: 0px 0px 8px 3px aqua;
  //     transition: box-shadow 0.5s;
  //   }
}
.pagination-wrapper {
  width: 95%;
  border-radius: 10px;
  background-color: #fff;
}
</style>
