<template>
  <div class="menu">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="rgba(0,0,0,0.5)"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/admin/home">
        <i class="iconfont icon-shouye"></i>
        <span slot="title">
          <router-link to="/admin/home"> 首页</router-link>
        </span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont icon-yonghu"></i>
          <span> 用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/userlist">
            <router-link to="/admin/userlist">用户信息 </router-link>
          </el-menu-item>
          <el-menu-item index="admin/adduser">
            <router-link to="/admin/adduser">添加用户</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" v-if="admininfo.type == 1">
        <template slot="title">
          <i class="iconfont icon-guanliyuan"></i>
          <span> 管理员管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/adminlist">
            <router-link to="/admin/adminlist">管理员信息 </router-link>
          </el-menu-item>
          <el-menu-item index="admin/addadmin">
            <router-link to="/admin/addadmin">添加管理员</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont icon-tupian"></i>
          <span> 相册管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/photolist">
            <router-link to="/admin/photolist">相册信息</router-link>
          </el-menu-item>
          <el-menu-item index="/admin/addphoto">
            <router-link to="/admin/addphoto">添加相册</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="iconfont icon-shipin"></i>
          <span> 视频管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/videolist">
            <router-link to="/admin/videolist">视频信息</router-link>
          </el-menu-item>
          <el-menu-item index="/admin/addvideo">
            <router-link to="/admin/addvideo">添加视频</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <i class="iconfont icon-yinle"></i>
          <span> 音乐管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/admin/musiclist">
            <router-link to="/admin/musiclist">音乐信息</router-link>
          </el-menu-item>
          <el-menu-item index="/admin/addmusic">
            <router-link to="/admin/addmusic">添加音乐</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/admin/versionlist">
        <i class="iconfont icon-guanyu-banben"></i>
        <span slot="title">
          <router-link to="/admin/versionlist"> 版本管理</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/admin/articlelist">
        <i class="iconfont icon-16"></i>
        <span slot="title">
          <router-link to="/admin/articlelist"> 文章管理</router-link>
        </span>
      </el-menu-item>

      <el-menu-item index="/admin/recordlist" v-if="0">
        <i class="iconfont icon-wenjuanzhongxin"></i>
        <span slot="title">
          <router-link to="/admin/recordlist"> 病历管理</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/admin/questionmanage">
        <i class="iconfont icon-wenjuanguanli1"></i>
        <span slot="title">
          <router-link to="/admin/questionmanage"> 问卷管理</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/admin/chatlist">
        <i class="iconfont icon-xiaoxi2"></i>
        <span slot="title">
          <router-link to="/admin/chatlist"> 消息中心</router-link>
        </span>
        <span v-if="total" class="tag">{{ total <= 99 ? total : "99+" }}</span>
      </el-menu-item>
      <el-menu-item index="/admin/category">
        <i class="iconfont icon-fenlei"></i>
        <span slot="title">
          <router-link to="/admin/category"> 类别管理</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/admin/comments">
        <i class="iconfont icon-shequpinglun"></i>
        <span slot="title">
          <router-link to="/admin/comments"> 评论管理</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/admin/message">
        <i class="iconfont icon-liuyan"></i>
        <span slot="title">
          <router-link to="/admin/message"> 留言管理</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/admin/system">
        <i class="iconfont icon-xiugaimima"></i>
        <span slot="title">
          <router-link to="/admin/system"> 修改密码</router-link>
        </span>
      </el-menu-item>
      <el-menu-item index="/home">
        <i class="iconfont icon-fanhui"></i>
        <span slot="title">
          <router-link to="/home"> 返回前台</router-link>
        </span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Mymenu",
  props: ["admin"],
  data() {
    return {
      total: "",
    };
  },
  computed: {
    ...mapState("AdminLogin", ["admininfo"]),
  },
  mounted() {
    setInterval(() => {
      this.gettotal();
    }, 5000);
  },
  created() {
    this.gettotal();
  },
  methods: {
    gettotal() {
      this.$api.GetChatNoTotal({ senderid: this.admininfo.id }).then((res) => {
        if (res.data.status == 200)
          console.log("total", res.data.data[0].total);
        this.total = res.data.data[0].total;
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //element-ui导航菜单使用刷新后高亮显示不一致完美解决办法
    handleSelect(key, keyPath) {
      this.$router.push(key);
    },
  },
};
</script>

<style lang="less" scoped>
span {
  width: 100%;
}
/deep/ .el-submenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 45px;
  min-width: 56px;
}
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
.tag {
  position: absolute;
  top: 15px;
  left: 0px;
  width: auto;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(to right, red, blue);
  color: white;
  text-align: center;
  line-height: 20px;
}
.menu {
  position: fixed;
  overflow: auto;
  top: 36px;
  bottom: 0;
  width: 200px;
  height: auto;
  background-color: rgba(0, 0, 0, 0.8);
}
@media screen and (max-width: 768px) {
  .menu {
    position: fixed;
    overflow: auto;
    top: 36px;
    bottom: 0;
    // width: 0;
    height: auto;
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
