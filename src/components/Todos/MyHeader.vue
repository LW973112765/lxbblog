<template>
  <div class="todo-header">
    <input
      type="text"
      placeholder="请输入你的任务名称，按回车键确认😊"
      @keyup.enter="add"
      maxlength="15"
    />
  </div>
</template>

<script>
import { nanoid } from "nanoid";
export default {
  props: ["todos"],
  name: "MyHeader",
  methods: {
    add(e) {
      const val = e.target.value.trim();
      if (val == "") {
        return this.$message({
          message: "输入不能为空😊",
          type: "warning",
        });
      } else {
        const zxl = this.todos.some((todo) => {
          return todo.title === val;
        });
        // console.log(zxl);
        if (!zxl) {
          const todolist = { id: nanoid(), title: e.target.value, done: false };
          this.$emit("addTodo", todolist);
          e.target.value = "";
        } else {
          this.$message({
            message: "该事务已经存在啦😊",
            type: "warning",
          });
          e.target.value = "";
        }
      }
    },
  },
};
</script>

<style scoped>
/*header*/
.todo-header {
  margin-top: 5px;
  margin-bottom: 10px;
}
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}

.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
}
</style>
