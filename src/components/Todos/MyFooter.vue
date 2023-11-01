<template>
  <div class="todo-footer" v-show="todos.length">
    <label>
      <input type="checkbox" style="zoom: 150%" v-model="isAll" />
    </label>
    <span>
      <span ref="zero">已完成{{ doneTotal }}</span> / 全部{{
        todos.length
      }}</span
    >
    <button class="btn btn-danger" @click="clearAll">清除已完成任务</button>
  </div>
</template>

<script>
export default {
  name: "MyFooter",
  props: ["todos"],
  computed: {
    doneTotal() {
      return this.todos.reduce(
        (pre, current) => pre + (current.done ? 1 : 0),
        0
      );
    },
    isAll: {
      get() {
        return this.doneTotal === this.todos.length && this.todos.length > 0;
      },
      set(value) {
        this.$emit("checkAllTodo", value);
      },
    },
  },
  methods: {
    /* checkAll(e) {
      this.checkAllTodo(e.target.checked);
    },*/
    clearAll() {
      if (this.doneTotal <= 0)
        this.$message({
          message: "你还没有选择数据哦😊",
          type: "warning",
        });
      else {
        this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$emit("clearAllTodo");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }

      // (confirm("确定清除选中数据吗😊")) this.$emit("clearAllTodo");
    },
  },
};
</script>
 
<style scoped>
/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>