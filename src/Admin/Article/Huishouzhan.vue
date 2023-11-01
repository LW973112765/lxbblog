<template>
  <div class="user">
    <div class="zxl">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/home' }"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/admin/articlelist' }"
          >文章列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>回收站</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 搜索区域 -->
    <div class="header" v-if="total">
      <el-input
        placeholder="请输入"
        prefix-icon="el-icon-search"
        @input="onInput"
        v-model="val"
        clearable
      >
      </el-input>
      <el-button type="primary" @click="searchMember(val)">查询</el-button>
    </div>
    <!-- 展示数据 -->
    <div class="warpper">
      <el-table :data="articleData" border style="width: 100%">
        <el-table-column
          prop="cover"
          label="封面"
          align="center"
          #default="scope"
          width="150"
        >
          <img :src="scope.row.cover" alt="520" width="100px" height="100px" v-viewer/>
        </el-table-column>
        <el-table-column
          prop="author"
          label="发布人"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="total" label="浏览量" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          align="center"
          show-overflow-tooltip
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="发布时间"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updated_at"
          label="更新时间"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              <router-link
                :to="{
                  name: 'editarticle',
                  query: {
                    id: scope.row.id,
                    title: scope.row.title,
                    introduction: scope.row.introduction,
                    cover: scope.row.cover,
                    content: scope.row.content,
                    tag: scope.row.tag,
                  },
                }"
                >编辑</router-link
              >
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              @click.native.prevent="setArticle(scope.row)"
              type="primary"
              size="mini"
              >还原</el-button
            >
            <el-button size="mini" type="success" @click="goComment(scope.row)"
              >评论</el-button
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
  name: "Huishouzhan",
  components: { Mypage },
  data() {
    return {
      baseUrl: "",
      val: "",
      articleData: [],
      total: 0,
      pageSize: 8,
      currentPage: 1,
    };
  },
  mounted() {
    this.baseUrl = base.host;
  },
  methods: {
    goComment(item) {
      this.$router.push(`/admin/comment/${item.id}`);
    },
    goHuishouzhan() {
      this.$router.push("/admin/huishouzhan");
    },
    onInput() {
      this.$forceUpdate();
    },
    // 搜索用户
    searchMember(val) {
      this.total = 1;
      this.articleData = this.articleData.filter((user) => {
        return user.username === val;
      });
      console.log(this.articleData);
    },
    //编辑用户
    handleEdit(index, row) {
      console.log(index, row);
    },
    // 删除文章
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteArticle({
              id: row.id,
            })
            .then((res) => {
              console.log("删除成功", res.data);
              if (res.data.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
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
    //还原文章
    async setArticle(item) {
      this.$confirm("确定把该文章移出回收站吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .setHuishou({
              id: item.id,
              status: 0,
            })
            .then((res) => {
              console.log("已把文章移出回收站", res.data);
              if (res.data.status === 200) {
                this.$message({
                  type: "success",
                  message: "已把文章移出回收站!",
                });
                // this.http(1);
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
            message: "已取消",
          });
        });
      this.http(this.currentPage);
    },
    // 分页
    changePage(num) {
      this.http(num);
    },
    // 获取文章列表
    http(page) {
      console.log("收到了", page);
      let status = 1;
      this.$api
        .getArticle({
          page,
          status,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 200) {
            this.currentPage = page;
            // console.log(res.data.data);
            res.data.data.forEach((data) => {
              // data.avatar = data.avatar.slice(7);
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              data.updated_at = moment(data.updated_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.articleData = res.data.data;
            // console.log(" this.articleData", this.articleData);
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;
            // console.log("数据库获取的pageSize", this.pageSize);
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
