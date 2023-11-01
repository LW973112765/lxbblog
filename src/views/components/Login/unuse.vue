<!-- // 首先下载 qrcodejs2 模块  npm i qrcodejs2 --save
// 在组件中使用 -->
<template>
  <div class="qrcode" ref="qrCodeUrl"></div>
</template>

<script>
import QRCode from "qrcodejs2";
import axios from "axios";
export default {
  data() {
    return {
      uuid: "", // 请求回来的唯一标识
      timer: "",
    };
  },
  methods: {
    // 获取唯一id生成二维码
    async getUuid() {
      const {
        data: { uuid },
      } = await axios.get("http://127.0.0.1:3000/ewm");
      this.uuid = uuid;
      // 生成二维码
      this.creatQrCode();
    },
    creatQrCode() {
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: JSON.stringify({
          uuid: this.uuid,
          token: "123",
        }), // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      // 二维码显示成功之后 运行PC端网页异步轮询xmlhttprequest (ajax)，定期轮询后台  每隔200毫秒向后端发送一次请求 查看是否登录成功
      this.getStatus();
    },
    // 轮询后端
    async getStatus() {
      let _this = this;
      const {
        data: { status },
      } = await axios.get("http://127.0.0.1:3000/isLogin", {
        params: {
          uuid: this.uuid,
        },
      });
      // 如果没有登录成功的话  一直询问是否登录成功
      if (status === 400) {
        this.timer = setTimeout(function () {
          _this.getStatus();
        }, 200);
      }
      clearTimeout(this.timer);
    },
  },
  mounted() {
    this.getUuid();
  },
};
</script>
