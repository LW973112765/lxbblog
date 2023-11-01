<template>
  <div class="container">
    <div class="qu-wrap">
      <header>
        <span
          @click="
            iterator = backBtn();
            iterator.next();
          "
          >&lt; 返回</span
        >
        <p v-show="!titleEditing" @click="titleEditing = true">
          {{ tempTitle }}
        </p>
        <input
          type="text"
          v-focus
          v-model="title"
          :class="{ inlineShow: titleEditing }"
          @blur="titleEditing = false"
          @keyup.esc="cancelTitleEdit()"
          @keyup.enter="updatetitle"
        />
      </header>
      <div class="qu-content">
        <section
          class="qu-item"
          v-for="(item, index) in questions"
          :key="index"
          :class="{
            nowEditing: curIndex === index && topicEditing,
            optEditing: curIndex === index,
          }"
        >
          <h3
            @click="
              curIndex = index;
              curOptIndex = '';
              topicEditing = true;
            "
          >
            <span class="qu-num">{{ `Q${index + 1}` }}</span>
            <span class="qu-topic">{{ item.topic }}</span>
            <input
              type="text"
              v-focus
              v-model="topic"
              @focus="_topic = topic"
              @blur="
                curIndex = '';
                topic = '';
              "
              @keyup.esc="cancelTopicEdit()"
              @keyup.enter="doneTopicEdit(index)"
            />
            <span v-if="item.isMandatory"> *</span>
          </h3>
          <template v-if="item.type === 'textarea'">
            <textarea rows="8" cols="80"></textarea>
          </template>
          <ul v-else class="options-list">
            <li
              v-for="(option, optIndex) in item.options"
              :key="optIndex"
              :class="{ optionEditing: curOptIndex === optIndex }"
            >
              <span
                class="optionText"
                @click="
                  curIndex = index;
                  curOptIndex = optIndex;
                  topicEditing = false;
                "
                >{{ option }}</span
              >
              <input
                type="text"
                v-focus
                v-model="optionText"
                @focus="_optionText = optionText"
                @blur="
                  curIndex = '';
                  optionText = '';
                "
                @keyup.esc="cancelOptionEdit()"
                @keyup.enter="doneOptionEdit(index, optIndex)"
              />

              <ul class="opt-ctrl">
                <li
                  v-if="optIndex !== 0"
                  @click="moveUp(optIndex, item.options)"
                >
                  上移
                </li>
                <li
                  v-if="optIndex !== item.options.length - 1"
                  @click="moveDown(optIndex, item.options)"
                >
                  下移
                </li>
                <li v-else @click="addOption(item.options)">添加</li>
                <li @click="delOption(optIndex, item.options)">删除</li>
              </ul>
            </li>
          </ul>
          <ul class="operat-list">
            <li @click="reuse(index)">复用</li>
            <li @click="delQuestion(index)">删除</li>
          </ul>
          <div></div>
        </section>
        <div class="add-box">
          <p class="qu-type" :class="{ expand: isAdding }">
            <span @click="addType('radio')">单选题</span>
            <span @click="addType('checkbox')">多选题</span>
            <span @click="addType('textarea')">文本题</span>
          </p>

          <p class="add-btn" @click="isAdding = !isAdding">
            <span>+ 添加问题</span>
          </p>
        </div>
      </div>
      <footer>
        <div class="ctrl-part">
          <span
            @click="
              iterator = releaseBtn();
              iterator.next();
            "
            >保存并发布</span
          >
        </div>
      </footer>
    </div>
    <div class="overlay" v-show="isShowPrompt">
      <div class="prompt-box">
        <header>
          <span>提示</span>
          <a href="javascript:;" @click="isShowPrompt = false"></a>
        </header>
        <p>{{ promptText }}</p>
        <footer>
          <span
            @click="
              isShowPrompt = false;
              iterator && iterator.next();
            "
            >确定</span
          >
          <span @click="isShowPrompt = false">取消</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Data from "./data.js";
import moment from "moment";
export default {
  name: "Edit",
  components: {},
  data() {
    return {
      index: "",
      questions: [],
      questionTemplate: {},
      quList: [],
      date: "",
      title: "",
      _title: "",
      topic: "",
      _topic: "",
      optionText: "",
      _optionText: "",
      curIndex: "",
      curOptIndex: "",
      promptText: "",
      iterator: {},
      isAdding: false,
      titleEditing: false,
      topicEditing: false,
      isShowPrompt: false,
      isShowDatepicker: false,
      mytitle: "",
    };
  },

  created() {
    this.getData();
  },
  mounted() {
    this.$message({
      showClose: true,
      message: "编辑内容之后按Enter保存哦😊",
    });
  },
  computed: {},

  computed: {
    tempTitle() {
      return this.title || "点击我修改问卷标题";
    },
  },
  methods: {
    getData() {
      let id = this.$route.params.id;

      if (id === 0) {
        let item = {};
        item.id = this.quList.length + 1;
        item.title = `问卷调查${item.id}`;
        item.state = 0;
        item.stateName = "未发布";
      }

      this.questionTemplate = Data.template;
    },
    updatetitle() {
      if (this.title == "")
        this.$message({
          message: "编辑内容不能为空哦😊",
          type: "warning",
        });
      else {
        this.titleEditing = false;
        this.mytitle = this.title;
        console.log(this.$forceUpdatemytitle, "mytitle");
      }
    },

    cancelTitleEdit() {
      this.titleEditing = false;
      this.title = this._title;
    },

    cancelTopicEdit() {
      this.topicEditing = false;
      this.topic = this._topic;
    },

    cancelOptionEdit() {
      this.curOptIndex = "";
      this.optionText = this._optionText;
    },

    doneTopicEdit(index) {
      if (this.topic == "")
        this.$message({
          message: "编辑内容不能为空哦😊",
          type: "warning",
        });
      else {
        this.topicEditing = false;
        this.questions[index].topic = this.topic;
      }
    },

    doneOptionEdit(index, optIndex) {
      if (this.optionText == "")
        this.$message({
          message: "编辑内容不能为空哦😊",
          type: "warning",
        });
      else {
        this.curOptIndex = "";
        this.questions[index].options[optIndex] = this.optionText;
      }
    },

    switchItem(index, array) {
      this.optIndex = "";
      this.curIndex = "";

      let arr = array.splice(index, 2);
      array.splice(index, 0, ...arr.reverse());
    },

    moveUp(index, array) {
      this.switchItem(index - 1, array);
    },

    moveDown(index, array) {
      this.switchItem(index, array);
    },

    errorPrompt(text) {
      this.iterator = null;
      this.showPrompt(text);
    },

    reuse(index) {
      if (this.questions.length === 10) {
        this.errorPrompt(`每份问卷至多10个问题！`);
        return;
      }
      let oldQuestion = this.questions[index];
      let newQuestion = JSON.parse(JSON.stringify(oldQuestion));
      this.questions.splice(index, 0, newQuestion);
    },

    delQuestion(index) {
      if (this.questions.length <= 1) {
        this.errorPrompt(`每份问卷至少一个问题！`);
        return;
      }
      this.questions.splice(index, 1);
    },

    delOption(index, options) {
      if (options.length <= 2) {
        this.errorPrompt(`每个问题至少两个选项`);
        return;
      }
      options.splice(index, 1);
    },

    addOption(options) {
      if (options.length === 7) {
        this.errorPrompt(`每个问题至多七个选项`);
        return;
      }
      options.push(`请编辑选项内容`);
    },

    showPrompt(text) {
      this.promptText = text;
      this.isShowPrompt = true;
    },

    addType(type) {
      if (this.questions.length === 50) {
        this.errorPrompt(`每份问卷至多10个问题！`);
        return;
      }
      this.questions.push(this.questionTemplate[type]);
    },

    saveData() {
      if (this.questions.length < 1) {
        this.errorPrompt(`每份问卷至少一个问题！`);
        return;
      }

      this.quData.title = this.title;
      this.quData.questions = [...this.questions];

      if (this.index === this.quList.length) {
        this.quList.push(this.quData);
      } else {
        this.quList.splice(this.index, 1, this.quData);
      }
    },

    *backBtn() {
      this.$confirm("确认未保存返回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push("/admin/questionmanage");
        })
        .catch(() => {});
    },

    *releaseBtn() {
      this.questions.forEach((item) => {
        this.$set(item, "answer", []);
      });
      console.log("嘿嘿嘿", this.questions);
      if (this.questions.length == 0) {
        this.$message({
          showClose: true,
          message: "至少有一个题目哦😊",
          type: "warning",
        });
      } else if (this.title == "") {
        this.$message({
          showClose: true,
          message: "还未设置问卷标题哦😊",
          type: "warning",
        });
      } else {
        this.$confirm("是否发布该问卷", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let question = {
              title: this.title,
              endtime: moment().format("YYYY-MM-DD HH:mm:ss"),
              questions: JSON.stringify(this.questions),
            };
            this.$api.AddQuestion(question).then((res) => {
              if (res.data.status === 200) {
                this.$message({
                  message: "发布成功",
                  type: "success",
                });
                this.$router.push("/admin/questionmanage");
              }
            });
          })
          .catch(() => {});
      }
      // else{yield this.showPrompt(`确认要保存并发布问卷？`);}
    },
  },

  directives: {
    focus: {
      update: (el) => el.focus(),
    },
  },
};
</script>

<style scoped>
@import "./_Edit.css";
</style>
