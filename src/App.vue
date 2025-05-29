<template>
    <div class="relative min-h-screen flex flex-col">
      <SpinnerOverlay v-if="isLoading"/>
      
      <header class="bg-blue-700 text-white text py-2.5 px-5 text-sm flex items-center gap-x-2" @click="$router.push('/')"><img src="/images/cas1-logo.svg" alt="logo" width="25" > CASURECO I</header>
       <main class="flex-grow py-4">
            <router-view :key="$route.fullPath"></router-view>
        </main>
        <footer class="absolute bottom-0 w-full bg-gray-800 text-white text-center p-1 text-xs">
            Camarines Sur 1 Electric Cooperative, Inc. © 2025.
        </footer>
    </div>
  </template>
  
  <script>
  import SpinnerOverlay from './components/SpinnerOverlay.vue';
  import { mapState } from 'vuex';
  export default {
    name: "App",
    components: {
      SpinnerOverlay
    },
    computed: {
      ...mapState({
        isLoading: state => state.isLoading
      }),
    },
    mounted(){
      this.$store.commit("setLoading", false);
    }
  };
  </script>
  