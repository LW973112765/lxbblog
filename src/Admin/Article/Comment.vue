<template>
  <div class="user">
    <div class="zxl">
      <div class="left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/admin/home' }"
            ><i class="el-icon-house"></i>首页</el-breadcrumb-item
          ><el-breadcrumb-item
            :to="{
              path: '/admin/articlelist',
            }"
            >文章列表</el-breadcrumb-item
          >
          <el-breadcrumb-item>文章评论</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 展示数据 -->
    <div class="warpper">
      <el-table :data="commentData" border style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          align="center"
          #default="scope"
          width="150"
        >
          <img :src="scope.row.avatar" alt="520" width="100px" height="100px" />
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          align="center"
          show-overflow-tooltip
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="评论时间"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          width="100"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span
              :style="`color: ${
                scope.row.status > 0 && scope.row.status < 2 ? 'green' : 'red'
              }`"
            >
              {{ filterSatatus(scope.row.status) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >

            <el-button
              v-if="scope.row.status === 0"
              @click.native.prevent.once="isDel(1, scope.row)"
              type="info"
              size="mini"
              >审核通过</el-button
            >
            <el-button v-if="scope.row.status === 1" type="success" size="mini"
              >已通过</el-button
            >
            <el-button
              v-if="scope.row.status === 0"
              size="mini"
              type="danger"
              @click.native.prevent.once="isDel(2, scope.row)"
              >拒绝</el-button
            ><el-button v-if="scope.row.status === 2" size="mini" type="success"
              >已拒绝</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="main">
      <!-- 分页 -->
      <Mypage
        v-if="total"
        :total="total"
        :pageSize="pageSize"
        @changePage="changePage"
        :currentPage="currentPage"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import base from "../../api/base";
import Mypage from "../../components/Mypage/Mypage.vue";
export default {
  name: "ArticleComment",
  components: { Mypage },
  data() {
    return {
      baseUrl: "",
      val: "",
      commentData: [],
      total: 0,
      pageSize: 8,
      currentPage: 1,
    };
  },
  mounted() {
    this.baseUrl = base.host;
    // console.log("收到了", this.$route.params);
    console.log("收到了", this.$route.query.id);
  },
  methods: {
    // 1 通过 2 拒绝  3 待审核  '' 全部
    filterSatatus(type) {
      if (type == 1) {
        return "通过";
      } else if (type == 2) {
        return "拒绝";
      } else if (type == 0) {
        return "待审核";
      } else {
        return "未知";
      }
    },
    goHuishouzhan() {
      this.$router.push("/admin/huishouzhan");
    },
    addArticle() {
      this.$router.push("/admin/addarticle");
    },
    onInput() {
      this.$forceUpdate();
    },

    // 删除评论
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作会永久删除数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteComment({
              id: row.id,
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$message({
                  type: "success",
                  message: "已删除!",
                });
                let totalPage = Math.ceil((this.total - 1) / this.pageSize);
                let currentPage =
                  this.currentPage > totalPage ? totalPage : this.currentPage;
                this.currentPage = currentPage < 1 ? 1 : currentPage;
                this.http(this.currentPage);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //审核评论
    async isDel(is_del, item) {
      await this.$api.editComment({ id: item.id, status: is_del });
      this.$message({
        type: "success",
        message: `已${is_del > 0 && is_del < 2 ? "通过" : "拒绝"}!`,
      });
      this.http(1);
    },
    // 分页
    changePage(num) {
      this.http(num);
    },
    // 获取评论列表
    http(page) {
      // console.log("收到了", page);
      let status = 0;
      this.$api
        .getArticleComment({
          page,
          articleid: this.$route.query.id,
        })
        .then((res) => {
          // console.log(res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            res.data.data.forEach((data) => {
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.commentData = res.data.data;
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
.zxl {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  margin-top: 30px;
  background-color: #fff;
  height: 40px;
  padding-top: 12px;
  padding-left: 15px;
  .right {
    margin-right: 20px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  i {
    margin: 0px 10px;
  }
}
.el-icon-arrow-down {
  font-size: 16px;
}
.header {
  margin-top: 10px;
  display: flex;
  // background-color: rgba(0, 0, 0, 0);
  button {
    margin-left: 20px;
    margin-right: 0px;
  }
}
button:hover {
  color: aqua;
}
.warpper {
  margin-top: 10px;
}
.user {
  padding-left: 27px;
  padding-right: 5px;
  width: 95%;
}
.main {
  margin-top: -5px;
  background-color: white;
}
</style>
