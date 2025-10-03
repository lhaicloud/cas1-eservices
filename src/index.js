import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'sweetalert2/dist/sweetalert2.min.css';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import VueSweetalert2 from 'vue-sweetalert2';

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import './style.css'

import { subscribeUserToPush  } from "./push.js";

Vue.config.productionTip = false;

Vue.use(VueSweetalert2, {
  customClass: {
    title: 'text-xl font-semibold text-gray-800',
    htmlContainer: 'text-sm text-gray-600',
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow mx-1',
    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-lg shadow mx-1'
  },
  buttonsStyling: false // important so Tailwind classes take effect
});

// Register Service Worker

if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("/serviceWorker.js")
    .then(async (reg) => {
      console.log("✅ Service Worker registered:", reg);

      try {
        const swReg = await navigator.serviceWorker.ready;

        // ✅ Check if user is already subscribed
        const existingSubscription = await swReg.pushManager.getSubscription();

        if (!existingSubscription) {
          // Not yet subscribed → subscribe now
          const success = await subscribeUserToPush();

          if (success) {
            swReg.showNotification("🎉 Subscribed Successfully!", {
              body: "You will now receive push notifications.",
              icon: "/images/icons/icon-192x192.png",
              badge: "/images/icons/icon-72x72.png",
            });
          }
        } else {
          console.log("ℹ️ Already subscribed, skipping notification.");
        }
      } catch (err) {
        console.error("❌ Push subscription failed:", err);
      }
    })
    .catch((err) => console.error("❌ SW registration failed:", err));
}







new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
