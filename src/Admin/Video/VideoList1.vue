<template>
  <div class="main" v-if="total">
    <div class="demo-image">
      <div class="block" v-for="(item, id) in videoList" :key="id">
        <video
          controls="true"
          loop
          style="width: 200px; height: 200px"
          :src="item.video"
          alt="加载错误"
        ></video>
        <div class="el-icon-delete-solid" @click="deleteVideo(item.id)"></div>
        <span class="title">{{ item.title }}</span>
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
  components: { Mypage },
  data() {
    return {
      total: 0,
      pageSize: 8,
      videoList: [],
      currentPage: 1,
    };
  },
  methods: {
    // 删除视频
    deleteVideo(id) {
      this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteVideo({
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
    // 获取视频列表
    http(page) {
      this.$api.getVideo({ page }).then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          this.currentPage = page;
          console.log(res.data.data);
          this.videoList = res.data.data;
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
  width: 95%;
  margin: 40px auto;
  height: auto;
  padding-bottom: 70px;
}
.main {
  padding-bottom: 20px;
}
.block:nth-child(-n + 3) {
  margin-top: 30px !important;
}
.block {
  position: relative;
  width: 300px;
  height: 200px;
  margin-left: 52px;
  margin-top: 100px;
  video {
    width: 100% !important;
    height: 200px !important;
  }
}
span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
  padding-left: 10px;
  line-height: 20px;
  color: red;
  background-color: aqua;
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
  right: 0px;
  cursor: pointer;
}
.page {
  box-sizing: border-box;
  // padding-left: 84px;
  width: 95%;
  margin: 0 auto;
  margin-top: -5px;
  background-color: white;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: wrap;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  height: 40px;
  line-height: 20px;
}
</style>