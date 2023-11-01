<template>
  <div>
    <div class="content" @click="goarticleinfo(item.id)">
      <div class="shang">
        <h4 v-html="item.title"></h4>
      </div>
      <div class="xia">
        <div class="left" v-show="item.cover">
          <img :src="item.cover" alt="" />
        </div>
        <div class="right">
          <p class="common-label" v-show="item.total > 300">
            热<span class="triangle" />
          </p>
          <div class="top">
            <img
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              alt=""
            />
            <span class="pl10"
              >发布人：<span style="color: #999" v-html="item.author"></span
            ></span>
            <!-- <span class="pl20">分类：{{}}</span> -->
          </div>
          <div class="center" v-html="item.introduction"></div>
        </div>
      </div>
      <div class="buttom">
        <span class="zxl1"
          ><i class="iconfont icon-pinglun" />{{ commenttotal }}</span
        >
        <span class="zxl2"
          ><i class="iconfont icon-liulanliang" />{{ item.total }}</span
        >
        <span class="timer"
          ><i class="el-icon-time" />{{ item.created_at }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      commenttotal: 0,
    };
  },
  created() {
    this.getCommentTotal(this.item.id);
  },
  methods: {
    getCommentTotal(articleid) {
      this.$api.getCommentTotal({ articleid }).then((res) => {
        if (res.data.status === 200) {
          this.commenttotal = res.data.total;
        }
      });
    },
    goarticleinfo(id) {
      this.$router.push(`/articleinfo?id=${id}`);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  position: relative;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  height: 200px;
  background-color: #fff;
  // margin-left: 10px;
  margin-bottom: 10px;
  .shang {
    padding-left: 10px;
    line-height: 30px;
    margin-bottom: 10px;
    padding-top: 10px;
    // margin-top: 20px;
    color: black;
    width: 100%;
    height: 30px;
    transition: all 0.5s;
  }
  .shang:hover {
    color: blue;
    text-decoration: underline;
    transform: translate(30px);
  }
  .xia {
    display: flex;
    position: relative;
    width: 100%;
    height: 107px;
  }
  .left {
    width: 30%;
    height: 85px;
    img {
      width: 100%;
      height: 100%;
    }
    // background-color: aqua;
  }
  .right {
    box-sizing: border-box;
    padding-left: 20px;
    width: 70%;
    height: 89px;
    .tpo,
    .center {
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
        width: 33px;
        height: 33px;
        border-radius: 50%;
      }

      .pl10 {
        padding-left: 10px;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .pl20 {
        margin-top: 10px;
        padding-left: 20px;
      }
    }
    .center {
      width: 150px;
      margin-top: 5px;
      height: 25px;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .buttom {
    height: 30px;
    padding-left: 15px;
    // margin-top: 35px;
    .timer {
      margin-left: 30px;
    }
    .zxl2 {
      margin-left: 15px;
    }
    .zxl1,
    .zxl2,
    .timer {
      display: inline-block;
      font-size: 12px;
      color: #999;
      i {
        padding-right: 5px;
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
}
</style>
