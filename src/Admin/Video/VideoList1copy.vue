<template>
  <div class="main">
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
    <div class="loadText" v-if="total">
      <div @click="loadMore">
        {{ videoList.length >= total ? "没有更多了" : "加载更多" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      n: 1,
      total: 10,
      pageSize: 8,
      videoList: [],
      currentPage: 1,
    };
  },
  methods: {
    loadMore() {
      this.n++;
      // console.log(this.n);
      this.http(this.n);
    },
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
                this.http(1);
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

    // 获取视频列表
    http(page) {
      this.$api.getVideo({ page }).then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          this.currentPage = page;
          console.log(res.data.data);
          this.videoList = this.videoList.concat(res.data.data);
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
  // background-color: aqua;
  background: radial-gradient(white, #999999);
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

// .title {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: wrap;
//   display: -webkit-box;
//   text-overflow: ellipsis;
//   -webkit-line-clamp: 2;
//   height: 40px;
//   line-height: 20px;
// }
.loadText {
  text-align: center;
  color: red;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>