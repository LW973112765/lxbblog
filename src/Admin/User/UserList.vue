<template>
  <div class="user">
    <!-- 搜索区域 -->
    <div class="header">
      <el-input
        placeholder="请输入用户名"
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
          prop="avatar"
          label="个人头像"
          align="center"
          #default="scope"
        >
          <img
            :src="scope.row.avatar"
            alt="lwandzxl"
            width="100px"
            height="100px"
            v-viewer
          />
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center">
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="info">
              <router-link
                :to="{
                  name: 'updateuser',
                  query: {
                    username: scope.row.username,
                    password: scope.row.password,
                    email: scope.row.email,
                    sex: scope.row.sex,
                    age: scope.row.age,
                    avatar: scope.row.avatar,
                    nickname: scope.row.nickname,
                    introduction: scope.row.introduction,
                    id: scope.row.id,
                    updated_at: scope.row.updated_at,
                  },
                }"
              >
                编辑</router-link
              >
            </el-button>
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
  name: "UserList",
  components: { Mypage },
  data() {
    return {
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
      this.$api.userSearch({ search: val, page: page }).then((res) => {
        console.log(res.data);
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

    // 删除用户
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteUser({
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
    // 获取用户列表
    http(page) {
      console.log("收到了", page);
      this.$api
        .getUserList({
          page,
        })
        .then((res) => {
          console.log(res.data);
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
@media screen and (max-width: 768px) {
  .user {
    width: 95%;
    margin-left: -212px;
    button {
      margin-left: -200px;
      margin-right: 0px;
    }
  }
}
</style>
