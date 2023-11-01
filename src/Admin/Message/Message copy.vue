<template>
  <div class="user">
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

      <el-button type="primary" @click="searchUser(val.trim())">查询</el-button>
    </div>
    <!-- 展示数据 -->
    <div class="warpper">
      <el-table :data="userData" border style="width: 100%">
        <el-table-column
          prop="username"
          label="留言者"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          align="center"
          #default="scope"
        >
          <img :src="scope.row.avatar" alt="520" width="100px" height="100px" />
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="content" label="留言内容" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="留言时间" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.iscallback"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              type="info"
              >回复</el-button
            >
            <el-button v-if="scope.row.iscallback" size="mini" type="success"
              >已回复</el-button
            >
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
import { mapState } from "vuex";
import base from "../../api/base";
import Mypage from "../../components/Mypage/Mypage.vue";
export default {
  name: "Message",
  components: { Mypage },
  data() {
    return {
      textarea1: "",
      baseUrl: "",
      val: "",
      userData: [],
      total: 0,
      pageSize: 8,
      type: 1,
      currentPage: 1,
    };
  },
  mounted() {
    this.baseUrl = base.host;
  },
  computed: {
    ...mapState("AdminLogin", ["admininfo"]),
  },
  methods: {
    onInput() {
      this.$forceUpdate();
    },
    zxl(val) {
      if (val == "") {
        this.http(1);
        this.type = 1;
      }
    },
    // 搜索用户
    searchUser(val, page) {
      if (val == "") {
        // this.currentPage = 1;
        this.http(this.currentPage);
        return this.$message.error("错了哦，输入不能为空");
      }
      this.$api.messageSearch({ search: val, page: page }).then((res) => {
        // console.log(res.data);
        this.currentPage = page;
        if (res.data.status === 200) {
          res.data.data.forEach((data) => {
            data.created_at = moment(data.created_at).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          this.userData = res.data.data;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.type = 2;
        } else {
          this.userData = [];
          this.total = 0;
          // this.type = 1;
        }
      });
    },
    //回复留言
    handleEdit(index, row) {
      console.log(index, row);
      //   this.dialogVisible = true;
      this.$prompt("请输入回复内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        if (!value.trim()) {
          this.$message({
            type: "error",
            message: "请填写内容",
          });
        }
        console.log("请填写内容", row);
        let params = {
          username: this.admininfo.adminname,
          pid: row.id,
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          avatar: this.admininfo.avatar,
          content: value,
          email: this.admininfo.email,
          answer: row.username,
        };
        console.log("请填写内容", params);
        this.callback({ ...params });
      });
    },
    callback(params) {
      this.$api.postMessage(params).then((res) => {
        if (res.data.status === 200) {
          this.$message({
            message: "回复成功😊",
            type: "success",
          });
        }
        this.updateMessage(params.pid);
      });
    },
    updateMessage(id) {
      console.log("收到id", id);
      this.$api.updateMessage({ id }).then((res) => {
        this.http(this.currentPage);
      });
    },
    // 删除用户
    handleDelete(index, row) {
      //   console.log(index, row);
      this.$confirm("此操作将永久删除该留言, 是否继续?", "提示", {
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
              //   console.log("删除成功", res.data);
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
      //用户分页
      this, (this.currentPage = num);
      if (this.type == 1) {
        this.http(num);
      }
      //搜索分页
      else {
        this.searchUser(this.val, num);
      }
    },
    // 获取留言列表
    http(page) {
      //   console.log("收到了", page);
      this.$api
        .getMessage({
          page,
        })
        .then((res) => {
          //   console.log(res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            res.data.data.forEach((data) => {
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.userData = res.data.data;
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
.header {
  margin-top: 30px;
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