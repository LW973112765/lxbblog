/**
 * 请求的方法
 */

import axios from "axios";
import base from "./base";
//node>js
import qs from "qs";
// const qs = require('querystring')
const api = {
  //前台
  /**
   * 用户登录接口
   */
  getLogin(params) {
    //params={lname:'',pwd:''}
    // console.log('520', params, qs.stringify(params));
    return axios.post(base.login, qs.stringify(params));
  },
  //用户注册接口
  getRegister(params) {
    console.log("用户注册params", params);
    console.log("用户注册qs.stringify(params)", qs.stringify(params));
    return axios.post(base.register, qs.stringify(params));
  },
  //根据用户名获取用户信息
  getUserinfo(params) {
    // console.log('根据用户名获取用户信息', params, qs.stringify(params));
    return axios.get(base.userinfo, { params });
  },

  //更改用户信息
  editUser(params) {
    // console.log('更改用户用户信息params', params);
    // console.log('更改用户用户信息qs.stringify(params)', qs.stringify(params));
    return axios.post(base.edituser, qs.stringify(params));
  },

  //用户搜索
  userSearch(params) {
    // console.log('收到了搜索', params, typeof params);
    return axios.get(base.usersearch, { params });
  },
  //文章搜索
  articleSearch(params) {
    return axios.get(base.articlesearch, { params });
  },
  //搜索
  getSearch(params) {
    return axios.get(base.getsearch, { params });
  },
  //获取图片
  getPhoto(params) {
    console.log("收到了", params, typeof params);
    return axios.get(base.photo, { params });
  },
  //获取所有文章
  getArticle(params) {
    // console.log('收到了', params, typeof params);
    return axios.get(base.getarticle, { params });
  },
  //获取所有文章浏览量
  getArticleTotal(params) {
    console.log("收到了", params, typeof params);
    return axios.get(base.getarticletotal, { params });
  },
  //获取上架的文章
  getArticleHave(params) {
    // console.log('收到了', params, typeof params);
    return axios.get(base.getarticlehave, { params });
  },
  //获取文章详情
  getArticleInfo(params) {
    console.log("收到了文章详情", params, typeof params);
    return axios.get(base.getarticleinfo, { params });
  },
  //发表评论
  postComment(params) {
    // console.log('收到了评论', params, typeof params);
    return axios.post(base.postcomment, qs.stringify(params));
  },
  //获取评论
  getComment(params) {
    // console.log('收到了评论信息', params, typeof params);
    return axios.get(base.getcomment, { params });
  },
  //获取文章评论总数（包括子级评论）
  getCommentTotal(params) {
    // console.log('收到了评论信息', params, typeof params);
    return axios.get(base.getcommenttotal, { params });
  },
  //获取评论回复
  getCommentAnswer(params) {
    // console.log('收到了评论信息', params, typeof params);
    return axios.get(base.getcommentanswer, { params });
  },

  //后台
  //管理员 登录接口

  getAdminLogin(params) {
    //params={lname:'',pwd:''}
    // console.log('520', params, qs.stringify(params));
    return axios.post(base.adminlogin, qs.stringify(params));
  },
  //管理员修改密码 editadminpass
  editAdminPass(params) {
    return axios.post(base.editadminpass, qs.stringify(params));
  },
  //获取分页用户
  getUserList(params) {
    // console.log('收到了', params, typeof params);
    return axios.get(base.userlist, {
      params,
    });
  },
  //获取所有用户
  getUserTotal(params) {
    // console.log('收到了', params, typeof params);
    return axios.get(base.usertotal, {
      params,
    });
  },
  //删除用户
  deleteUser(params) {
    return axios.get(base.deleteuser, {
      params,
    });
  },
  //删除图片
  deletePhoto(params) {
    // console.log('删除图片', params);
    return axios.get(base.deletephoto, {
      params,
    });
  },
  //上传图片
  addPhoto(params) {
    // console.log('上传图片', params);
    return axios.post(base.addphoto, qs.stringify(params));
  },
  // addPhoto(params) {
  //     console.log('上传图片', params);
  //     return axios.post(base.uploadUrl, qs.stringify(params))
  // },
  //上传视频
  addVideo(params) {
    console.log("上传图片", params);
    return axios.post(base.postvideo, qs.stringify(params));
  },
  //根据id获取视频
  idgetVideo(params) {
    return axios.get(base.idgetvideo, { params });
  },
  //获取视频列表
  getVideo(params) {
    return axios.get(base.getvideo, { params });
  },
  //删除视频
  deleteVideo(params) {
    // console.log('删除文章', params);
    return axios.get(base.deletevideo, { params });
  },

  //上传音乐
  addMusic(params) {
    console.log("上传音乐", params);
    return axios.post(base.postmusic, qs.stringify(params));
  },
  //获取音乐列表分页
  getMusic(params) {
    console.log("上传图片", params);
    return axios.get(base.getmusic, { params });
  },
  //获取所有音乐列表
  getMusicAll(params) {
    console.log("上传图片", params);
    return axios.get(base.getmusicall, { params });
  },
  //删除音乐
  deleteMusic(params) {
    // console.log('删除文章', params);
    return axios.get(base.deletemusic, { params });
  },
  //音乐搜索
  musicSearch(params) {
    // console.log('收到了搜索', params, typeof params);
    return axios.get(base.musicsearch, { params });
  },
  //添加文章
  addArticle(params) {
    // console.log('添加文章', params);
    return axios.post(base.addarticle, qs.stringify(params));
  },
  //删除文章
  deleteArticle(params) {
    // console.log('删除文章', params);
    return axios.get(base.deletearticle, { params });
  },
  //上架下架文章
  hiddenArticle(params) {
    // console.log('上架下架文章 ', params);
    return axios.post(base.updatearticle, qs.stringify(params));
  },
  //根据id编辑文章
  editArticle(params) {
    // console.log('编辑文章 ', params);
    return axios.post(base.updatearticle, qs.stringify(params));
  },
  //把文章移入回收站
  setHuishou(params) {
    return axios.post(base.updatearticle, qs.stringify(params));
  },
  //把文章移出回收站
  setArticle(params) {
    return axios.post(base.updatearticle, qs.stringify(params));
  },
  //获取热门文章
  getHotList(params) {
    return axios.get(base.gethotlist, { params });
  },
  //浏览量增加
  addLiulanliang(params) {
    // console.log('当前的浏览量', params);
    return axios.post(base.updatearticle, qs.stringify(params));
  },
  //获取文章分类
  getCategoryList(params) {
    return axios.get(base.getcategory, { params });
  },
  //修改分类
  updateCategory(params) {
    return axios.post(base.updatecategory, qs.stringify(params));
  },
  //删除分类
  deleteCategory(params) {
    return axios.post(base.deletecategory, qs.stringify(params));
  },
  //新增分类
  addCategory(params) {
    return axios.post(base.addcategory, qs.stringify(params));
  },
  //获取分类名
  getCategoryName(params) {
    // console.log('分类名', params);
    return axios.get(base.getcategoryname, { params });
  },
  //根据id获取文章分类
  getCategoryId(params) {
    return axios.get(base.getcategoryid, { params });
  },
  //获取文章评论
  getArticleComment(params) {
    return axios.get(base.getarticlecomment, { params });
  },
  ////根据用户名获取评论
  getUserComment(params) {
    return axios.get(base.getusercomment, { params });
  },
  //获取所有评论
  getAllComment(params) {
    return axios.get(base.getallcomment, { params });
  },
  //修改评论状态
  editComment(params) {
    return axios.post(base.editcomment, qs.stringify(params));
  },
  //删除评论
  deleteComment(params) {
    // console.log('删除评论', params);
    return axios.get(base.deletecomment, {
      params,
    });
  },
  //用户留言
  postMessage(params) {
    return axios.post(base.postmessage, qs.stringify(params));
  },
  //获取留言
  getMessage(params) {
    return axios.get(base.getmessage, { params });
  },
  //前台获取留言回复
  getMessageAnswer(params) {
    return axios.get(base.getmessageanswer, { params });
  },
  //修改留言
  updateMessage(params) {
    return axios.post(base.updatemessage, qs.stringify(params));
  },
  //搜索留言
  messageSearch(params) {
    return axios.get(base.messagesearch, { params });
  },
  //根据用户名获取留言
  getUserMessage(params) {
    return axios.get(base.getusermessage, { params });
  },
  //删除留言
  deleteMessage(params) {
    return axios.get(base.deletemessage, { params });
  },
  //收藏文章
  getCollect(params) {
    return axios.post(base.getcollect, qs.stringify(params));
  },
  //取消收藏文章
  deleteCollect(params) {
    return axios.post(base.deletecollect, qs.stringify(params));
  },
  //查看当前文章是否已经被收藏
  isCollect(params) {
    return axios.get(base.iscollect, { params });
  },
  //获取收藏的文章
  getCollectArticle(params) {
    console.log("获取收藏的文章", params);
    return axios.get(base.getcollectarticle, { params });
  },
  //后台获取所有问卷
  getQuestionList(params) {
    // console.log('获取问卷', params);
    return axios.get(base.getquestionlist, { params });
  },
  //前台获取未提交问卷
  getQuestionListlw(params) {
    // console.log('获取问卷', params);
    return axios.get(base.getquestionlistlw, { params });
  },
  //前台根据id获取问卷
  getQuestion(params) {
    // console.log('获取问卷', params);
    return axios.get(base.getquestion, { params });
  },
  //提交问卷
  SendQuestion(params) {
    return axios.post(base.sendquestion, qs.stringify(params));
  },
  //判断用户是否提交该
  GetQuestionStatus(params) {
    // console.log('获取问卷', params);
    return axios.get(base.getquestionstatus, { params });
  },
  //查看当前问卷提交详情
  GetQuestionAnswer(params) {
    // console.log('获取问卷', params);
    return axios.get(base.getquestionanswer, { params });
  },
  //添加问卷
  AddQuestion(params) {
    return axios.post(base.addquestion, qs.stringify(params));
  },
  //删除问卷
  DeleteQuestion(params) {
    return axios.post(base.deletequestion, qs.stringify(params));
  },
  //获取病历
  GetRecord(params) {
    return axios.get(base.getrecord, { params });
  },
  //编辑病历
  EditRecord(params) {
    return axios.post(base.editrecord, qs.stringify(params));
  },
  //添加病历
  AddRecord(params) {
    return axios.post(base.addrecord, qs.stringify(params));
  },
  //获取个人病历
  GetMyrecord(params) {
    return axios.get(base.getmyrecord, { params });
  },
  //获取聊天列表
  GetChatList(params) {
    return axios.get(base.getchatlist, { params });
  },
  //获取聊天列表
  AdminGetChatList(params) {
    return axios.get(base.admingetchatlist, { params });
  },
  //获取聊天记录
  GetChat(params) {
    return axios.get(base.getchat, { params });
  },
  //发送聊天
  SendChat(params) {
    return axios.post(base.sendchat, qs.stringify(params));
  },
  //获取未读信息
  GetChatNo(params) {
    return axios.get(base.getchatno, { params });
  },
  //获取未读信息总数
  GetChatNoTotal(params) {
    return axios.get(base.getchatnototal, { params });
  },
  //设置信息已读
  SetChatHave(params) {
    return axios.post(base.setchathave, qs.stringify(params));
  },

  //获取聊天里最后一条信息
  GetLastChat(params) {
    return axios.get(base.getlastchat, { params });
  },
  //获取管理员id
  GetAdminId(params) {
    return axios.get(base.getadminid, { params });
  },
  //用户获取聊天背景
  GetUserBg(params) {
    return axios.get(base.getuserbg, { params });
  },
  //用户更改聊天背景
  EditUserBg(params) {
    // console.log(params, 'index');
    return axios.post(base.edituserbg, qs.stringify(params));
  },
  //管理员获取聊天背景
  GetAdminBg(params) {
    return axios.get(base.getadminbg, { params });
  },
  //管理员更改聊天背景
  EditAdminBg(params) {
    // console.log(params, 'index');
    return axios.post(base.editadminbg, qs.stringify(params));
  },

  //获取分页管理员
  getAdminList(params) {
    // console.log('收到了', params, typeof params);
    return axios.get(base.adminlist, {
      params,
    });
  },
  //管理员搜索
  adminSearch(params) {
    // console.log('收到了搜索', params, typeof params);
    return axios.get(base.adminsearch, { params });
  },
  //删除管理员
  deleteAdmin(params) {
    return axios.get(base.deleteadmin, {
      params,
    });
  },
  //更改管理员信息
  editAdmin(params) {
    return axios.post(base.editadmin, qs.stringify(params));
  },

  //管理员注册接口
  getAdminRegister(params) {
    return axios.post(base.adminregister, qs.stringify(params));
  },
  //获取邮箱验证码
  getCode(params) {
    console.log("收到了邮箱", params);
    return axios.get(base.getcode, { params });
  },
  //用户找回密码
  getFindPass(params) {
    return axios.post(base.getfindpass, qs.stringify(params));
  },
  //后台发送用户找回的密码
  sendFindPass(params) {
    console.log("收到了邮箱", params);
    return axios.get(base.sendfindpass, { params });
  },
  //增加视频播放量
  AddVideoView(params) {
    return axios.post(base.addvideoview, qs.stringify(params));
  },
  //发送弹幕
  SendDanmu(params) {
    return axios.post(base.senddanmu, qs.stringify(params));
  },
  //获取弹幕
  GetDanmu(params) {
    return axios.get(base.getdanmu, { params });
  },

  //获取别人评论我的
  GetCommentMy(params) {
    return axios.get(base.getcommentmy, { params });
  },
  //用户获取留言回复
  GetMessageMy(params) {
    return axios.get(base.getmessagemy, { params });
  },
  //通过id获取音乐
  IdGetMusic(params) {
    return axios.get(base.idgetmusic, { params });
  },
  //搜索视频
  SearchVideo(params) {
    return axios.get(base.searchvideo, { params });
  },
  //用户修改密码
  editUserPass(params) {
    return axios.post(base.edituserpass, qs.stringify(params));
  },
  //用户修改头像
  editUserAvatar(params) {
    return axios.post(base.edituseravatar, qs.stringify(params));
  },
  //获取版本号
  GetVersion(params) {
    return axios.get(base.getversion, { params });
  },
  //添加版本号
  AddVersion(params) {
    return axios.post(base.addversion, qs.stringify(params));
  },

  //扫码登录
  //向服务器发送二维码信息
  SendCodeLogin(params) {
    return axios.post(base.sendcodelogin, qs.stringify(params));
  },
  //获取二维码状态
  GetCodeLogin(params) {
    return axios.get(base.getcodelogin, { params });
  },
  //刷新二维码的时候，使之前的使用二维码失效
  UpdateCodeLoginAll(params) {
    return axios.post(base.updatecodeloginall, qs.stringify(params));
  },
  //登录成功获取登录信息
  GetCodeUser(params) {
    return axios.get(base.getcodeuser, { params });
  },
  //登录成功获取登录信息
  GetCodeAdmin(params) {
    return axios.get(base.getcodeadmin, { params });
  },
};

export default api;
