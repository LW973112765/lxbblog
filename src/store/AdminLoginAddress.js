export default {
    namespaced: true,
    mutations: {
        //设置管理员登录ip
        setAddress(state, lw) {
            state.addressinfo = lw
        },
        //清空管理员登录ip
        clearAddress(state) {
            state.addressinfo = {
                prov: "",
                city: "",
                time: ""
            }
        }
    },
    state: {
        addressinfo: {
            prov: "",
            city: "",
            time: ""
        }
    },
}