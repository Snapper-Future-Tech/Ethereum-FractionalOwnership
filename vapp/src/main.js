import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import Axios from 'axios'

Vue.config.productionTip = false;

Vue.prototype.$url = 'http://localhost:9002/';
Vue.prototype.$http = Axios;
Vue.prototype.$tokenRatio = 1000;
Vue.prototype.$notificationTimeout = 5000;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
