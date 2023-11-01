/**
 * 接口路径配置：
 * 一般文件目录：base.js  index.js
 * 但是公司不一定
 *      config
 *          login  index.js config.js
 *       index.js
 *       xxxx.js
 */

const base = {
  // host: 'http://43.143.167.129:8989',
  host: "http://localhost:8989",
  // 基础域名
  //博客前台
  uploadUrl: "https://up.qiniup.com", //图片上传 post请求
  qiniu: "http://lwandzxl.top",
  getqiniu: "/api/api/getqiniu", //获取七牛云域名
  idgetvideo: "/api/api/idgetvideo", //根据id获取视频
  postvideo: "/api/api/postvideo", //视频上传
  getvideo: "/api/api/getvideo", //获取视频列表
  deletevideo: "/api/api/deletevideo", //删除视频
  postmusic: "/api/api/postmusic", //音乐上传
  getmusic: "/api/api/getmusic", //获取音乐列表分页
  getmusicall: "/api/api/getmusicall", //获取所有音乐列表
  deletemusic: "/api/api/deletemusic", //删除音乐
  musicsearch: "/api/api/musicsearch", //音乐搜索
  login: "/api/api/login", //用户登录
  register: "/api/api/register", //用户注册
  userinfo: "/api/api/userinfo", //根据用户名获取用户信息
  edituser: "/api/api/edituser", //更改用户信息
  usersearch: "/api/api/usersearch", //用户搜索
  photo: "/api/api/photo", //获取图片
  // addliulanliang: '/api/api/addliulanliang', //浏览量增加
  getsearch: "/api/api/getsearch", //搜索
  articlesearch: "/api/api/articlesearch", //搜索文章
  gethotlist: "/api/api/gethotlist", //获取热门文章
  getarticle: "/api/api/getarticle", //获取所有文章
  getarticletotal: "/api/api/getarticletotal", //获取所有文章浏览量
  getarticlehave: "/api/api/getarticlehave", //获取所有文章
  getarticleinfo: "/api/api/getarticleinfo", //获取文章详情
  getallcomment: "/api/api/getallcomment", //获取所有评论
  getarticlecomment: "/api/api/getarticlecomment", //获取文章评论
  postcomment: "/api/api/postcomment", //发表评论
  getcomment: "/api/api/getcomment", //获取父级评论
  getcommenttotal: "/api/api/getcommenttotal", //获取文章评论总数（包括子级评论）
  getcommentanswer: "/api/api/getcommentanswer", //获取评论回复
  getusercomment: "/api/api/getusercomment", //根据用户名获取评论
  editcomment: "/api/api/editcomment", //修改评论状态
  deletecomment: "/api/api/deletecomment", //删除评论
  adminlogin: "/api/api/adminlogin", //管理员登录
  editadminpass: "/api/api/editadminpass", //管理员修改密码
  userlist: "/api/api/userlist", //用户列表
  usertotal: "/api/api/usertotal", //所有用户列表
  deleteuser: "/api/api/deleteuser", //删除用户
  deletephoto: "/api/api/deletephoto", //删除图片
  addphoto: "/api/api/addphoto", //上传图片
  updatearticle: "/api/api/updatearticle", //修改文章
  addarticle: "/api/api/addarticle", //添加文章
  deletearticle: "/api/api/deletearticle", //删除文章
  getcategory: "/api/api/getcategory", //获取文章分类
  getcategoryid: "/api/api/getcategoryid", //获取id文章分类
  postmessage: "/api/api/postmessage", //用户留言
  getmessage: "/api/api/getmessage", //获取留言
  updatemessage: "/api/api/updatemessage", //修改留言
  getmessageanswer: "/api/api/getmessageanswer", //前台获取留言回复
  messagesearch: "/api/api/messagesearch", //留言搜索
  getusermessage: "/api/api/getusermessage", //根据用户名获取留言
  deletemessage: "/api/api/deletemessage", //上传留言
  getcategoryname: "/api/api/getcategoryname", //获取分类名
  updatecategory: "/api/api/updatecategory", //修改分类
  addcategory: "/api/api/addcategory", //新增分类
  deletecategory: "/api/api/deletecategory", //删除分类
  getcollect: "/api/api/getcollect", //收藏文章
  deletecollect: "/api/api/deletecollect", //取消收藏文章
  iscollect: "/api/api/iscollect", //查看当前文章是否已经被收藏
  getcollectarticle: "/api/api/getcollectarticle", //获取收藏的文章
  getquestionlist: "/api/api/getquestionlist", //后台获取所有问卷
  getquestionlistlw: "/api/api/getquestionlistlw", //前台获取未提交问卷
  getquestion: "/api/api/getquestion", //根据id获取问卷
  sendquestion: "/api/api/sendquestion", //提交问卷
  getquestionstatus: "/api/api/getquestionstatus", //判断用户是否提交该问卷
  getquestionanswer: "/api/api/getquestionanswer", //查看当前问卷提交子详情
  addquestion: "/api/api/addquestion", //添加问卷
  deletequestion: "/api/api/deletequestion", //删除问卷
  getrecord: "/api/api/getrecord", //获取病历
  editrecord: "/api/api/editrecord", //编辑病历
  addrecord: "/api/api/addrecord", //添加病历
  getmyrecord: "/api/api/getmyrecord", //获取个人病历
  getchatlist: "/api/api/getchatlist", //获取聊天列表
  admingetchatlist: "/api/api/admingetchatlist", //获取聊天列表
  getchat: "/api/api/getchat", //获取聊天记录
  sendchat: "/api/api/sendchat", //发送聊天
  getchatno: "/api/api/getchatno", //获取未读信息
  getchatnototal: "/api/api/getchatnototal", //获取未读信息总数
  setchathave: "/api/api/setchathave", //设置信息已读
  getlastchat: "/api/api/getlastchat", //获取聊天里最后一条信息
  getadminid: "/api/api/getadminid", //获取管理员id
  getuserbg: "/api/api/getuserbg", //用户获取聊天背景
  edituserbg: "/api/api/edituserbg", //用户更改聊天背景
  getadminbg: "/api/api/getadminbg", //管理员获取聊天背景
  editadminbg: "/api/api/editadminbg", //管理员更改聊天背景
  adminlist: "/api/api/adminlist", //管理员列表
  adminsearch: "/api/api/adminsearch", //管理员搜索
  deleteadmin: "/api/api/deleteadmin", //删除管理员
  editadmin: "/api/api/editadmin", //更改管理员信息
  adminregister: "/api/api/adminregister", //管理员注册
  getcode: "/api/api/getcode", //获取邮箱验证码
  getfindpass: "/api/api/getfindpass", //用户找回密码
  sendfindpass: "/api/api/sendfindpass", //后台发送用户找回的密码
  addvideoview: "/api/api/addvideoview", //增加视频播放量
  senddanmu: "/api/api/senddanmu", //发送弹幕
  getdanmu: "/api/api/getdanmu", //获取弹幕
  getcommentmy: "/api/api/getcommentmy", //获取别人评论我的
  getmessagemy: "/api/api/getmessagemy", //用户获取留言回复
  idgetmusic: "/api/api/idgetmusic", //通过id获取音乐
  searchvideo: "/api/api/searchvideo", //搜索视频
  edituserpass: "/api/api/edituserpass", //用户修改密码
  edituseravatar: "/api/api/edituseravatar", //用户修改头像
  getversion: "/api/api/getversion", //获取版本号
  addversion: "/api/api/addversion", //添加版本号

  //以下不再index里写数据
  addmemo: "/api/api/addmemo", //新增备忘
  getmemo: "/api/api/getmemo", //获取备忘列表
  getmemoid: "/api/api/getmemoid", //根据id获取备忘列表
  delmemo: "/api/api/delmemo", //删除备忘
  editmemo: "/api/api/editmemo", //修改备忘
  addword: "/api/api/addword", //添加精美句子
  getword: "/api/api/getword", //获取精美句子
  addqiandao: "/api/api/addqiandao", //添加签到记录
  getqiandao: "/api/api/getqiandao", //获取签到记录

  addchoujiang: "/api/api/addchoujiang", //添加抽奖记录
  getchoujiang: "/api/api/getchoujiang", //获取全部抽奖记录
  getchoujianggroup: "/api/api/getchoujianggroup", //获取分组抽奖记录
  getjifen: "/api/api/getjifen", //获取积分
  editjifen: "/api/api/editjifen", //修改积分

  getjifenjilu: "/api/api/getjifenjilu", //获取积分记录
  addjifenjilu: "/api/api/addjifenjilu", //添加积分记录
  addchoujiangcishu: "/api/api/addchoujiangcishu", //添加每日抽奖次数
  getchoujiangcishu: "/api/api/getchoujiangcishu", //获取每日抽奖次数
  editchoujiangcishu: "/api/api/editchoujiangcishu", //修改每日抽奖次数

  getdiandiandidi: "/api/api/getdiandiandidi", //获取说说
  getdiandiandidiid: "/api/api/getdiandiandidiid", //根据d获取说说
  adddiandiandidi: "/api/api/adddiandiandidi", //添加说说
  deldiandiandidi: "/api/api/deldiandiandidi", //删除说说
  editdiandiandidi: "/api/api/editdiandiandidi", //修改说说

  // 扫码登录
  sendcodelogin: "/api/api/sendcodelogin", //向服务器发送二维码信息
  getcodelogin: "/api/api/getcodelogin", //获取二维码状态
  updatecodeloginall: "/api/api/updatecodeloginall", //刷新二维码的时候，使之前的使用二维码失效
  getcodeuser: "/api/api/getcodeuser", //登录成功获取登录信息
  getcodeadmin: "/api/api/getcodeadmin", //登录成功获取登录信息
};

export default base;
