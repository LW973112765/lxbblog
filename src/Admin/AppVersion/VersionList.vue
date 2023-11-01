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
      <div class="right" @click="dialogVisible = true">
        <span class="el-dropdown-link"
          ><i class="iconfont icon-guanyu-banben"></i>发布新版本
        </span>
      </div>
    </div>
    <!-- 展示数据 -->
    <div class="warpper">
      <el-table :data="versiondata" border style="width: 100%">
        <el-table-column prop="appid" label="AppID" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="appname"
          label="应用名称"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="versionname"
          label="版本号"
          align="center"
          show-overflow-tooltip
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本名称"
          align="center"
          show-overflow-tooltip
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="systemtype"
          label="系统类型"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="是否强制更新" width="120" align="center">
          <template slot-scope="scope">
            <span :style="`color: ${scope.row.force ? 'blue' : 'red'}`">
              {{ scope.row.force ? "是" : "否" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="发布时间"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column label="更新内容" align="center">
          <template slot-scope="scope">
            <span v-html="scope.row.title"> </span>
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
    <el-dialog
      title="发布新版本"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="40%"
      :show-close="false"
    >
      <el-form :model="form">
        <el-form-item label="AppID" :label-width="formLabelWidth">
          <el-input disabled v-model="form.appid" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-input
            disabled
            v-model="form.appname"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本号" required :label-width="formLabelWidth">
          <el-input
            type="number"
            v-model="form.versionname"
            autocomplete="on"
            placeholder="请填写版本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本名称" required :label-width="formLabelWidth">
          <el-input
            placeholder="请填写版本名称"
            v-model="form.version"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item label="系统类型" required style="margin-left: 50px">
          <el-radio text="radio" v-model="form.systemtype" label="android"
            >android</el-radio
          >
          <el-radio text="radio" v-model="form.systemtype" label="ios"
            >ios</el-radio
          >
        </el-form-item>
        <el-form-item label="是否强制更新" required style="margin-left: 22px">
          <el-radio text="radio" v-model="form.force" label="1">是</el-radio>
          <el-radio text="radio" v-model="form.force" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="下载地址" required :label-width="formLabelWidth">
          <el-input placeholder="请填写下载地址" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="更新内容" required :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请填写更新内容"
            v-model="form.title"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
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
      versiondata: [],
      total: 0,
      pageSize: 8,
      type: 1,
      currentPage: 1,
      dialogVisible: false,
      formLabelWidth: "120px",
      form: {
        appid: "_UNI_EDAE8AD",
        appname: "郎小宝",
        versionname: "",
        force: "",
        systemtype: "",
        version: "",
        url: "",
        title: "",
      },
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
    add() {
      if (!this.form.versionname) {
        this.$message({
          showClose: true,
          message: "请填写版本号😊",
          type: "warning",
        });
      } else if (!this.form.version) {
        this.$message({
          showClose: true,
          message: "请填写版本名称😊",
          type: "warning",
        });
      } else if (!this.form.force) {
        this.$message({
          showClose: true,
          message: "请选择是否强制更新😊",
          type: "warning",
        });
      } else if (!this.form.url) {
        this.$message({
          showClose: true,
          message: "请填写下载地址😊",
          type: "warning",
        });
      } else if (!this.form.title) {
        this.$message({
          showClose: true,
          message: "请填写更新内容😊",
          type: "warning",
        });
      } else {
        let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        let { versionname, force, systemtype, version, url, title } = this.form;
        this.$api
          .AddVersion({
            versionname,
            force,
            systemtype,
            version,
            url,
            title,
            created_at,
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.dialogVisible = false;
              //  this.form.versionname = "",
              //   this.form.force = "",
              //   this.form.systemtype = "",
              //   this.form.version = "",
              //   this.form.url = "",
              //   this.form.title = ""
              this.http(1);
              this.$message({
                message: "恭喜您，添加成功",
                type: "success",
              });
            }
          });
      }
    },
    addversion() {
      this.$router.push("/admin/addversion");
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
      this.$api
        .GetVersion({
          page,
        })
        .then((res) => {
          console.log(res.data);
          this.currentPage = page;
          if (res.data.status === 200) {
            // console.log(res.data.data, "版本");
            res.data.data.forEach((data) => {
              data.created_at = moment(data.created_at).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              //   data.appid = "_UNI_" + data.appid;
            });
            this.versiondata = res.data.data;
            // console.log(" this.versiondata", this.versiondata);
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
/deep/ .el-form {
  margin-left: -20px;
}
// /deep/ .el-radio {
//   margin-left: 50px;
// }
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
