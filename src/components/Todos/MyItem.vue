<template>
  <transition name="todo" appear>
    <li>
      <label>
        <input
          type="checkbox"
          style="zoom: 150%"
          :checked="zxl.done"
          @change="handleChecked(zxl.id)"
        />
        <span class="title" v-show="!zxl.isEdit">{{ zxl.title }}</span>
        <input
          type="text"
          :value="zxl.title"
          v-show="zxl.isEdit"
          @blur="handleBlur(zxl, $event)"
          ref="inputTitle"
        />
      </label>
      <span class="time">创建于：{{ zxl.time | dateFormat }}</span>
      <button class="btn btn-danger" @click="handleDel(zxl.id)">删除</button>
      <button
        class="btn btn-edit"
        @click="handleEdit(zxl)"
        v-show="!zxl.isEdit"
      >
        编辑
      </button>
    </li>
  </transition>
</template>
<script>
export default {
  name: "MyItem",
  props: ["zxl", "changeTodo", "handleDelete"],
  methods: {
    handleChecked(id) {
      console.log(id);
      this.$bus.$emit("changeTodo", id);
    },

    //删除单个数据
    handleDel(id) {
      this.$confirm("此操作将永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$bus.$emit("handleDelete", id);
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
      // if (confirm("确定删除吗😊")) {
      //   this.$bus.$emit("handleDelete", id);
      // }
    },
    //编辑数据
    handleEdit(zxl) {
      if (zxl.hasOwnProperty("isEdit")) {
        zxl.isEdit = true;
      } else this.$set(zxl, "isEdit", true);
      // setTimeout(() => {
      //   this.$refs.inputTitle.focus();
      // }, 200);
      this.$nextTick(() => {
        this.$refs.inputTitle.focus();
      });
    },
    handleBlur(zxl, e) {
      zxl.isEdit = false;
      if (!e.target.value.trim())
        return this.$message({
          message: "输入不能为空😊",
          type: "warning",
        });
      this.$bus.$emit("updateTodo", zxl.id, e.target.value);
    },
  },
};
</script>

<style scoped>
/*item*/
li {
  position: relative;
  list-style: none;
  height: 60px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
  background-color: rgba(0, 0, 0, 0.3);
}

li label {
  font-size: 18px;
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  font-size: 18px;
  margin-right: 6px;
  position: relative;
  top: -1px;
}
li button {
  float: right;
  display: none;
  margin-top: 3px;
}
.title {
  margin-left: 5px;
  color: plum;
}

.time {
  height: 25px;
  width: 250px;
  line-height: 25px;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  translate: -50%;
  top: 30px;
  background-color: #999999;
  padding-left: 15px;
}
li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
li:hover {
  background-color: #ddd;
}
li:hover button {
  display: block;
}
.todo-enter-active {
  animation: zxl 0.5s linear;
}

.todo-leave-active {
  animation: zxl 0.5s linear reverse;
}

@keyframes zxl {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
