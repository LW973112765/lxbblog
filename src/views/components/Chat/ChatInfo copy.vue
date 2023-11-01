<template>
    <transition
      appear
      name="animate__animated animate__bounce"
      enter-active-class="animate__backInUp"
      leave-active-class="animate__backOutDown"
    >
      <div ref="box" class="main" :style="{ backgroundImage: 'url(' + backgroundImageUrl + ')' }" >
        <el-dialog
  title="请上传"
  :visible.sync="dialogVisible"
  width="30%"
:append-to-body="true"
  >
  <el-upload
          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="upavatar"
            title="点击更改头像"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary"  size="medium" @click="addphoto">确 定</el-button>
  </span>
</el-dialog>
        <header>
          <button @click="zxl" class="iconfont icon-xingzhuanggongnengtubiao-"></button>
          <el-tooltip content="更改聊天背景" placement="bottom" effect="light">
            <button type="text" @click="dialogVisible = true" class="iconfont icon-tupian"></button>
</el-tooltip>
          
          <span class="three">{{ $route.query.data.answername || userchatinfo.name}} </span>
        </header>
        <div class="content" v-for="(item,index) in chatlist" :key="index">
            <div v-if="item.senderid==userinfo.id" class="item item-right">
                <div class="bubble bubble-right">{{ item.content }}
                  <div class="timer">{{ item.sendtime }}</div>
                </div>
                <div class="avatar"><img
                  :src="userinfo.avatar" />
                </div>
            </div>
            
            <div v-else  class="item item-left">
              <div class="avatar"><img
                  :src="avatar || userchatinfo.avatar">
            </div>
              <div class="bubble bubble-left">{{ item.content }} 
                 <div class="timer">{{ item.sendtime }}</div></div>
            
               
            </div>
        </div>
        <footer><input type="text" v-model="content" placeholder="按Enter或点击按钮发送信息😊😊" @keydown.enter="send"><button @click="send">发送</button></footer>
      </div>
    </transition>
  </template>
  <script>
  import "animate.css";
  import base from "../../../api/base";
  import { mapState } from "vuex";
  import moment from "moment";
  export default {
    name: "chatlist",
    data() {
      return {
        url: base.uploadUrl,
      baseurl: "",
      imageUrl: "",
     chatlist: [],
    content: '',
          avatar: '',
     bgavatar:'',
   dialogVisible: false,
   base:''
      };
    },
    computed: {
        ...mapState("loginModule", ["userinfo"]),
        ...mapState("UserChat", ["userchatinfo"]),
        backgroundImageUrl() {
           this.$api.GetUserBg({ userid: this.userinfo.id }).then(res => {
           this.base= res.data.data.bgurl
             })
          return this.base
  }
      },
    mounted() {
      console.log(this.userchatinfo,'this.userchatinfo');
      // console.log(document.documentElement.scrollTop, document.body.scrollTop);
        this.avatar = this.$route.query.data.avatar
      // console.log(this.$route.query.data,'this.$route.query.datahhh');
        this.setchathave()
        
        this.baseurl = base.host;
        this.add()
      
  },
  beforeUpdate(){
            var div = this.$refs.box;
              //  console.log(`我被更新Dom之前,更新前的div.scrollHeight是${div.scrollHeight}`)
           },
           updated(){
            var div = this.$refs.box;
              //  console.log(`我被更新了Dom,更新后的div.scrollHeight是${div.scrollHeight}`)
           },
    methods: {
        addphoto() {
          if (this.imageUrl == "") {
            this.$message.error('还未上传图片哦');
          }
            else {
              this.dialogVisible = false
          this.$api.EditUserBg({
            userid: this.userinfo.id,
            bgurl:this.bgavatar
            }).then(res => {
              if (res.data.status === 200) {
                this.$message({
                  message: "恭喜您，添加成功",
                  type: "success",
                });
                this.imageUrl = "";
                this.$router.go(0)
   this.backgroundImageUrl()
              }
          })
       }
      },
         // 上传图片成功
    handleAvatarSuccess(res, file, fileList) {
      console.log("上传成功了", res, file, fileList);
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file.raw.name, ".........", res.url);
      const imgurl = file.raw.name;
      console.log("imgurl", imgurl);
      this.$message({
        message: "恭喜你，图片上传成功",
        type: "success",
      });
      this.imageUrl = `${base.host}/${res.url.slice(7)}`;
      console.log("this.imageUrl", this.imageUrl);
      this.bgavatar = this.baseurl + "/" + res.url.slice(7);
      console.log("图片地址", this.avatar);
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt3M = file.size / 1024 / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt3M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isJPG && isLt3M;
    },
      zxl() {
        this.$router.go(-1)
        
      },
        add() {
          var div = this.$refs.box;
          setTimeout(() => {
            console.log(`点击了添加按钮,此时的div.scrollHeight是${div.scrollHeight}`)
          div.scrollTop = div.scrollHeight;
          },500);
      },
      //把未读信息改为已读
        setchathave() {
        this.$api.SetChatHave({
          senderid:this.$route.query.data.answerid,
          answerid:this.userinfo.id
        })
      },
          
        send() {
              if (this.content == '')
          { this.$message({
          message: '输入不能为空',
          type: 'warning'
            });
            }
                else {
                    let chat = {
                        senderid:this.userinfo.id,
                        answerid:this.$route.query.data.answerid || this.userchatinfo.adminid,
                        sendtime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        content: this.content,
                        status:0
                    }
                    this.$api.SendChat(chat).then(res => {
                          if (res.data.status === 200) {
                            this.content=''
                                this.http()
                                this.add()
      
                              
                        }
                    })
            
        }
      },
      // 获取聊天列表
      http() {
        // console.log("收到了", page);
        this.$api
          .GetChat({
                senderid: this.userinfo.id || this.userchatinfo.userid,
             answerid:this.$route.query.data.answerid || this.userchatinfo.adminid
          })
          .then((res) => {
                if (res.data.status === 200) {
                console.log('聊天列表',res.data.data)
              res.data.data.forEach((data) => {
                data.sendtime = moment(data.sendtime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              });
              this.chatlist = res.data.data;
            }
          });
      },
    },
    created() {
      this.http();
    },
  };
  </script>
  
  <style lang="less" scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  background-color: #333;
}
.upavatar {
  width: 178px;
  height: 178px;
  display: block;
}
  .icon-xingzhuanggongnengtubiao-{
    width: 20px;
    height: 20px;
    background-color: #999;
    border: #999;
    z-index: 100;
    position: absolute;
    top:0;
    left: 5px;
    cursor: pointer;

  }
  .icon-tupian{
    display: inline-block;
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #999;
    border: #999;
    top:0;
    cursor: pointer;
    left: 60px;
  }
  header{
    background-color: #999;
    text-align:center;
    width: 600px;
    // margin-left: -20px;
    position: fixed;
    top: 60px;
    z-index: 50;
  }
  footer{
    width: 600px;
    // margin-left: -2px;
    position: fixed;
    bottom: 15px;
    z-index: 50;
    button{
        height: 40px;
        width: 60px;
        position: absolute;
        right: 0;
    }
    input{
        width: 520px;
       height: 40px;
    }
  }
  .main {
    overflow: auto;
    box-sizing: border-box;
    position: relative;
    font-size: 16px;
    padding-top: 10px;
    // padding-left: 20px;
    // padding-bottom: 10px;
    width: 600px;
    min-height: 500px;
    background-color: aliceblue;
    // background-color: aqua;
    // height: auto;
    height: 100%;
    margin: 50px auto;
   
    // background-color: rgba(0, 0, 0, 0.5);
    // background-color: #999999;
  }
  body {
        // height: 100vh;
        // width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

  
    .timer{
            // color: #999;
            color:royalblue;
            font-size: 10px;
        }
    .content {
        width: 100%;
        box-sizing: border-box;
        // padding: 20px;
        padding-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
        // overflow-y: scroll;
        // flex: 1;
    }

    .content:hover::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
    }

    .bubble {
        max-width: 200px;
        padding: 10px;
        line-height: 30px;
        border-radius: 5px;
        position: relative;
        color: #000;
        word-wrap: break-word;
        word-break: normal;
    }

    .item-left .bubble {
        margin-left: 15px;
        background-color: #fff;
        .timer{
            position: absolute;
            width: 100px;
            left: 0px;
            bottom: -20px;
            white-space: nowrap;
        }
    }

    .item-left .bubble:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-top: 10px solid transparent;
        border-right: 10px solid #fff;
        border-bottom: 10px solid transparent;
        left: -20px;
    }

    .item-right .bubble {
        margin-right: 15px;
        background-color: #9eea6a;
        .timer{
            position: absolute;
            width: 100px;
            right: 15px;
            bottom: -20px;
            white-space: nowrap;
        }
    }

    .item-right .bubble:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid #9eea6a;
        border-top: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
        right: -20px;
    }

    .item {
        margin-top: 15px;
        display: flex;
        width: 100%;
    }

    .item.item-right {
        justify-content: flex-end;
    }


    .avatar img {
        width: 50px;
        height: 50px;
        border-radius: 5px
    }



   
  .pagination-wrapper {
    width: 95%;
    background-color: #fff;
  }
 
  </style>