<template>
  <div style="text-align: center; margin: 20px" class="page">
    <el-pagination
      :page-size="pageSize"
      layout="total,prev, pager, next, jumper"
      :total="total"
      @current-change="changePage"
      :current-page="currentPage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Mypage",
  props: {
    total: {
      type: Number,
      default: 100,
    },
    pageSize: {
      type: Number,
      default: 5,
    },
    currentPage: {
      type: Number,
    },
  },

  methods: {
    changePage(page) {
      this.$emit("changePage", page);
    },
  },
  mounted() {
    // console.log("分页中的pageSize", this.pageSize);
    // console.log("分页中的total", this.total);
  },
};
</script>

<style lang="less" scoped>
</style>