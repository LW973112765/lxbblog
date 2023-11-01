<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item>
      <img src="./img/1.jpg" alt="" v-viewer/>
    </el-carousel-item>
    <el-carousel-item>
      <img src="./img/2.jpg" alt="" v-viewer/>
    </el-carousel-item>
    <el-carousel-item>
      <img src="./img/3.jpg" alt="" v-viewer/>
    </el-carousel-item>
    <el-carousel-item>
      <img src="./img/4.jpg" alt="" v-viewer/>
    </el-carousel-item>
  </el-carousel>
</template>

<style lang="less" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
img {
  width: 100%;
  height: 100%;
}
</style>
