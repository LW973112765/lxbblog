<template>
  <div
    class="main"
    :style="`background-color: ${total ? '' : 'rgba(0, 0, 0, 0.5)'}`"
  >
    <div class="hhh" v-if="total === 0">
      <img src="./1.png" alt="" />
      <h3>暂无数据</h3>
    </div>

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
</template>

<script>
// import "animate.css";
import moment from "moment";
import Mypage from "../../../components/Mypage/Mypage";
import ArticleItem from "../../../components/ArticleItem/ArticleItem";
import { mapState } from "vuex";
export default {
  name: "Collection",
  components: { ArticleItem, Mypage },
  data() {
    return {
      articleid: [],
      article: [],
      total: 1,
      pageSize: 8,
    };
  },

  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    getarticle(page, userid) {
      // console.log("收到了", page);
      this.$api
        .getCollectArticle({
          page,
          userid,
        })
        .then((res) => {
          if (res.data.status === 200) {
            res.data.data.forEach((data) => {
              // data.avatar = data.avatar.slice(7);
              data.tag = data.tag.split(",").map((item) => item * 1);
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.article = res.data.data;
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;
          } else {
            this.total = 0;
          }
        });
    },

    changePage(num) {
      this.getarticle(num, this.userinfo.id);
    },
  },
  created() {
    this.getarticle(1, this.userinfo.id);
  },
};
</script>

<style lang="less" scoped>
.main {
  position: relative;
  // padding-top: 10px;
  width: 583px;
  min-height: 300px;
  height: auto;
  margin-top: 20px;
  margin-right: 30px;
  // background-color: rgba(0, 0, 0, 0.5);
}
.article {
  width: 99%;
  height: auto;
  margin: 0 auto;
}
.pagination-wrapper {
  width: 99%;
  margin: 0 auto;
  background-color: #fff;
}
.hhh {
  width: 300px;
  height: 300px;
  margin-left: 150px;
  margin-top: 100px;
  text-align: center;
  h3 {
    color: red;
  }
}
</style>
