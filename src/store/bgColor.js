export default {
  namespaced: true,
  mutations: {
    //设置背景信息
    setBg(state, zxl) {
      state.bginfo = zxl;
    },
    //清空背景信息
    clearBg(state) {
      state.bginfo = {
        selection: "",
        bg: "",
      };
    },
  },
  state: {
    bginfo: {
      selection: "",
      bg: "",
    },
  },
};
