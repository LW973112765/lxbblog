<template>
  <!-- 内容区域，路由出口 -->
  <div class="content">
    <keep-alive include="Article">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "Content",
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  width: 10px;
  height: 20px;
  background-color: gray;
}
::-webkit-scrollbar-track {
  background: #ecec54;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f0bbc3, #10a44a);
  border-radius: 10px;
}
.content {
  position: relative;
  z-index: -1;
  flex: 1;
  margin-top: 15px;
  max-height: 50px;
  margin-right: 400px;
  margin-left: 380px;
}
@media screen and (max-width: 768px) {
  .content {
    position: relative;
    z-index: -1;
    flex: 1;
    width: 100%;
  }
}
</style>
