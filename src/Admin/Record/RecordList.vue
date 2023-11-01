<template>
    <div class="user">
      <!-- 搜索区域 -->
      <div class="header">
        <el-input
          placeholder="请输入用户名查询病历"
          prefix-icon="el-icon-search"
          @input="onInput"
          @blur="zxl(val)"
          v-model="val"
          clearable
        >
        </el-input> 
        <el-button type="warning" @click="addrecord">添加</el-button>
  
        <el-button type="primary" @click="searchUser(val.trim())">查询</el-button>

      </div>
      <!-- 展示数据 -->
      <div class="warpper">
        <el-table :data="userData" border style="width: 100%">
          <el-table-column
            prop="title"
            label="标题"
            color="blue"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="患者账号"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="患者姓名"
            align="center"
          >
          
          </el-table-column>
          <el-table-column
            prop="sender"
            label="创建者"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="sendtime" label="创建时间" width="180"  align="center">
          </el-table-column>
          <el-table-column prop="editer" label="更新者" width="100" align="center">
          </el-table-column>
          <el-table-column prop="edittime" label="更新时间" width="180" align="center">
          </el-table-column>
          <el-table-column prop="status" label="状态"  width="70" align="center">
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="info">
                <router-link
                  :to="{
                    name: 'recorddetail',
                    query: {
                       record:scope.row
                    },
                  }"
                >
                  查看</router-link
                >
              </el-button>
              <el-button size="mini" type="info">
                <router-link
                  :to="{
                    name: 'recordedit',
                    query: {
                      record:scope.row
                    },
                  }"
                >
                  编辑</router-link
                >
              </el-button>
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
  
    methods: {
        addrecord() {
        this.$router.push('/admin/recordedit')
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
  
      // 分页
      changePage(num) {
        //用户分页
        this.currentPage = num
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
          .GetRecord({
            page,
          })
          .then((res) => {
            console.log(res.data);
            this.currentPage = page;
            if (res.data.status === 200) {
              res.data.data.forEach((data) => {
                data.edittime = moment(data.edittime).format(
                  "YYYY-MM-DD HH:mm:ss"
                    );
                    data.sendtime = moment(data.sendtime).format(
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
  .el-table-column   {
    color: blue;
  }
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