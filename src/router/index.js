import Vue from "vue";
import VueRouter from "vue-router";
//
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: "",
      //redirect: '/home',name: 'index', 把/home设置为首页
      redirect: "/home",
      name: "index",
      component: () => import("../views/Layout/index"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("../views/components/Home/Home"),
        },
        {
          path: "todos",
          name: "todos",
          component: () => import("../components/Todos/Todos"),
        },
        {
          path: "tools",
          name: "tools",
          component: () => import("../components/Tools/index"),
          children: [
            {
              path: "fanyi",
              name: "fanyi",
              component: () => import("../components/Tools/Fanyi"),
            },
            {
              path: "weather",
              name: "weather",
              component: () => import("../components/Tools/Weather"),
            },
            {
              path: "photos",
              name: "photos",
              component: () => import("../components/Tools/Photo"),
            },
            {
              path: "word",
              name: "word",
              component: () => import("../components/Tools/Word"),
            },
          ],
        },

        {
          path: "usercenter",
          name: "usercenter",

          meta: { isLogin: true },
          component: () =>
            import("../../src/views/components/Usercenter/Usercenter"),
        },
        {
          name: "userinfoedit",
          path: "userinfoedit",
          component: () => import("../components/Userinfoedit/Userinfoedit"),
        },
        {
          name: "photo",
          path: "photo",
          component: () => import("../views/components/Photo/Photo"),
        },
        {
          name: "video",
          path: "video",
          component: () => import("../views/components/Video/Video"),
        },
        {
          name: "article",
          path: "article",
          component: () => import("../../src/views/components/Article/Article"),
        },
        {
          name: "question",
          path: "question",
          component: () =>
            import("../../src/views/components/Question/Question"),
        },
        {
          name: "questioninfo",
          path: "questioninfo",
          component: () =>
            import("../../src/views/components/Question/QuestionInfo"),
        },
        {
          name: "chatinfo",
          path: "chatinfo",
          component: () => import("../../src/views/components/Chat/ChatInfo"),
        },
        {
          name: "chatlist",
          path: "chatlist",
          component: () => import("../../src/views/components/Chat/ChatList"),
        },
        {
          name: "articleinfo",
          path: "articleinfo",
          component: () =>
            import("../../src/components/ArticleInfo/ArticleInfo"),
        },
        {
          name: "search",
          path: "search",
          component: () => import("../../src/components/Search/Search"),
        },
        {
          name: "messageinfo",
          path: "messageinfo",
          component: () => import("../../src/components/Message/MessageInfo"),
        },
      ],
    },

    {
      path: "/login",
      name: "login",
      component: () => import("../views/components/Login/Login"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/components/Register/Register"),
    },
    {
      path: "/adminlogin",
      name: "adminlogin",
      component: () => import("../Admin/AdminLogin/AdminLogin"),
    },
    {
      path: "/admin",
      name: "admin",
      meta: { isAdminLogin: true },
      component: () => import("../Admin/Layout/index"),
      children: [
        {
          path: "userlist",
          name: "userlist",
          component: () => import("../Admin/User/UserList"),
        },
        {
          path: "adduser",
          name: "adduser",
          component: () => import("../Admin/User/AddUser"),
        },
        {
          path: "updateuser",
          name: "updateuser",
          component: () => import("../Admin/User/UpdateUser"),
        },

        {
          path: "adminlist",
          name: "adminlist",
          component: () => import("../Admin/Admin/AdminList"),
        },
        {
          path: "addadmin",
          name: "addadmin",
          component: () => import("../Admin/Admin/AddAdmin"),
        },
        {
          path: "updateadmin",
          name: "updateadmin",
          component: () => import("../Admin/Admin/UpdateAdmin"),
        },
        {
          path: "addphoto",
          name: "addphoto",
          component: () => import("../Admin/Photo/AddPhoto"),
        },
        {
          path: "photolist",
          name: "photolist",
          component: () => import("../Admin/Photo/PhotoList"),
        },

        {
          path: "addmusic",
          name: "addmusic",
          component: () => import("../Admin/Music/AddMusic"),
        },
        {
          path: "musiclist",
          name: "musiclist",
          component: () => import("../Admin/Music/MusicList"),
        },
        {
          path: "home",
          name: "/admin/home",
          component: () => import("../Admin/Home/Home"),
        },
        {
          path: "articlelist",
          name: "articlelist",
          component: () => import("../Admin/Article/ArticleList"),
        },
        {
          path: "huishouzhan",
          name: "huishouzhan",
          component: () => import("../Admin/Article/Huishouzhan"),
        },
        {
          path: "addarticle",
          name: "addarticle",
          component: () => import("../Admin/Article/Add"),
        },
        {
          path: "editarticle",
          name: "editarticle",
          component: () => import("../Admin/Article/Edit"),
        },
        {
          path: "comment",
          name: "comment",
          component: () => import("../Admin/Article/Comment"),
        },
        {
          path: "comments",
          name: "comments",
          component: () => import("../Admin/Comments/Comments"),
        },
        {
          path: "system",
          name: "system",
          component: () => import("../Admin/System/System"),
        },
        {
          path: "videolist",
          name: "videolist",
          component: () => import("../Admin/Video/VideoList"),
        },
        {
          path: "addvideo",
          name: "addvideo",
          component: () => import("../Admin/Video/AddVideo"),
        },
        {
          path: "message",
          name: "message",
          component: () => import("../Admin/Message/Message"),
        },
        {
          path: "category",
          name: "category",
          component: () => import("../Admin/Category/Category"),
        },
        {
          path: "questionmanage",
          name: "questionmanage",
          component: () => import("../Admin/Question/Question"),
        },
        {
          path: "questiondetail",
          name: "questiondetail",
          component: () => import("../Admin/Question/QuestionDetail"),
        },
        {
          path: "questionadd",
          name: "questionadd",
          component: () => import("../Admin/Question/QuestionAdd"),
        },

        {
          path: "questionanswerlist",
          name: "questionanswerlist",
          component: () => import("../Admin/Question/QuestionAnswerList"),
        },
        {
          path: "recordlist",
          name: "recordlist",
          component: () => import("../Admin/Record/RecordList"),
        },
        {
          path: "recordedit",
          name: "recordedit",
          component: () => import("../Admin/Record/RecordEdit"),
        },
        {
          path: "recorddetail",
          name: "recorddetail",
          component: () => import("../Admin/Record/RecordDetail"),
        },

        {
          path: "chatlist",
          name: "chatlist",
          component: () => import("../Admin/Chat/ChatList"),
        },
        {
          path: "adminchatinfo",
          name: "adminchatinfo",
          component: () => import("../Admin/Chat/ChatInfo"),
        },
        {
          path: "addversion",
          name: "addversion",
          component: () => import("../Admin/AppVersion/AddVersion"),
        },
        {
          path: "versionlist",
          name: "versionlist",
          component: () => import("../Admin/AppVersion/VersionList"),
        },
      ],
    },
  ],
});
//获取vuex数据
import store from "../store/index";
//用户路由拦截
// router.beforeEach((to, from, next) => {
//   // to and from are both route objects. must call `next`.
//   //需要登录
//   if (to.meta.isLogin) {
//     let token = store.state.loginModule.userinfo.token;
//     if (token) {
//       next();
//     } else if (confirm("您还没有登录，确定登录吗？")) {
//       next("/login");
//       // this.$router.go(-1);
//     }
//   } else {
//     //不需要登录
//     next();
//   }
//   let tokentwo = store.state.AdminLogin.admininfo.token;
//   if (!tokentwo && to.path !== "/adminlogin") {
//     alert("非法路由！！！");
//     // setTimeout(() => {
//     next("/adminlogin");
//     // }, 500);
//   } else {
//     next();
//   }
// });

//管理员登录拦截
// router.beforeEach((to, from, next) => {
//     if (to.meta.isAdminLogin) {
//         let admintoken = store.state.loginModule.admininfo.token
//         if (admintoken) {
//             next()
//         }
//         else if (confirm('您还没有登录，确定登录吗？')) {
//             next('/adminlogin')
//         }
//     } else {//不需要登录
//         next()
//     }
// })
export default router;
