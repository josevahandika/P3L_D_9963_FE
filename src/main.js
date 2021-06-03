import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueQriously from "./plugins/vue-qriously";
import router from "./router";
import axios from "axios";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$api = "https://akbp3leva.gerardoleonel.com/api";

new Vue({
  vuetify,
  VueQriously,
  router,
  render: (h) => h(App),
}).$mount("#app");
