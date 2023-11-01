<template>
  <div class="main">
    <div class="demo-image">
      <div class="block" v-for="(item, id) in photoList" :key="id">
        <el-image
          style="width: 200px; height: 200px"
          :src="item.url"
          alt="加载错误"
          v-viewer
        ></el-image>
        <div class="el-icon-delete-solid" @click="deletePhoto(item.id)"></div>
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="page">
      <!-- 分页 -->
      <Mypage
        :total="total"
        :pageSize="pageSize"
        @changePage="changePage"
        :currentPage="currentPage"
      />
    </div>
  </div>
</template>

<script>
import Mypage from "../../components/Mypage/Mypage.vue";
export default {
  name: "PhotoList",
  components: { Mypage },
  data() {
    return {
      total: 10,
      pageSize: 8,
      photoList: [],
      currentPage: 1,
    };
  },
  methods: {
    // 删除用户
    deletePhoto(id) {
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deletePhoto({
              id,
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

    // 分页
    changePage(num) {
      this.http(num);
    },
    // 获取图片列表
    http(page) {
      this.$api.getPhoto({ page }).then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          this.currentPage = page;
          console.log(res.data.data);
          this.photoList = res.data.data;
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
.demo-image {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  background-color: rgba(0, 0, 0, 0.5);
  width: 70%;
  margin: 0 auto;
  height: auto;
}
.main {
  padding-top: 50px;
}
.block {
  position: relative;
  width: 200px;
  height: 260px;
  margin-left: 52px;
  margin-top: 20px;
}
span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
  line-height: 20px;
  color: red;
  background-color: aqua;
}
img {
  display: block;
}
.block:hover .el-icon-delete-solid {
  display: block;
}
.el-icon-delete-solid {
  display: none;
  font-size: 20px;
  height: 30px;
  width: 30px;
  position: absolute;
  color: red;
  top: 2px;
  right: 2px;
  cursor: pointer;
}
.page {
  box-sizing: border-box;
  padding-left: 84px;
  width: 70%;
  margin: 0 auto;
  margin-top: -5px;
  background-color: white;
}
</style>