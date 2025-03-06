import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'sweetalert2/dist/sweetalert2.min.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import './style.css'
import './serviceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
