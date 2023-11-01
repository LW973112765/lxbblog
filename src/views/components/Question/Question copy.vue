<template>
    <transition
      appear
      name="animate__animated animate__bounce"
      enter-active-class="animate__backInUp"
      leave-active-class="animate__backOutDown"
    >
      <div class="main">
        <div class="content">
          <header>我的问卷</header>
          <div class="warpper">
      <el-table :data="questionList" border style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endtime"
          label="截止时间"
          align="center"

        >
      
        </el-table-column>
        <el-table-column prop="" label="状态" width="100"  align="center" >
          <template slot-scope="scope" >
            <!-- <span
              :style="`color: ${
                scope.row.status > 0 && scope.row.status < 2 ? 'green' : 'red'
              }`"
            > -->
            <span >
              {{ filterSatatus(scope.row.questionid) }}</span
            >
          </template>
        </el-table-column>
        
       
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
           
           
            <router-link :to="{
              path:'/questioninfo',
              query:{
                question:scope.row
              }
            }"><el-button
              round
              type="info"
              >查看</el-button
            ></router-link>
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
  import { mapState } from "vuex";
  import moment from "moment";
  export default {
    name: "Question",
    components: { },
    data() {
      return {
          questionList: [],
        answerstatus:[],
      };
    },
  
    created() {
        this.getQuestionList(1)
        console.log('问卷');
    },
    computed: {
    ...mapState("loginModule", ["userinfo"]),
  },
    methods: {
      filterSatatus(questionid) {
          // console.log(questionid, '状态');
          let answerstatus = {
        questionid:questionid,
        username: this.userinfo.username,
   }
      this.$api.GetQuestionStatus(answerstatus).then(res => {
        if (res.data.status === 200)
          {
            // this.isanswer=res.data.isanswer
            console.log(res.data.msg);
            this.answerstatus.push(res.data.msg)
            return
        }
          else {
            {
              console.log(res.data.msg);
              this.answerstatus.push(res.data.msg)
            console.log(this.answerstatus);
            return
          }
        }
      })
    },
    
        detail(id) {
          console.log(id,'ididi');
      
     },
      getQuestionList(page) {
        this.$api.getQuestionList({ page }).then((res) => {
          if (res.data.status === 200) {
            res.data.data.forEach((data,index) => {
              data.index=index
            data.endtime = moment(data.endtime).format(
              "YYYY-MM-DD HH:mm:ss"
                );
            
              });
              // res.data.data.forEach((item, index) => {
              //   this.$set(item,'index',index)
              // })
          console.log('问卷',res.data);
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
    margin-bottom: 20px;
  }
  .main {
    box-sizing: border-box;
    position: relative;
    font-size: 16px;
    // padding-top: 10px;
    // padding-left: 20px;
    padding-bottom: 20px;
    width: 600px;
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