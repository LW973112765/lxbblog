<template>
  <div class="main">
    <!-- 顶部区域 -->
    <div class="header">
      <button class="zhankai" @click="show">点击</button>
      <div class="logo">
        <div class="zxl"><img src="../../assets/img/logo3.png" alt="" /></div>
        <div class="lw"><img src="../../assets/img/logo4.png" alt="" /></div>
      </div>
      <el-row>
        <el-col :span="24"
          ><div class="grid-content bg-purple-dark"></div
        ></el-col>
      </el-row>
      <div class="admin" v-show="admininfo.adminname">
        {{ filterSatatus(admininfo.type) }}:{{ admininfo.adminname }}
        <span class="zxl" @click="loginout"
          ><i class="el-icon-loading"></i> 退出登录</span
        >
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="layout">
      <Mymenu class="menu" :admin="admininfo.adminname"></Mymenu>
      <Content class="content" :admin="admininfo.adminname"></Content>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import Content from "./Content";
import Mymenu from "./Mymenu";
export default {
  name: "index",
  data() {
    return {
      isshow: false,
      bodyImg: "url(" + require("../../assets/img/adminloginbg.jpg") + ")",
    };
  },
  components: {
    Content,
    Mymenu,
  },
  computed: {
    ...mapState("AdminLogin", ["admininfo"]),
  },
  mounted() {
    document.body.style.backgroundImage = this.bodyImg;
    document.body.style.backgroundSize = "100%";
    document.body.style.backgroundAttachment = "fixed";
    console.log("bbbbbb", this.admininfo);
    if (this.admininfo.adminname === "") {
      this.$confirm("您还未登录后台, 是否登录?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "请登录!",
          });
          this.$router.push("/adminlogin");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
          this.$router.go(-1);
        });
    }
  },
  methods: {
    show() {
      let leftmenu = document.querySelector(".menu");
      this.isshow = !this.isshow;
      console.log(this.isshow);
      if (this.isshow) {
        leftmenu.style.display = "block";
      } else {
        leftmenu.style.display = "none";
      }
    },
    filterSatatus(type) {
      if (type == 1) {
        return "超级管理员";
      } else if (type == 2) {
        return "普通管理员";
      }
    },
    ...mapMutations("AdminLogin", ["clearAdmin"]),
    ...mapMutations("AdminLoginAddress", ["clearAddress"]),

    //退出登录
    loginout() {
      //清空vuex数据
      this.clearAdmin();
      this.clearAddress();
      //清空本地数据
      localStorage.removeItem("lwandzxl");
      localStorage.removeItem("lwandzxladdress");
      //返回登录
      this.$router.push("/adminlogin");
    },
  },
};
</script>

<style lang="less" scoped>
.zhankai {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 5px;
  display: none;
}
.layout {
  width: 100%;
  height: 100%;
  display: flex;

  .content {
    z-index: -1;
    flex: 1;
    min-width: 400px;
    margin-top: 15px;
    max-height: 50px;
    margin-left: 200px;
    // background-color: red;
  }
}
.admin {
  color: aqua;
  font-size: 16px;
  position: absolute;
  top: 5px;
  right: 20px;
}
span {
  font-size: 16px;
  z-index: -99;
  color: red;
  cursor: pointer;
  margin-left: 10px;
}
i {
  font-style: normal;
}
.header {
  position: relative;
  z-index: 0;
  position: fixed;
  top: 0;
  height: 30px;
  width: 100%;
  // background-color: red;
  // background-color: #00879e;
  .logo {
    position: absolute;
    display: flex;
    width: 300px;
    height: 100%;
    margin-left: 40px;
    .zxl {
      z-index: 5;
      width: 100px;
      height: 100%;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .lw {
      z-index: 3;
      margin-top: 5px;
      img {
        width: 300px;
        height: 100%;
      }
    }
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
// .el-col {
//   border-radius: 4px;
// }
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  // border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
@media screen and (max-width: 768px) {
  .menu {
    display: none;
    position: absolute;
    // width: 0;
  }
  .content {
    width: 95%;
    position: relative;
    left: 0;
  }

  .zhankai {
    display: block;
  }
}
</style>
