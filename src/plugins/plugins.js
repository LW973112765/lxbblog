import moment from "moment";
export default {
    install(Vue) {
        Vue.filter('dateFormat', function (value) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        })
    }
}
