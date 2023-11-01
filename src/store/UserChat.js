export default {
    namespaced: true,
    mutations: {
        //设置用户信息
        setUserChat(state, zxl) {
            state.userchatinfo = zxl
        },
        //清空用户信息
        clearUserChat(state) {
            state.userchatinfo = {
                userid: '',
                adminid: '',
                name: '',
                avatar: ''
            }
        },

    },
    state: {
        userchatinfo: {
            userid: '',
            adminid: '',
            name: '',
            avatar: '',
        },

    },
}