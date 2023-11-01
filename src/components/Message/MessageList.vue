<template>
  <div class="messageList">
    <ul class="ul">
      <li class="li">
        <div class="li-item">
          <img class="img" :src="item.avatar" />
          <div class="top">
            <div class="lw">
              <span
                v-show="item.senderid == userinfo.id"
                @click="deleteMessage(item.id)"
                ><i class="el-icon-delete"></i
              ></span>
            </div>
            <div class="fw username">
              <span>{{ item.username }}</span
              ><span class="email">{{ item.email }}</span>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="value">
              {{ item.created_at | dateFormat }}
            </div>
            <ul>
              <li v-for="code in commentList" :key="code.id">
                <div class="li-item">
                  <img class="img" :src="code.avatar" alt="" />
                  <div class="top">
                    <div class="nickanme">
                      <span class="fw">管理员{{ code.answername }}</span>
                      <span> 回复 {{ code.username }}: </span>
                      <div class="replycontent">{{ code.content }}</div>
                    </div>
                    <div class="value">
                      {{ code.created_at | dateFormat }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["item"],
  data() {
    return {
      textarea1: "",

      commentList: [],
    };
  },
  created() {
    this.getcomment(1, this.item.id);
  },
  mounted() {
    console.log("留言收到的id", this.item, this.item.id);
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  methods: {
    getcomment(page, id) {
      this.$api.getMessageAnswer({ page, id }).then((res) => {
        if (res.data.status === 200) {
          console.log("数据", res.data);
          this.commentList = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    deleteMessage(id) {
      this.$confirm("确定要删除该留言吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.deleteMessage({ id }).then((res) => {
            if (res.data.status === 200) {
              this.$message({
                message: "删除成功😊",
                type: "success",
              });
              this.$emit("updatalist", "宝宝");
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
  },
};
</script>

<style lang="less" scoped>
.messageList {
  width: 100%;
  height: auto;
}
.callback {
  color: #337ab7;
  font-size: 14px;
}

.ul {
  padding: 0 30px;
}

.fw {
  font-weight: 900;
}
.replycontent {
  margin: 4px 0;
}
.username {
  font-size: 12px;
  margin-bottom: 4px;
}
.content {
  margin-bottom: 4px;
  color: #555;
}
.email {
  margin-left: 10px;
}
ul {
  color: #333;
  font-size: 14px;
  li {
    margin-bottom: 10px;
    .li-item {
      display: flex;
    }
    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .top {
      position: relative;
      flex: 1;
      padding-left: 15px;
    }
    .value {
      margin-bottom: 10px;
    }
  }
}
.lw {
  position: absolute;
  top: 5px;
  right: 30px;
  i {
    font-size: 20px;
    color: #999;
  }
  span {
    margin-left: 5px;
    padding-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
.fatherinput {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fatherinput .zxl {
  background: -webkit-linear-gradient(left, blue, #999999);
  color: red;
  display: inline-block;
  text-align: center;
  margin-left: 10px;
  border-radius: 50%;
  width: 60px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.fatherinput .el-icon-close {
  font-size: 18px;
  cursor: pointer;
  margin-left: 15px;
}
</style>
