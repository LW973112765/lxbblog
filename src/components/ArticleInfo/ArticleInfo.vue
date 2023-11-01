<template>
  <div class="main">
    <div class="content" v-for="(item, id) in infoData" :key="id">
      <div class="title">
        <span>{{ item.title }}</span>
        <div class="stat dispaly-flex">
          <span>发布时间：{{ item.created_at }}</span>
          <!-- <p>分类：<span>{{}}</span></p> -->
          <span>作者：{{ item.author }}</span>
          <span
            ><i class="iconfont icon-pinglun" />{{ commenttotal }} 条评论</span
          >
          <span
            ><i class="iconfont icon-liulanliang" />{{
              item.total
            }}
            次阅读</span
          >
        </div>
      </div>
      <div class="wapper">
        <mavon-editor
          ref="editor"
          :value="item.content"
          :subfield="false"
          :defaultOpen="'preview'"
          :toolbarsFlag="false"
          :editable="false"
          :scrollStyle="true"
          :ishljs="true"
          codeStyle="kimbie-light"
        >
        </mavon-editor>
      </div>
      <div class="comment"><Comment :articleid="articleid" /></div>
      <div class="commentlist">
        <CommentList
          :articleid="articleid"
          v-for="(item, index) in commentListz"
          :key="index"
          :item="item"
          @etitcomment="etitcomment"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Comment from "../Comment/Comment";
import CommentList from "../CommentList/CommentList";
import moment from "moment";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "ArticleInfo",
  components: { mavonEditor, Comment, CommentList },
  data() {
    return {
      articleid: this.$route.query.id,
      infoData: [],
      commenttotal: 0,
      total: 10,
      pageSize: 8,
      liulanliang: "",
      commentListz: [],
    };
  },
  watch: {
    $route(to, from) {
      // 监听路由是否变化
      // console.log("to", to);
      // console.log("from", from);
      if (to.query.id !== from.query.id) {
        this.articleid = to.query.id;
        this.getArtileInfo(to.query.id);
        this.getComment(this.articleid);
        this.getCommentTotal(to.query.id);
      }
    },
  },
  created() {
    this.getArtileInfo();
    this.getComment(this.$route.query.id);
    this.getCommentTotal(this.$route.query.id);
  },
  mounted() {},
  methods: {
    etitcomment(val) {
      // alert(`该更新啦${val}`);
      this.getComment(this.$route.query.id);
    },
    getComment(articleid) {
      this.$api.getComment({ articleid }).then((res) => {
        if (res.data.status === 200) {
          this.commentListz = res.data.data;
        }
      });
    },
    getArtileInfo(zzz) {
      let id = zzz || this.$route.query.id;
      this.$api.getArticleInfo({ id }).then((res) => {
        // console.log(res.data);
        if (res.data.status === 200) {
          // console.log(res.data.data);
          res.data.data.forEach((data) => {
            // data.avatar = data.avatar.slice(7);
            data.created_at = moment(data.created_at).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          this.infoData = res.data.data;
          this.liulanliang = res.data.data[0].total;
          this.liulanliang++;
          // console.log("浏览量", this.liulanliang, this.articleid);
          this.addLiulanliang(this.liulanliang, zzz || this.$route.query.id);
        }
      });
    },
    addLiulanliang(total, id) {
      this.$api.addLiulanliang({ total, id });
    },
    getCommentTotal(articleid) {
      this.$api.getCommentTotal({ articleid }).then((res) => {
        if (res.data.status === 200) {
          this.commenttotal = res.data.total;
        }
      });
    },
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
  // padding-top: 10px;
  // padding-left: 20px;
  // padding-bottom: 20px;
  width: 600px;
  height: auto;
  margin: 50px auto;
  // background-color: rgba(0, 0, 0, 0.5);
  background-color: #999999;
}
.content {
  width: 100%;
  margin-top: 30px;
  // padding-bottom: 30px;
  // margin-bottom: 20px;
  margin-right: 40px;
  background-color: #fff;
  .title {
    width: 100%;
    font-size: 18px;
    text-align: center;
    padding-top: 35px;
    border-bottom: 1px solid #eae6e6;
    .stat {
      padding: 30px 42px 28px 20px;
      font-size: 12px;
      color: #919898;
      .iconfont {
        margin-right: 5px;
      }
      span {
        margin-left: 30px;
      }
    }
  }
  .comment {
    width: 100%;
    height: 242px;
    // background-color: aqua;
  }
  .commentlist {
    padding-top: 10px;
    padding-bottom: 20px;
    width: 100%;
    height: auto;
    background-color: #fff;
  }
}
</style>
