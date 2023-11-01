<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div class="article">
        <ArticleItem
          :article="article"
          v-for="(item, index) in article"
          :key="index"
          :item="item"
        />
      </div>
      <div class="pagination-wrapper">
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
import Mypage from "../../../components/Mypage/Mypage";
import ArticleItem from "../../../components/ArticleItem/ArticleItem";
export default {
  name: "Article",
  components: { ArticleItem, Mypage },
  data() {
    return {
      article: [],
      total: 0,
      pageSize: 8,
      CategoryList: "",
    };
  },
  methods: {
    changePage(num) {
      this.http(num);
    },
    // 获取文章列表
    http(page) {
      // console.log("收到了", page);
      this.$api
        .getArticleHave({
          page,
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.status === 200) {
            // console.log(res.data.data);
            res.data.data.forEach((data) => {
              // data.avatar = data.avatar.slice(7);
              data.tag = data.tag.split(",").map((item) => item * 1);
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.article = res.data.data;
            // console.log(" this.article", this.article);
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
* {
  margin: 0;
  padding: 0;
}
.main {
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  padding-top: 10px;
  padding-left: 20px;
  padding-bottom: 10px;
  width: 600px;
  height: auto;
  margin: 50px auto;
  // background-color: rgba(0, 0, 0, 0.5);
  // background-color: #999999;
}
.article {
  width: 95%;
  height: auto;
}
.pagination-wrapper {
  width: 95%;
  background-color: #fff;
}
</style>
