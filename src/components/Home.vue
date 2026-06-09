<template>
    <div class="justify-center text-center flex items-center min-h-screen w-full">

      <div class="w-full xl:w-3/4 py-10 space-y-10">
        <h1 class="text-xl text-white font-bold">WELCOME TO CASURECO 1</h1>
        <div class="grid grid-cols-1 md:w-1/2 lg:w-1/3 mx-auto gap-3 px-10">
            <router-link :to="{name: 'ReportBrownout'}" class="btn btn-primary justify-center">Report A Brownout</router-link>
            <router-link :to="{name: 'PowerOutageMap'}" class="btn btn-primary justify-center">Power Outage Map</router-link>
            <router-link :to="{name: 'BillInquiry'}" class="btn btn-primary justify-center">Bill Inquiry</router-link>
            <router-link :to="{name: 'NewConnectionApplication'}" class="btn btn-primary justify-center">Electrical Service</router-link>

            <button
              v-if="showNotifButton"
              :disabled="notifLoading"
              class="btn btn-primary justify-center gap-2 opacity-80 hover:opacity-100"
              @click="enableNotifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span>{{ notifLoading ? 'Enabling...' : 'Enable Notifications' }}</span>
            </button>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { subscribeUserToPush } from '../push.js';

  export default {
    name: "Home",
    data() {
      return {
        showNotifButton: false,
        notifLoading: false,
      };
    },
    async mounted() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
      if (Notification.permission === "granted") {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        if (existing) return;
      }
      if (Notification.permission !== "denied") {
        this.showNotifButton = true;
      }
    },
    methods: {
      async enableNotifications() {
        this.notifLoading = true;
        try {
          await subscribeUserToPush();
          this.showNotifButton = false;
          this.$swal({ icon: "success", title: "Notifications enabled!", text: "You'll receive power outage alerts." });
        } catch (err) {
          this.$swal({ icon: "error", title: "Could not enable notifications", text: err.message });
        } finally {
          this.notifLoading = false;
        }
      },
    },
  };
  </script>
  