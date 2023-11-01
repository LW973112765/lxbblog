<template>
  <div id="todos">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader @addTodo="addTodo" :todos="todos" />
        <MyList :todos="todos" />
        <!-- 自定义事件 -->
        <MyFooter
          :todos="todos"
          @checkAllTodo="checkAllTodo"
          @clearAllTodo="clearAllTodo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyFooter from "./MyFooter";
import MyHeader from "./MyHeader";
import MyList from "./MyList";
export default {
  name: "Todos",
  components: {
    MyFooter,
    MyHeader,
    MyList,
  },
  data() {
    return {
      input: "2",
      todos: JSON.parse(localStorage.getItem("todos")) || [],
    };
  },
  methods: {
    onInput() {
      this.$forceUpdate();
    },
    //添加数据
    addTodo(todoa) {
      this.todos.unshift(todoa);
    },

    //点击复选框改变done值
    changeTodo(id) {
      this.todos.forEach((todo) => {
        if (todo.id === id) todo.done = !todo.done;
      });
    },
    //删除单个消息
    handleDelete(id) {
      this.todos = this.todos.filter((todo) => {
        return todo.id !== id;
      });
    },
    //全选or全不选数据
    checkAllTodo(done) {
      this.todos.forEach((todo) => {
        todo.done = done;
      });
    },
    //删除选中的数据
    clearAllTodo() {
      this.todos = this.todos.filter((todo) => {
        return !todo.done;
      });
    },
    //编辑数据
    updateTodo(id, title) {
      this.todos.forEach((todo) => {
        if (todo.id === id) todo.title = title;
      });
    },
  },
  watch: {
    todos: {
      deep: true,
      handler(value) {
        localStorage.setItem("todos", JSON.stringify(value));
      },
    },
  },
  mounted() {
    this.$bus.$on("changeTodo", this.changeTodo);
    this.$bus.$on("handleDelete", this.handleDelete);
    this.$bus.$on("updateTodo", this.updateTodo);
  },
  beforeDestroy() {
    this.$bus.$off("changeTodo");
    this.$bus.$off("handleDelete");
    this.$bus.$off("updateTodo");
  },
};
</script>

<style>
/*base*/
body {
  background: #fff;
}
#todos {
  width: 600px;
  margin-left: -20px;
}
.todo-wrap {
  margin-top: 50px;
  margin-left: 2px;
  overflow: hidden;
}

.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}
.btn-edit {
  color: #fff;
  background-color: skyblue;
  border: 1px solid skyblue;
  margin-right: 5px;
}
.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}

.btn:focus {
  outline: none;
}

.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
@media screen and (max-width: 768px) {
  #todos {
    width: 100%;
    /* margin-left: -20px; */
  }

  .todo-container {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
