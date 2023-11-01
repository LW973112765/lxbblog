export default {
    namespaced: true,
    mutations: {
        //设置管理员信息
        setAdmin(state, lw) {
            state.admininfo = lw
        },
        //清空管理员信息
        clearAdmin(state) {
            state.admininfo = {
                adminname: '',
                token: '',
                avatar: '',
                email: '',
                id: '',
                type: ''
            }
        }
    },
    state: {
        admininfo: {
            adminname: '',
            token: '',
            avatar: '',
            email: '',
            id: '',
            type: ''
        }
    },
}