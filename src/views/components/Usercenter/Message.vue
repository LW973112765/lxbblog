<template>
  <div class="main">
    <div class="hhh" v-if="total === 0">
      <img src="./1.png" alt="" />
      <h3>暂无数据</h3>
    </div>
    <div class="warpper" v-if="total">
      <el-table :data="messageData" border style="width: 100%">
        <el-table-column
          prop="content"
          label="留言内容"
          width="200"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="留言时间"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column label="留言状态" width="90" align="center">
          成功
        </el-table-column>
        <el-table-column label="操作" align="center" width="112">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
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
import Mypage from "../../../components/Mypage/Mypage.vue";
import { mapState } from "vuex";
export default {
  components: { Mypage },
  name: "Usercenter",
  data() {
    return {
      messageData: [],
      total: 0,
      pageSize: 8,
      currentPage: 1,
    };
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    handleDelete(index, row) {
      // console.log(index, row);
      this.$confirm("此操作会永久删除数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteMessage({
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
                this.http(this.currentPage, this.userinfo.username);
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

    changePage(num) {
      this.http(num, this.userinfo.username);
    },
    http(page, id) {
      // console.log("收到了", page);
      this.$api
        .getUserMessage({
          page,
          id,
        })
        .then((res) => {
          console.log("留言", res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            res.data.data.forEach((data) => {
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.messageData = res.data.data;
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;
          } else {
            this.total = 0;
          }
        });
    },
  },
  created() {
    this.http(1, this.userinfo.id);
  },
};
</script>

<style lang="less" scoped>
.main {
  position: relative;
  // padding-top: 10px;
  width: 583px;
  height: auto;
  margin-top: 20px;
  margin-right: 30px;
  background-color: rgba(0, 0, 0, 0.5);
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
.page {
  margin-top: -5px;
  background-color: white;
}
</style>
