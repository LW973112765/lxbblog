<template>
  <transition
    appear
    name="animate__animated animate__bounce"
    enter-active-class="animate__backInUp"
    leave-active-class="animate__backOutDown"
  >
    <div class="main">
      <div class="content">
        <header>{{ quData.title }}</header>
        <p @click="fanhui">返回</p>
        <div class="qu-content">
          <section
            class="qu-item"
            v-for="(item, index) in questions"
            :key="index"
          >
            <h3>
              {{ `Q${index + 1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.topic}` }}
              <span v-if="item.isMandatory"> *</span>
            </h3>
            <textarea
              rows="8"
              cols="80"
              v-if="item.type === 'textarea'"
              required
              @change="textareaAnswer($event, index)"
            >
            </textarea>
            <ul v-else class="options-list">
              <li v-for="(option, optIndex) in item.options" :key="optIndex">
                <label>
                  <input
                    required
                    v-if="item.type === 'radio'"
                    :type="item.type"
                    :name="index + 1"
                    @change="radioAnswer($event, optIndex, index)"
                  />
                  <input
                    required
                    v-else
                    :type="item.type"
                    :name="index + 1"
                    @change="checkboxAnswer($event, optIndex, index)"
                  />
                  <span>{{ option }}</span>
                </label>
              </li>
            </ul>
          </section>
        </div>
        <footer>
          <span id="submitBtn" @click="submit">提交问卷</span>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Fill",
  data() {
    return {
      quData: {},
      questions: [],
      promptText: "",
      isShowPrompt: false,
    };
  },

  created() {
    this.getData();
    console.log(this.$route, "朱晓亮");
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
  },

  methods: {
    fanhui() {
      this.$confirm("退出后不保存数据, 是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push("/question");
        })
        .catch(() => {});
    },
    getData() {
      this.quData = this.$route.query.question;
      this.questions = JSON.parse(this.$route.query.question.questions);
    },

    // showPrompt(text) {
    //   this.promptText = text;
    //   this.isShowPrompt = true;
    // },
    //selectionindex是当前选项的索引号
    //questionindex是当前题目的索引号
    checkboxAnswer(event, selectionindex, questionindex) {
      if (event.target.checked) {
        console.log(
          "当前是第" + questionindex + "题",
          "选中答案第" + selectionindex + "个"
        );
        this.questions[questionindex].answer.push(selectionindex);
        // console.log(this.questions[questionindex].options[selectionindex],'this.questions');
        console.log("答案" + this.questions[questionindex].answer);
      } else {
        console.log(
          "当前是第" + questionindex + "题",
          "选中答案第" + selectionindex + "个"
        );
        this.questions[questionindex].answer.splice(
          this.questions[questionindex].answer.indexOf(selectionindex),
          1
        );
        // console.log(this.questions[questionindex].options[selectionindex],'this.questions');
        console.log("答案" + this.questions[questionindex].answer);
      }
    },
    radioAnswer(event, selectionindex, questionindex) {
      if (event.target.checked) {
        console.log(
          "当前是第" + questionindex + "题",
          "选中答案第" + selectionindex + "个"
        );
        this.questions[questionindex].answer.pop(selectionindex);
        this.questions[questionindex].answer.push(selectionindex);
        // console.log(this.questions[questionindex].options[selectionindex],'this.questions');
        console.log("答案" + this.questions[questionindex].answer);
        console.log("this.questiond是数组", Array.isArray(this.questions));
        console.log(this.questions[questionindex].answer, "文本域答案");
      }
    },
    textareaAnswer(event, questionindex) {
      this.questions[questionindex].answer = event.target.value;
      console.log(event.target.value, "文本域", questionindex);
      console.log(this.questions);
    },
    submit() {
      let answerall = this.questions.every((item, index) => {
        if (item.answer.length === 0) alert("第" + (index + 1) + "题未答");
        return item.answer.length > 0;
      });
      console.log(answerall, "answer");
      if (answerall) {
        let useranswer = {
          questionid: this.$route.query.question.questionid,
          username: this.userinfo.username,
          avatar: this.userinfo.avatar,
          email: this.userinfo.email,
          age: this.userinfo.age,
          sex: this.userinfo.sex,
          sendtime: moment().format("YYYY-MM-DD HH:mm:ss"),
          questions: JSON.stringify(this.questions),
        };
        this.$api.SendQuestion(useranswer).then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.$router.push("/question");
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.show {
  display: block;
}

.main {
  box-sizing: border-box;
  position: relative;
  font-size: 16px;

  padding-bottom: 20px;
  width: 600px;
  height: auto;
  margin: 50px auto;
}

.content {
  width: 100%;
  margin-top: 30px;
  margin-right: 40px;
  background-color: #fff;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.overlay .prompt-box {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 32rem;
  height: 18rem;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
}

.overlay .prompt-box header {
  display: flex;
  height: 4rem;
  padding: 0 2rem;
  font-weight: 700;
  line-height: 4rem;
  background-color: #f2f2f2;
  justify-content: space-between;
}

.overlay .prompt-box header a {
  color: #555;
}

.overlay .prompt-box header a:hover {
  color: #f07600;
}

.overlay .prompt-box p {
  padding: 3rem 2rem 4rem 2rem;
}

.overlay .prompt-box footer {
  text-align: center;
}

.overlay .prompt-box footer span {
  display: inline-block;
  width: 7.5rem;
  height: 2.5rem;
  font-size: 1.2rem;
  line-height: 2.5rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.overlay .prompt-box footer span:hover {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
  box-shadow: 0 0 8px #f07600;
}

.overlay .prompt-box footer span {
  width: 7rem;
  margin: 0.5rem;
}

.overlay .prompt-box footer span:nth-of-type(1) {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
}

.overlay .prompt-box footer span:nth-of-type(2) {
  color: #555;
  background-color: #fff;
}

.overlay .prompt-box footer span:nth-of-type(2):hover {
  border-color: #ccc;
  box-shadow: 0 0 8px #ccc;
}

/*
* @Author: NiceMing
* @Date:   2020-03-07 19:47:50
*/
/*
* @Author: NiceMing
* @Date:   2020-03-06 19:29:50
*/
.show {
  display: block;
}

p {
  cursor: pointer;
}

header {
  height: 30px;
  background-color: orange;
  text-align: center;
  line-height: 30px;
  color: white;
  margin-bottom: 5px;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.overlay .prompt-box {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 32rem;
  height: 18rem;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
}

.overlay .prompt-box header {
  display: flex;
  height: 4rem;
  padding: 0 2rem;
  font-weight: 700;
  line-height: 4rem;
  background-color: #f2f2f2;
  justify-content: space-between;
}

.overlay .prompt-box header a {
  color: #555;
}

.overlay .prompt-box header a:hover {
  color: #f07600;
}

.overlay .prompt-box p {
  padding: 3rem 2rem 4rem 2rem;
}

.overlay .prompt-box footer {
  text-align: center;
}

.overlay .prompt-box footer span {
  display: inline-block;
  width: 7.5rem;
  height: 2.5rem;
  font-size: 1.2rem;
  line-height: 2.5rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.overlay .prompt-box footer span:hover {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
  box-shadow: 0 0 8px #f07600;
}

.overlay .prompt-box footer span {
  width: 7rem;
  margin: 0.5rem;
}

.overlay .prompt-box footer span:nth-of-type(1) {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
}

.overlay .prompt-box footer span:nth-of-type(2) {
  color: #555;
  background-color: #fff;
}

.overlay .prompt-box footer span:nth-of-type(2):hover {
  border-color: #ccc;
  box-shadow: 0 0 8px #ccc;
}

.container {
  width: 100rem;
  margin: 6rem auto;
  color: #555;
}

.qu-wrap {
  box-sizing: border-box;
  padding: 2rem;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px #ccc;
}

.qu-wrap > header {
  position: relative;
  height: 5rem;
  margin: 0 2rem 2rem 2rem;
  line-height: 5rem;
  text-align: center;
}

.qu-wrap > header span {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.qu-wrap > header span:hover {
  color: #f07600;
}

.qu-wrap > header p,
.qu-wrap > header input {
  width: 50rem;
  margin: 0 auto;
  font-size: 1.8rem;
  font-weight: 700;
}

.qu-wrap > header p:hover {
  background-color: #fcf0e5;
}

.qu-wrap > header input {
  display: none;
  height: 100%;
  text-align: center;
  border: none;
  outline: none;
  background-color: #ccc;
}

.qu-wrap > header input.inlineShow {
  display: inline-block;
}

.qu-content {
  padding: 2rem;
  border-top: 2px solid #bbb;
  border-bottom: 2px solid #bbb;
}

.qu-content .qu-item {
  position: relative;
  margin: 1rem 0;
  padding: 1rem 2rem;
}

.qu-content .qu-item:hover {
  background-color: #fcf0e5;
}

.qu-content .qu-item:hover .operat-list {
  display: flex;
}

.qu-content .qu-item:hover div:last-of-type {
  display: none;
}

.qu-content .qu-item:hover #require-check {
  display: block;
}

.qu-content .qu-item h3 {
  height: 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2rem;
}

.qu-content .qu-item h3 > input {
  display: none;
  width: 15rem;
  height: 2rem;
  font-size: 1.4rem;
  border: none;
  outline: none;
  background-color: #ccc;
}

.qu-content .qu-item div:last-of-type {
  height: 2rem;
}

.qu-content .qu-item .qu-num {
  display: inline-block;
  width: 2.5rem;
  margin-right: 1rem;
}

.qu-content .qu-item.nowEditing .qu-topic {
  display: none;
}

.qu-content .qu-item.nowEditing h3 > input {
  display: inline-block;
}

.qu-content .qu-item.optEditing .optionEditing .optionText {
  display: none;
}

.qu-content .qu-item.optEditing .optionEditing > input {
  display: inline-block;
}

.qu-content .options-list > li {
  height: 2rem;
  margin: 1rem 0 0 4rem;
  line-height: 2rem;
}

.qu-content .options-list > li:hover ul {
  display: inline-flex;
  margin-left: 2rem;
}

.qu-content .options-list > li:hover li {
  margin-left: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.qu-content .options-list > li:hover li:hover {
  color: #f07600;
}

.qu-content .options-list > li > ul {
  display: none;
}

.qu-content .options-list > li > input {
  display: none;
  width: 15rem;
  height: 2rem;
  font-size: 1.4rem;
  border: none;
  outline: none;
  background-color: #ccc;
}

.qu-content textarea {
  margin: 1rem 0 0 4rem;
  resize: none;
  width: 400px;
}

.qu-content .operat-list {
  display: none;
  height: 2rem;
  justify-content: flex-end;
}

.qu-content .operat-list li {
  margin-right: 1rem;
  cursor: pointer;
}

.qu-content .operat-list li:hover {
  color: #f07600;
}

.add-box {
  border: 1px solid #ccc;
}

.add-box .qu-type,
.add-box .add-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-box .qu-type {
  overflow: hidden;
  height: 0;
  transition: height 0.5s;
}

.add-box .qu-type.expand {
  height: 7rem;
}

.add-box .qu-type span {
  margin: 0 1rem;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #eee;
}

.add-box .qu-type span:hover {
  background-color: #ccc;
}

.add-box .add-btn {
  padding: 2rem 0;
  font-size: 2rem;
  cursor: pointer;
  background-color: #eee;
}

.add-box .add-btn:hover {
  background-color: #ccc;
}

.qu-wrap > footer {
  display: flex;
  padding: 2rem 8rem;
  justify-content: space-between;
}

.qu-wrap > footer .date-part {
  position: relative;
}

.qu-wrap > footer .date-part input {
  display: inline-block;
  box-sizing: border-box;
  width: 24rem;
  margin-left: 1.5rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  border: 1px solid #ccc;
  outline: none;
}

.qu-wrap > footer .ctrl-part span {
  display: inline-block;
  width: 7.5rem;
  height: 2.5rem;
  font-size: 1.2rem;
  line-height: 2.5rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}

.qu-wrap > footer .ctrl-part span:hover {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
  box-shadow: 0 0 8px #f07600;
}

.qu-wrap > footer .ctrl-part span {
  margin: 0 1rem;
}

.qu-wrap > footer .ctrl-part span:nth-of-type(2) {
  color: #fff;
  border-color: #c26206;
  background-color: #f07600;
}

.qu-wrap > footer .ctrl-part span:nth-of-type(1) {
  color: #555;
  background-color: #fff;
}

.qu-wrap > footer .ctrl-part span:nth-of-type(1):hover {
  border-color: #ccc;
  box-shadow: 0 0 8px #ccc;
}

#date-picker {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
}

#require-check {
  position: absolute;
  top: 1rem;
  right: 2rem;
  display: none;
}

.qu-wrap > header p:hover {
  background-color: #fff;
}

#submitBtn {
  width: 8rem;
  height: 3rem;
  margin-left: 290px;
  line-height: 3rem;
  cursor: pointer;
  text-align: center;
  color: #fff;
  cursor: pointer;
  color: #fff;
  border: 1px solid #c26206;
  border-radius: 5px;
  background-color: #f07600;
}

#submitBtn:hover,
#backBtn:hover {
  box-shadow: 0 0 8px #f07600;
}
</style>
