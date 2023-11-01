 <template>
  <div class="zzz">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="收藏中心" name="first">
        <Collection />
      </el-tab-pane>
      <el-tab-pane label="基本资料" name="second">
        <Basic />
        ></el-tab-pane
      >
      <el-tab-pane label="评论管理" name="third">
        <Comment />
      </el-tab-pane>
      <el-tab-pane label="我的留言" name="fourth">
        <Message />
      </el-tab-pane>
      <el-tab-pane label="我的病历" name="fifth" v-if="0">
        <MyRecord />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Basic from "./Basic";
import Comment from "./Comment";
import Message from "./Message";
import Collection from "./Collection";
import MyRecord from "./MyRecord";

export default {
  name: "Usercenter",
  data() {
    return {
      activeName: "first",
    };
  },
  components: { Basic, Comment, Message, Collection , MyRecord },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
.zzz {
  margin-top: 50px;
}
/deep/ .el-tabs__item {
  color: aqua;
  font-size: 18px;
  text-align: center;
  width: 205px;
  left: 0;
  right: 0;
}
/deep/ .el-tabs__item:hover {
  color: red;
}
/deep/ .el-tabs__item.is-active {
  color: blue;
}
/deep/ .el-tabs__nav-wrap {
  width: 582px;
}
/deep/.el-icon-arrow-left:before {
  color: red;
  font-size: 20px;
}
/deep/.el-icon-arrow-right:before {
  color: red;
  font-size: 20px;
}
</style>