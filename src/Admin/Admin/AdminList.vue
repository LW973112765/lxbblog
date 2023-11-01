<template>
  <div class="user">
    <!-- 搜索区域 -->
    <div class="header">
      <el-input
        placeholder="请输入查询条件"
        prefix-icon="el-icon-search"
        @input="onInput"
        @blur="zxl(val)"
        v-model="val"
        clearable
      >
      </el-input>

      <el-button type="primary" @click="searchAdmin(val.trim())"
        >查询</el-button
      >
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
          prop="adminname"
          label="账户"
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
        <el-table-column prop="type" label="管理员权限" align="center">
          <template slot-scope="scope">
            <img
              class="adminimg"
              :src="img[Number(scope.row.type) - 1]"
              alt=""
            />
            <span :style="`color: ${scope.row.type == 2 ? 'green' : 'red'}`">
              {{ filterSatatus(scope.row.type) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100" align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100" align="center">
        </el-table-column>
        <el-table-column prop="time" label="注册时间" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="info">
              <router-link
                :to="{
                  name: 'updateadmin',
                  query: {
                    adminname: scope.row.adminname,
                    password: scope.row.password,
                    email: scope.row.email,
                    sex: scope.row.sex,
                    age: scope.row.age,
                    avatar: scope.row.avatar,
                    id: scope.row.id,
                    type: scope.row.type,
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
      img: [require("./1.png"), require("./2.png")],
    };
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
  mounted() {
    this.baseUrl = base.host;
  },

  methods: {
    filterSatatus(type) {
      if (type == 1) {
        return "超级管理员";
      } else if (type == 2) {
        return "普通管理员";
      }
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
    // 搜索管理员
    searchAdmin(val, page) {
      if (val == "") {
        // this.currentPage = 1;
        this.http(this.currentPage);
        return this.$message.error("错了哦，输入不能为空");
      }
      this.$api.adminSearch({ search: val, page: page }).then((res) => {
        console.log(res.data);
        this.currentPage = page;
        if (res.data.status === 200) {
          res.data.data.forEach((data) => {
            data.time = moment(data.time).format("YYYY-MM-DD HH:mm:ss");
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

    // 删除管理员
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该管理员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteAdmin({
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
      this.currentPage = num;
      if (this.type == 1) {
        this.http(num);
      }
      //搜索分页
      else {
        this.searchAdmin(this.val, num);
      }
    },
    // 获取管理员列表
    http(page) {
      console.log("收到了", page);
      this.$api
        .getAdminList({
          page,
        })
        .then((res) => {
          console.log("0", res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            res.data.data.forEach((data) => {
              data.time = moment(data.time).format("YYYY-MM-DD HH:mm:ss");
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
.adminimg {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
