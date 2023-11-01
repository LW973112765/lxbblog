<template>
  <div>
    <div class="content">
      <div class="shang">
        <h4 class="shangz">{{ item.title }}</h4>
        <router-link
          :to="{
            name: 'chatinfo',
            query: {
              data: {
                answername: item.author,
                answeravatar: item.avatar,
                answerid: item.authorid,
              },
            },
          }"
        >
          <el-tooltip content="点我咨询" placement="top" effect="light">
            <span
              @click="goinfo(item)"
              v-if="userinfo.id != item.authorid"
              class="iconfont icon-shequpinglun"
            ></span></el-tooltip
        ></router-link>
      </div>
      <div class="xia" @click="goarticleinfo(item.id)">
        <div class="left" v-show="item.cover">
          <img :src="item.cover" alt="" />
        </div>
        <div class="right">
          <p class="common-label" v-show="item.total > 300">
            热<span class="triangle" />
          </p>
          <div class="top">
            <img
              v-if="!item.avatar"
              src="http://rj35h5gq5.hd-bkt.clouddn.com/1664683833313090C442D174AABC7E4B31FB2469474BF.jpg"
              alt=""
            />
            <img v-if="item.avatar" :src="item.avatar" alt="" />
            <span class="pl10"
              ><i class="iconfont icon-gaojian-zuozhe" />&nbsp;{{
                item.author
              }}</span
            >
            <span class="zxxx"
              ><i class="iconfont icon-fenlei" />
              <span
                class="foot"
                v-for="(item1, index) in categoryList"
                :key="index"
                >{{ item1.name }}</span
              ></span
            >
          </div>
          <div class="center">
            <span class="introduction">{{ item.introduction }}</span>
          </div>
          <div class="buttom">
            <div class="zxl1">
              <img
                :src="isLike ? have : no"
                alt=""
                @click.stop="collect(item.id)"
              /><span>{{ isLike ? "已收藏" : "收藏" }}</span>
            </div>
            <div class="zxl2">
              <i class="iconfont icon-liulanliang" />{{ item.total }}
            </div>
            <div class="timer">
              <i class="el-icon-time" />{{ item.created_at }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      have: require("../../assets/img/have.png"),
      no: require("../../assets/img/no.png"),
      isLike: false,
      categoryList: [],
      isinfo: false,
      adminid: "",
    };
  },
  mounted() {
    // console.log(this.item, 'mmmmm');
    this.getadminid();
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    ...mapMutations("UserChat", ["setUserChat"]),
    ...mapMutations("UserChat", ["clearUserChat"]),
    goinfo(item) {
      // console.log('llllllllll');
      let obj = {
        userid: this.userinfo.id,
        adminid: this.adminid,
        name: item.author,
        avatar: item.avatar,
      };
      this.clearUserChat();
      this.setUserChat(obj);
      localStorage.removeItem("userchatinfo");
      localStorage.setItem("userchatinfo", JSON.stringify(obj));
    },
    getadminid() {
      this.$api.GetAdminId({ adminname: this.item.author }).then((res) => {
        this.adminid = res.data.data[0].id;
        // console.log(res.data.data[0].id,'管理员id');
      });
    },
    //收藏文章
    collect(id) {
      this.isLike = !this.isLike;
      if (this.isLike) {
        this.getCollect(id);
      }
      if (!this.isLike) {
        this.deleteCollect(id);
      }
    },
    //页面挂载时，查看当前文章是否已经被收藏
    isCollect(id, userid) {
      this.$api.isCollect({ article_id: id, userid: userid }).then((res) => {
        this.isLike = res.data.iscollect;
      });
    },
    //收藏文章
    getCollect(id) {
      this.$api
        .getCollect({ article_id: id, userid: this.userinfo.id })
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "已收藏！",
              type: "success",
            });
            this.isLike = true;
          }
        });
    },
    //取消收藏文章
    deleteCollect(id) {
      this.$api
        .deleteCollect({ article_id: id, userid: this.userinfo.id })
        .then((res) => {
          if (res.status === 200) {
            this.isLike = res.data.iscollect;
            this.$message({
              message: "已取消收藏！",
              type: "success",
            });
          }
        });
    },
    goarticleinfo(id) {
      this.$router.push(`/articleinfo?id=${id}`);
    },
    getCategoryName(tag) {
      let zxl = tag.join(",");
      this.$api
        .getCategoryName({
          tag: zxl,
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.status === 200) {
            // console.log("返回数据", res.data.data);
            this.categoryList = res.data.data;
          }
        });
    },
  },
  created() {
    this.getCategoryName(this.item.tag);
    this.isCollect(this.item.id, this.userinfo.id);
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 768px) {
  .content {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 200px;
    background-color: #fff;
    // margin-left: 10px;
    margin-bottom: 10px;
    overflow: hidden;
  }
}
.icon-shequpinglun {
  position: absolute;
  top: 5px;
  right: 70px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  color: #999;
}
.content {
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 200px;
  background-color: #fff;
  // margin-left: 10px;
  margin-bottom: 10px;
}
.shang {
  padding-left: 10px;
  line-height: 30px;
  color: black;
  width: 100%;
  height: 30px;
  transition: all 0.5s;
}
.shangz {
  transition: all 0.5s;
}
.shangz:hover {
  color: blue;
  text-decoration: underline;
  transform: translate(30px);
}
.xia {
  display: flex;
  position: relative;
  width: 100%;
  height: 170px;
}
.left {
  width: 30%;
  height: 200px;
  img {
    width: 100%;
    height: 170px;
  }
  // background-color: aqua;
}
.right {
  box-sizing: border-box;
  padding-left: 20px;
  width: 70%;
  height: 200px;
  .tpo,
  .center,
  .buttom {
    position: relative;
    width: 100%;
    span {
      margin-left: 2px;
      line-height: 30px;
    }
  }
  .top {
    height: 40px;
    background-color: #fff;
    display: flex;
    img {
      display: inline-block;
      width: 33px;
      height: 33px;
      border-radius: 50%;
    }
    // .icon-fenlei {
    //   font-size: 20px;
    //   color: #999;
    // }
    .pl10,
    .zxxx,
    .foot {
      display: inline-block;
      // margin-top: 4px;
      text-align: center;
      font-size: 15px;
      height: 33px;
      line-height: 33px;
      margin-left: 20px;
      color: #999;
      i {
        font-size: 20px;
      }
    }

    .foot {
      padding-left: 5px;
      margin-left: 5px !important;
      font-size: 13px !important;
    }
    .zxxx {
      padding-left: 0px;
    }
    // .p110 {
    //   margin-left: 10px;
    // }
    // .zxx {
    //   margin-left: 20px;
    // }
    .pl20 {
      margin-top: 10px;
      padding-left: 20px;
    }
  }
  .center {
    margin-top: 20px;
    height: 75px;
  }
  .introduction {
    line-height: 25px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    //文本超出部分以...形式展示
    text-overflow: -o-ellipsis-lastline;
    //整体超出部分隐藏
    overflow: hidden;
    //文本超出部分以...形式展示，同第一行样式代码
    text-overflow: ellipsis;
    //display 块级元素展示
    display: -webkit-box;
    //设置文本行数为2行
    -webkit-line-clamp: 2;
    //设置文本行数为2行
    line-clamp: 2;
    //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
    -webkit-box-orient: vertical;
  }
  .buttom {
    height: 30px;
    // margin-top: 35px;
    .timer {
      margin-left: 20px;
    }
    .zxl2 {
      margin-left: 25px;
    }
    .zxl1 {
      img {
        margin-top: 5px;
        width: 20px;
        height: 20px;
        vertical-align: -27%;
      }
      span {
        display: inline-block;
        width: auto;
        margin-left: 5px;
      }
    }
    .zxl1,
    .zxl2,
    .timer {
      display: inline-block;
      font-size: 15px;
      color: #999;
      i {
        font-size: 18px;
        padding-right: 5px;
      }
    }
  }
}
.content:hover {
  box-shadow: 0px 0px 8px 3px aqua;
  transition: box-shadow 0.5s;
}
.common-label {
  position: absolute;
  width: 30px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  background-color: #db4659;
  top: 10px;
  left: -10px;
  z-index: 9;
  .triangle {
    position: absolute;
    top: 24px;
    left: -10px;
    width: 0;
    height: 0;
    z-index: 33;
    border-left: 10px solid transparent;
    border-right: 10px solid #df0d3a;
    border-bottom: 7px solid transparent;
  }
}
</style>
