export default {
    namespaced: true,
    mutations: {
        setAdminChat(state, zxl) {
            state.adminchatinfo = zxl
        },

        clearAdminChat(state) {
            state.adminchatinfo = {
                userid: '',
                adminid: '',
                name: '',
                avatar: ''
            }
        },

    },
    state: {
        adminchatinfo: {
            userid: '',
            adminid: '',
            name: '',
            avatar: ''
        },

    },
}