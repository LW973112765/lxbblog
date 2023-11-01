 <template>
  <div class="main">
    <div class="photo">
      <img :src="avatarz" alt="" />
    </div>
    <div class="center">
      <ul>
        <li>
          <i>用户名:</i><span>{{ username }}</span>
        </li>
        <li>
          <i>邮箱:</i><span>{{ email }}</span>
        </li>
        <li>
          <i>性别:</i><span>{{ sex }}</span>
        </li>
        <li>
          <i>年龄:</i><span>{{ age }}</span>
        </li>
        <li>
          <i>昵称:</i
          ><span>{{
            nickname || '"您还没有设置属于自己的昵称哦  ｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡",'
          }}</span>
        </li>
        <li>
          <i>个人介绍:</i
          ><span
            class="content"
            >{{ introduction ||  "这里还是空的，写一些介绍你吧  (๑•̀ㅂ•́)و✧", }}</span
          >
        </li>
        <li>
          <i>上次更新时间:</i><span>{{ updated_at | dateFormat }}</span>
        </li>
      </ul>
    </div>
    <div class="buttom">
      <el-button type="info" round>
        <router-link
          :to="{
            name: 'userinfoedit',
            query: {
              username: username,
              password: password,
              email: email,
              sex: sex,
              age: age,
              avatar: avatar,
              nickname: nickname,
              introduction: introduction,
              id: id,
              updated_at: updated_at,
            },
          }"
          >编辑信息</router-link
        >
      </el-button>
      <el-button @click="loginout" type="primary" round>退出登录</el-button>
    </div>
    <div class="zxl">
      <img src="../../../assets/img/1.gif" alt="" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import base from "../../../api/base";
export default {
  name: "Usercenter",
  data() {
    return {
      url: "",
      username: "",
      password: "",
      email: "",
      sex: "",
      age: "",
      avatar: "",
      avatarz: "",
      nickname: "",
      introduction: "",
      id: "",
      updated_at: "",
      userinfo1: {},
    };
  },
  mounted() {
    this.url = base.host;
    // console.log(this.userinfo1);
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
  created() {
    this.userinfo1 = JSON.parse(localStorage.getItem("username"));
    let username = this.userinfo1.username || {};
    this.$api.getUserinfo({ username }).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.data);
        this.email = res.data.data.email;
        this.sex = res.data.data.sex;
        this.age = res.data.data.age;
        this.id = res.data.data.id;
        this.updated_at = res.data.data.updated_at;
        this.password = res.data.data.password;
        this.nickname = res.data.data.nickname;
        this.username = res.data.data.username;
        this.introduction = res.data.data.introduction;
        this.avatarz = res.data.data.avatar;
        this.avatar = res.data.data.avatar;
      }
    });
  },
  methods: {
    ...mapMutations("loginModule", ["clearUser"]),
    loginout() {
      this.$confirm("此操作将退出登录？是否继续", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //清空vuex数据
          this.clearUser();
          //清空本地数据
          localStorage.removeItem("username");
          //返回登录
          this.$router.push("/");
          //刷新页面
          location.reload();
          this.$message({
            type: "success",
            message: "已退出登录!😊",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消😊",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  position: relative;
  padding-top: 10px;
  width: 583px;
  height: 550px;
  margin-top: 20px;
  margin-right: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  .photo {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
  li {
    height: auto;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .center {
    padding: 10px;
    margin-left: 200px;
    width: 300px;
    height: 100px;
    i {
      color: red;
      font-size: 18px;
    }
    span {
      color: aqua;
      font-size: 15px;
      margin-left: 10px;
    }
  }
  .buttom {
    margin-top: 180px;
    margin-left: 130px;
    padding-left: 66px;
    width: 300px;
    height: 100px;
  }
  .zxl {
    position: absolute;
    bottom: 10px;
    left: 50%;
    translate: -50%;
    width: 300px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  img {
    width: 100px;
    height: 100px;
  }
}
</style>