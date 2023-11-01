//引入Vue
import Vue from "vue";
//引入App
import App from "./App.vue";
//引入VueRouter
import VueRouter from "vue-router";
//打印pdf
import downloadHtmlToPdf from "@/util/downloadHtmlToPdf";
Vue.use(downloadHtmlToPdf);
//导出word
import Print from "vue-print-nb";
Vue.use(Print);
import router from "./router/index";
import Vuex from "vuex";
import store from "./store";
//完整引入
//引入ElementUI组件库
import ElementUI from "element-ui";
//引入ElementUI全部样式
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/reset.css";
import api from "./api/index";
import * as echarts from "echarts";

//表情包编码
import { emojione, emojitwo } from "../src/util/emoji";
Vue.prototype.$emojione = emojione;
Vue.prototype.$emojitwo = emojitwo;
//图片预览
// 引入Viewer插件
import VueViewer, { directive as viewerDirective } from "v-viewer";
// 引入Viewer插件的图片预览器的样式
import "viewerjs/dist/viewer.css";
// 使用Viewer图片预览器
Vue.use(VueViewer);
// 用于图片预览的指令方式调用 在元素上加上会处理元素下所有的图片,为图片添加点击事件,点击即可预览
Vue.directive(
  "viewer",
  viewerDirective({
    debug: true,
  })
);
// 引入图标库
import "./assets/icon/icon.css";
import "./assets/fonts/iconfont.css";
//引入mavon-editor
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
// //引入动画
// import animate from 'animate.css'

//代码高亮
// import '../src/plugins/hljs.js'
//引入Swiper
// import 'swiper/css/swiper.css'
import hljs from "highlight.js";

Vue.directive("highlight", function (el) {
  let blocks = el.querySelectorAll("pre code");

  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});

import "highlight.js/styles/atom-one-dark.css";
//引入音频插件
import APlayer from "vue-aplayer";

Vue.use(APlayer, {
  defaultCover: "https://github.com/u3u.png",
  productionTip: true,
});

import "swiper/swiper-bundle.css";
// 引入插件
import plugins from "../src/plugins/plugins";
Vue.use(plugins);
//引入瀑布流插件
import waterfall from "vue-waterfall2";
Vue.use(waterfall);
Vue.prototype.$echarts = echarts;
// import { json } from 'express'
Vue.prototype.$api = api;
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(mavonEditor);

//关闭Vue的生产提示
Vue.config.productionTip = false;
//登录持久化
//用户信息
let username = localStorage.getItem("username");
if (username) {
  username = JSON.parse(username);
  store.commit("loginModule/setUser", username);
}
//管理员信息
let adminname = localStorage.getItem("lwandzxl");
if (adminname) {
  adminname = JSON.parse(adminname);
  store.commit("AdminLogin/setAdmin", adminname);
}
//管理员登录ip
let adminaddress = localStorage.getItem("lwandzxladdress");
if (adminaddress) {
  adminaddress = JSON.parse(adminaddress);
  store.commit("AdminLoginAddress/setAddress", adminaddress);
}
//用户聊天
let userchatinfo = localStorage.getItem("userchatinfo");
if (userchatinfo) {
  userchatinfo = JSON.parse(userchatinfo);
  store.commit("UserChat/setUserChat", userchatinfo);
}
//管理员聊天
let adminchatinfo = localStorage.getItem("adminchatinfo");
if (adminchatinfo) {
  adminchatinfo = JSON.parse(adminchatinfo);
  store.commit("AdminChat/setAdminChat", adminchatinfo);
}
//网站背景
let bginfo = localStorage.getItem("bginfo");
if (bginfo) {
  bginfo = JSON.parse(bginfo);
  store.commit("bgColor/setBg", bginfo);
}
//判断token是否失效
import axios from "axios"; // 引入axios
Vue.prototype.$axios = axios;
import Storage from "@/assets/js/storage.js";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
/* 请求拦截器 */

axios.interceptors.request.use(
  function (config) {
    // 每次请求时会从localStorage中获取token

    let token = Storage.localGet("token");

    if (token) {
      token = "bearer" + " " + token.replace(/'|"/g, ""); // 把token加入到默认请求参数中

      config.headers.common["Authorization"] = token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/* 响应拦截器 */

axios.interceptors.response.use(
  function (response) {
    // ①10010 token过期（30天） ②10011 token无效

    if (response.data.code === 10010 || response.data.code === 10011) {
      Storage.localRemove("token"); // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）

      router.replace({
        path: "/login", // 到登录页重新获取token
      });
    } else if (response.data.token) {
      // 判断token是否存在，如果存在说明需要更新token

      Storage.localSet("token", response.data.token); // 覆盖原来的token(默认一天刷新一次)
    }

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

new Vue({
  el: "#app",
  render: (h) => h(App),
  router: router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
});
