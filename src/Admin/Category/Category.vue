<template>
  <div class="main">
    <el-button type="primary" round @click="add">添加分类</el-button>
    <div class="pagebox-content">
      <el-table :data="categoryList" border style="width: 100%">
        <el-table-column prop="id" label="类别编号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="类别名称"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Category",

  data() {
    return {
      categoryList: [],
    };
  },

  methods: {
    handleEdit(index, row) {
      //   console.log(index, row);
      //   this.dialogVisible = true;
      this.$prompt("请输入内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        if (!value.trim()) {
          this.$message({
            type: "error",
            message: "请填写内容",
          });
          return;
        }
        console.log("请填写内容", row);
        let params = {
          updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          name: value.trim(),
          id: row.id,
        };
        console.log("请填写内容", params);
        this.updatecategory({ ...params });
      });
    },
    updatecategory(params) {
      this.$api.updateCategory(params).then((res) => {
        if (res.data.status === 200) {
          this.$message({
            message: "编辑成功😊",
            type: "success",
          });
          this.getCategory();
        }
        if (res.data.status === 304) {
          this.$message({
            message: "类别名已存在，换一个吧😊",
            type: "warning",
          });
        }
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作请慎重, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$api.deleteCategory({ id: row.id }).then((res) => {
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getCategory();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getCategory() {
      this.$api.getCategoryList().then((res) => {
        if (res.data.status === 200) {
          res.data.data.forEach((data) => {
            data.created_at = moment(data.created_at).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            data.updated_at = moment(data.updated_at).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          console.log(res.data.data);
          this.categoryList = res.data.data;
        }
      });
    },
    add() {
      this.$prompt("请输入类别名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        if (!value.trim()) {
          this.$message({
            type: "error",
            message: "请填写内容",
          });
          return;
        }
        let params = {
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          name: value.trim(),
        };
        console.log("请填写内容", params);
        this.addcategory({ ...params });
      });
    },

    addcategory(params) {
      this.$api.addCategory({ ...params }).then((res) => {
        if (res.data.status === 200) {
          this.$message({
            message: "添加成功😊",
            type: "success",
          });
          this.getCategory();
        }
        if (res.data.status === 304) {
          this.$message({
            message: "类别名已存在，换一个吧😊",
            type: "warning",
          });
        }
      });
    },
  },
  created() {
    this.getCategory();
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-top: 29px;
  padding-left: 22px;
  padding-right: 22px;
  padding-bottom: 30px;
  width: 90%;
  min-height: 500px;
  margin: 30px auto;
  background-color: rgba(0, 0, 0, 0.5);
}
/deep/ .el-button {
  margin-bottom: 20px;
}
</style>
