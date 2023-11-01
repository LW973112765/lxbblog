<template>
  <transition name="zxl" appear>
    <div class="main">
      <aplayer
        theme="#41b883"
        float
        listFolded
        mutex
        repeat="repeat-all"
        :music="music[0]"
        :list="music"
        src="src"
        pic="pic"
        :showLrc="true"
      ></aplayer>
    </div>
  </transition>
</template>

<script>
import aplayer from "vue-aplayer";
export default {
  components: { aplayer },
  data() {
    return {
      music: [
        {
          src: "http://music.163.com/song/media/outer/url?id=1804200089",
          title: "忘れない為に",
          artist: "Dear*ポラリス",
          pic: "http://p1.music.126.net/noP7Y3V0ntYZYWQTTi0--w==/109951165539837900.jpg?param=130y130",
          lrc: "[00:36.480]境界の向こうに落とした きっと 大切な何かを一定是 把重要的什么给遗落在境界的对岸\n[00:54.244]どんな言葉があるの会有怎样的话语呢\n[00:57.196]知り得るもの全部教えて你把所能知道的事情全部告诉我\n[01:01.898]どんな顔で笑うの是用怎样的表情微笑呢\n[01:05.659]こっそりこっちを見てよ瞧瞧看向这边哦\n[01:12.582]ねえ 初めてくれた涙呐 你最初为我而流的眼泪\n[01:17.571]私のココロ満たした填满了我的心田\n[01:22.534]未来の約束 覚えてる有关未来的约定 你还记得吗\n[01:30.110]小指と小指を絡めてくれた あなたを待つよ小指与小指相互缠绕 我会等你哦\n[01:39.122]いつまでも直到地老天荒\n[01:58.844]胸懐の向こうに仕舞った ずっと 大切な記憶を一直 将很珍视的记忆\n[02:16.425]あの森で遊ぼうよ在那片森林里玩耍吧\n[02:19.821]その次はもっと遠くの街下次就去更远的街道\n[02:24.706]明日また会えるかな明天还能见到你吗\n[02:28.232]それだけで幸せだよ仅此就很幸福了啊\n[02:33.300]ねえ 最後にくれた涙呐 你最后为我而流的眼泪\n[02:37.767]私のココロ痛めた让我心痛难忍\n[02:42.652]未来の約束は消えたの?有关未来的约定难道消失了吗？\n[02:50.332]時間が流れて 遥かな距離を漂うアリア时光流逝 飘荡了遥远距离的咏叹调\n[02:59.579]聴こえない我已听不见\n[03:19.406]ねえ 初めてくれた涙呐 你最初为我而流的眼泪\n[03:24.317]私のココロ満たした填满了我的心田\n[03:29.202]未来の約束 信じてる相信着 有关未来的约定\n[03:37.039]あなたの描いた線の上には命の続き你所描绘的线上是生命的延续\n[03:46.234]歩いているよ我一直不断行走\n[03:49.551]裂けた空の継ぎめから从撕裂的天空的裂缝处\n[03:54.097]明日は何度も生まれている明天将无数次诞生\n[03:59.060]どこかにいるなら 笑っていてね如果你还在某处 请记得微笑\n[04:07.471]今度会えたら下次再见到你\n[04:10.084]もう一度約束をしよう再一次做个约定吧\n[04:15.804]指きりで小指拉钩",
        },
      ],
    };
  },
  methods: {
    http(page) {
      this.$api
        .getMusicAll({
          page,
        })
        .then((res) => {
          this.currentPage = page;
          if (res.data.status === 200) {
            // res.data.data.forEach((data) => {
            //   data.lrc = data.lrc.replace(/\n/g, "");
            // });
            console.log("音乐", res.data.data[0].lrc);
            this.music = res.data.data;
          }
        });
    },
  },
  created() {
    this.http(1);
  },
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.main {
  width: 100%;
  height: 100px;
}
.zxl-enter-active {
  animation: zxl 0.5s linear;
}

.zxl-leave-active {
  animation: zxl 0.5s linear reverse;
}
.aplayer {
  width: 100%;
  height: auto;
  max-height: 400px;
  overflow: auto;
  margin-left: -0px;
  z-index: 1000;
}

@keyframes zxl {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
