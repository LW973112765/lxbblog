<template>
  <!-- 内容区域，路由出口 -->
  <div class="content">
    <keep-alive include="ArticleLists,UserList">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "Content",
};
</script>

<style lang="less" scoped></style>
