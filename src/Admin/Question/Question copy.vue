<template>
    <transition
      appear
      name="animate__animated animate__bounce"
      enter-active-class="animate__backInUp"
      leave-active-class="animate__backOutDown"
    >
      <div class="main">
        <div class="content">
          <header>问卷管理</header>
          <el-button type="warning" round class="btn" @click="addquestion">+新增问卷</el-button>
          <div class="warpper">
      <el-table :data="questionList" border style="width: 100%">
        <el-table-column
          prop="questionid"
          label="问卷编号"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endtime"
          label="发布时间"
          align="center"
          width="200"
        >
      
        </el-table-column>
        
        <el-table-column
          prop="people"
          label="提交人数"
          align="center"
        >
      
        </el-table-column>

        
       
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
           
           
          <router-link :to="{
            path: '/admin/questionanswerlist',
            query: {
              id: scope.row.questionid,
              title: scope.row.title
            }
          }">  <el-button
              round
              type="info"
              >查看</el-button
            ></router-link>
            <el-button
              round
              type="danger"
              @click="detail(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
        </div>
      </div>
    </transition>
  </template>
  <script>
  import "animate.css";
  import moment from "moment";
  export default {
    name: "Question",
    components: { },
    data() {
      return {
        questionList:[]
      };
    },
  
    created() {
        this.getQuestionList(1)
        // console.log('问卷');
    },
    methods: {

        addquestion() {
      this.$router.push('/admin/questionadd')
     },
      getQuestionList(page) {
        this.$api.getQuestionList({ page }).then((res) => {
          if (res.data.status === 200) {
            res.data.data.forEach((data) => {
            data.endtime = moment(data.endtime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          // console.log('问卷',res.data);
            this.questionList =res.data.data;
            // this.total = res.data.total;
          }
        });
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  * {
    margin: 0;
    padding: 0;
  }
  header{
    height: 30px;
    background-color: orange;
    text-align: center;
    line-height: 30px;
    color: white;
    margin-bottom: 5px;
  }
  .btn{
    margin-bottom: 5px;
  }
  .main {
    box-sizing: border-box;
    position: relative;
    font-size: 16px;
    // padding-top: 10px;
    // padding-left: 20px;
    padding-bottom: 20px;
    width: 1000px;
    height: auto;
    margin: 50px auto;
    // background-color: rgba(0, 0, 0, 0.5);
    // background-color: #999999;
  }
  .content {
    width: 100%;
    margin-top: 30px;
    // padding-bottom: 30px;
    // margin-bottom: 20px;
    margin-right: 40px;
    background-color: #fff;
    
    
  }
 
  </style>