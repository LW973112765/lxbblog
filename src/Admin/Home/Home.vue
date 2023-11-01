<template>
  <div class="home">
    <div class="top">郎小宝博客</div>
    <ul class="center">
      <li class="zxl">
        <div class="iconfont"><img src="./img/4.png" alt="" /></div>
        <ul>
          <li>实时用户</li>
          <li>{{ user }}</li>
        </ul>
      </li>
      <li class="zxl">
        <div class="iconfont"><img src="./img/2.png" alt="" /></div>
        <ul>
          <li>总访问量</li>
          <li>{{ total }}</li>
        </ul>
      </li>
      <li class="zxl">
        <div class="iconfont"><img src="./img/3.png" alt="" /></div>
        <ul>
          <li>评论量</li>
          <li>{{ allcomment }}</li>
        </ul>
      </li>
      <li class="zxl">
        <div class="iconfont"><img src="./img/1.png" alt="" /></div>
        <ul>
          <li>文章总数</li>
          <li>{{ atticletotal }}</li>
        </ul>
      </li>
    </ul>

    <div class="xia">
      <div id="main"></div>
      <div class="admin">
        <div class="admintop">
          <div class="avatar">
            <img :src="admininfo.avatar" alt="lwandzxl" v-viewer />
          </div>
          <ul>
            <li class="zxl">{{ admininfo.adminname }}</li>
            <li class="lw">
              {{ filterSatatus(admininfo.type) }}
            </li>
          </ul>
        </div>
        <div class="adminxia">
          <ul>
            <li>
              <span>上次登录时间:</span
              ><span class="zzz">{{ addressinfo.time }}</span>
            </li>
            <li>
              <span>上次登录地点:</span
              ><span class="zzz"
                ><span>{{ addressinfo.prov }}</span>
                <span class="zxl">{{ addressinfo.city }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      atticletotal: "",
      allcomment: "",
      user: "",
      total: 0,
      xiaohai: [],
      shaonian: [],
      qingnian: [],
      zhongnian: [],
      laonian: [],
    };
  },
  computed: {
    ...mapState("AdminLoginAddress", ["addressinfo"]),
    ...mapState("AdminLogin", ["admininfo"]),
  },
  methods: {
    filterSatatus(type) {
      if (type == 1) {
        return "超级管理员";
      } else if (type == 2) {
        return "普通管理员";
      }
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = (option = {
        title: {
          subtext: "用户详情表 ",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "用户详情表",
            type: "pie",
            radius: "50%",
            data: [
              { value: this.xiaohai.length, name: "小孩" },
              { value: this.shaonian.length, name: "少年" },
              { value: this.qingnian.length, name: "青年" },
              { value: this.zhongnian.length, name: "中年" },
              { value: this.laonian.length, name: "老年" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getUser() {
      this.$api.getUserList().then((res) => {
        if (res.data.status === 200) {
          this.user = res.data.total;
        }
      });
    },
    getArticle() {
      this.$api.getArticleTotal({ status: 0 }).then((res) => {
        if (res.data.status === 200) {
          res.data.data.forEach((ele) => {
            this.total += Number(ele.total);
          });
          this.atticletotal = res.data.data.length;
        }
      });
    },
    getComment() {
      this.$api.getAllComment().then((res) => {
        if (res.data.status === 200) {
          this.allcomment = res.data.total;
        }
      });
    },
  },
  watch: {
    immediate: true,
    deep: true,
    xiaohai: {
      handler() {
        this.drawLine();
      },
    },
  },
  mounted() {
    this.drawLine();
    this.getUser();
    this.getArticle();
    this.getComment();
  },
  created() {
    this.getUser();
    this.$api.getUserTotal({}).then((res) => {
      console.log(res.data);
      if (res.data.status === 200) {
        this.xiaohai = res.data.data.filter((user) => {
          return user.age > 0 && user.age <= 12;
        });
        this.shaonian = res.data.data.filter((user) => {
          return user.age > 12 && user.age <= 20;
        });
        this.qingnian = res.data.data.filter((user) => {
          return user.age > 20 && user.age <= 30;
        });
        this.zhongnian = res.data.data.filter((user) => {
          return user.age > 30 && user.age <= 50;
        });
        this.laonian = res.data.data.filter((user) => {
          return user.age > 50;
        });
      }
    });
  },
};
</script>

<style lang="less" scoped>
#main {
  box-sizing: border-box;
  margin-top: 40px;
  // margin-left: 50px;
  padding-left: 40px;
  padding-top: 20px;
  width: 500px;
  height: 300px;
  border-radius: 10px;
  background: white;
}
.home {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: 30px;
  margin-right: 30px;
  padding-top: 20px;
  margin-top: 40px;
  padding-bottom: 20px;
  width: 93%;
  height: 530px;
  // background: radial-gradient(blue, aqua);
  background: #9fadbb;
}
.top {
  width: 98%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  // background-color: aqua;
}
.center {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 98%;
  height: 100px;
  margin-top: 10px;
  // background-color: white;
  .zxl {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-weight: 600;
    border-radius: 10px;
    width: 200px;
    height: 80px;
    background: linear-gradient(45deg, blue, aqua);
    img {
      width: 50px;
      height: 50px;
    }
    ul {
      li {
        text-align: center;
      }
    }
  }
}
.xia {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 98%;
  height: 300px;
  margin-top: 10px;
  border-radius: 10px;
  background: #9fadbb;
  // background-color: blue;
  // background: #ffffef;
  .admin {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 40px;
    border-radius: 10px;
    width: 500px;
    height: 300px;
    background: white;
    .admintop {
      display: flex;
      width: 100%;
      height: 150px;
      // background-color: red;
      border-bottom: 1px solid #999999;
      img {
        width: 100px;
        height: 100px;
        margin-left: 80px;
        margin-top: 20px;
      }
      ul {
        box-sizing: border-box;
        margin-left: 80px;
        padding-top: 12px;
        li {
          margin-top: 20px;
          text-align: center;
        }
        .zxl {
          color: aqua;
          font-weight: 600;
          font-size: 25px;
        }
        .lw {
          font-size: 18px;
        }
      }
    }
    .adminxia {
      width: 100%;
      height: 100px;
      background-color: #ffffef;
      ul {
        width: 100%;
        height: 100px;
      }
      li {
        margin-top: 18px;
        margin-left: 100px;
      }
      .zzz {
        margin-left: 50px;
        .zxl {
          margin-left: 10px;
        }
      }
    }
  }
}
.iconfont {
  font-size: 30px;
}
</style>
