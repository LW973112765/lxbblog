<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div class="top"><img src="../../assets/img/contact.jpg" alt="" /></div>
      <div class="center">狼小宝</div>
      <div class="xia">
        <!-- <img src="../../assets/img/qq.png" alt="" />
        <img src="../../assets/img/wechat.png" alt="" /> -->
        <el-popover placement="bottom" width="200" trigger="hover">
          <slot name="content">
            <img class="modelImg" src="../../assets/img/qq.jpg" alt="" />
          </slot>
          <img slot="reference" src="../../assets/img/qq.png" />
        </el-popover>
        <el-popover placement="bottom" width="200" trigger="hover"
          ><slot name="content">
            <img class="modelImg" src="../../assets/img/weixin.jpg" alt="" />
          </slot>
          <img slot="reference" src="../../assets/img/wechat.png" />
        </el-popover>
      </div>
    </div>
  </transition>
</template>

<script>
import "animate.css";
export default {};
</script>

<style lang="less" scoped>
.main {
  // position: absolute;
  margin-top: -5px;
  width: 300px;
  height: 200px;
  padding-top: 10px;
  background: #fff2ff;
  .top {
    // position: absolute;
    // left: 50%;
    margin: 0 auto;
    // margin-top: 10px;
    // transform: translate(-50%);
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .center {
    margin: 0 auto;
    margin-top: 20px;
    font-size: 19px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    color: #999999;
    font-weight: 600;
    text-align: center;
  }
  .xia {
    z-index: 0;
    position: absolute;
    width: 100px;
    height: 40px;
    left: 52%;
    transform: translate(-50%);
    margin-top: 10px;
    img {
      margin-right: 5px;
      margin-left: 10px;
      width: 30px;
      height: 30px;
    }
  }
}
.modelImg {
  width: 200px;
  height: 200px;
}
</style>