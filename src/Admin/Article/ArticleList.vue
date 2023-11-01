<template>
  <div class="user">
    <div class="zxl">
      <div class="left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/admin/home' }"
            ><i class="el-icon-house"></i>首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>文章列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="right">
        <el-dropdown>
          <span class="el-dropdown-link"
            ><i class="el-icon-setting"></i>更多<i
              class="el-icon-arrow-down el-icon--right"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="addArticle"
              >添加文章</el-dropdown-item
            >
            <el-dropdown-item @click.native="goHuishouzhan"
              >回收站</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 搜索区域 -->
    <div class="header">
      <el-input
        placeholder="请输入"
        prefix-icon="el-icon-search"
        @input="onInput"
        @blur="zxl(val)"
        v-model="val"
        clearable
      >
      </el-input>
      <el-button type="primary" @click="searchArticle(val.trim())"
        >查询</el-button
      >
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
          <img
            :src="scope.row.cover"
            alt="lwandzxl"
            width="100px"
            height="100px"
            v-viewer
          />
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
            <el-button size="mini" type="primary">
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
              v-if="scope.row.is_del"
              @click.native.prevent="isDel(0, scope.row)"
              type="primary"
              size="mini"
              >上架</el-button
            >
            <el-button
              v-if="!scope.row.is_del"
              size="mini"
              type="danger"
              @click.native.prevent="isDel(1, scope.row)"
              >下架</el-button
            >
            <el-button size="mini" type="success">
              <router-link
                :to="{
                  path: '/admin/comment/',
                  query: {
                    id: scope.row.id,
                  },
                }"
                >评论</router-link
              ></el-button
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
        :currentPage="currentPage * 1"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import base from "../../api/base";
import Mypage from "../../components/Mypage/Mypage.vue";
export default {
  name: "ArticleLists",
  components: { Mypage },
  data() {
    return {
      baseUrl: "",
      val: "",
      articleData: [],
      total: 0,
      pageSize: 8,
      type: 1,
      currentPage: 1,
    };
  },
  mounted() {
    this.baseUrl = base.host;
    console.log(
      "收到了",
      this.$route.query.currentPage,
      typeof this.$route.query.currentPage
    );
  },
  watch: {
    $route(to, from) {
      // 监听路由是否变化
      console.log("to", to);
      console.log("from", from);
      if (to.name !== from.name) {
        this.http(1);
      }
    },
  },
  methods: {
    // goComment(item) {
    //   // this.$router.push(`/admin/comment/${item.id}`);
    //   this.$router.push({
    //     path: `/admin/comment/${item.id}`,
    //     params: { currentPage: this.currentPage },
    //   });
    // },
    goHuishouzhan() {
      this.$router.push("/admin/huishouzhan");
    },
    addArticle() {
      this.$router.push("/admin/addarticle");
    },
    onInput() {
      this.$forceUpdate();
    },
    zxl(val) {
      if (val == "") {
        this.http(1);
        this.type = 1;
      }
    },
    // 搜索文章
    searchArticle(val, page) {
      if (val == "") {
        // this.currentPage = 1;
        this.http(this.currentPage);
        return this.$message.error("错了哦，输入不能为空");
      }
      this.$api.articleSearch({ search: val, page: page }).then((res) => {
        console.log(res.data);
        this.currentPage = page;
        if (res.data.status === 200) {
          res.data.data.forEach((data) => {
            data.created_at = moment(data.created_at).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          this.articleData = res.data.data;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.type = 2;
        } else {
          this.articleData = [];
          this.total = 0;
          // this.type = 1;
        }
      });
    },

    // 删除文章
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm(
        "此操作不会删除数据，但会把数据移入回收站, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$api
            .setHuishou({
              id: row.id,
              status: 1,
            })
            .then((res) => {
              console.log("已把文章移入回收站", res.data);
              if (res.data.status === 200) {
                this.$message({
                  type: "success",
                  message: "已把文章移入回收站!",
                });
                // this.http(this.currentPage);
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
    //上架 下架文章
    async isDel(is_del, item) {
      let id = item.id;
      await this.$api.hiddenArticle({ id, is_del });
      this.$message({
        type: "success",
        message: `${!is_del ? "上架" : "下架"}成功!`,
      });
      this.http(this.currentPage);
    },
    // 分页
    changePage(num) {
      //文章分页
      this, (this.currentPage = num);
      if (this.type == 1) {
        this.http(num);
      }
      //搜索分页
      else {
        this.articleSearch(this.val, num);
      }
    },
    // 获取文章列表
    http(page) {
      console.log("收到了", page);
      let status = 0;
      this.$api
        .getArticle({
          page,
          status,
        })
        .then((res) => {
          console.log(res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            // console.log(res.data.data);
            res.data.data.forEach((data) => {
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
