<template>
  <div class="user">
    <div class="zxl">
      <div class="left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/admin/home' }"
            ><i class="el-icon-house"></i>首页</el-breadcrumb-item
          ><el-breadcrumb-item
            :to="{
              path: '/admin/questionmanage',
            }"
            >问卷列表</el-breadcrumb-item
          >
          <el-breadcrumb-item>问卷提交详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 展示数据 -->
    <div class="warpper">
      <el-table :data="commentData" border style="width: 100%">
        <el-table-column
          prop="username"
          label="提交者"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          align="center"
          #default="scope"
          width="150"
        >
          <img :src="scope.row.avatar" alt="520" width="100px" height="100px" />
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="提交人性别"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="age"
          label="提交人年龄"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="提交人邮箱"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="sendtime" label="提交时间" align="center">
          </el-table-column>
        <el-table-column label="操作" width="" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="info">
                <router-link
                  :to="{
                    path: '/admin/questiondetail',
                    query: {
                      username: scope.row.username,
                      sendtime: scope.row.sendtime,
                      quData:scope.row,
                      questions: JSON.parse(scope.row.questions),
                    },
                  }"
                >
                  查看提交详情</router-link
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
  name: "ArticleComment",
  components: { Mypage },
  data() {
    return {
      baseUrl: "",
      val: "",
      commentData: [],
      total: 0,
      pageSize: 8,
      currentPage: 1,
    };
  },
  mounted() {
    this.baseUrl = base.host;
    console.log("收到了",this.$route.query.id);
  },
  methods: {

    addArticle() {
      this.$router.push("/admin/addarticle");
    },
    onInput() {
      this.$forceUpdate();
    },



    // 分页
    changePage(num) {
      this.http(num);
    },
    // 获取评论列表
    http(page) {
      this.$api
        .GetQuestionAnswer({
          page,
          questionid: this.$route.query.id,
        })
        .then((res) => {
          // console.log(res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            // console.log(res.data,'s数据');
            res.data.data.forEach((data) => {
              data.sendtime = moment(data.sendtime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.commentData = res.data.data;
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
