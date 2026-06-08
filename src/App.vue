<template>
  <div class="relative flex flex-col h-screen ">
    <SpinnerOverlay v-if="isLoading" />

    <header
      class="bg-blue-700 text-white py-2.5 px-4 text-sm flex items-center gap-x-3 w-full z-10"
    >
      <button
        v-if="showBackButton"
        type="button"
        class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors"
        @click="goBack"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>

      <button
        type="button"
        class="flex items-center gap-x-2 min-w-0"
        @click="$router.push('/')"
      >
        <img src="/images/cas1-logo.svg" alt="logo" width="25" />
        <span class="truncate">CASURECO I</span>
      </button>
    </header>

    <main class="flex-grow relative ">
      <router-view :key="$route.fullPath" />
    </main>

    <!-- Optional footer -->
    <!--
    <footer class="w-full bg-gray-800 text-white text-center p-1 text-xs">
      Camarines Sur 1 Electric Cooperative, Inc. © 2025.
    </footer>
    -->
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
      showBackButton() {
        return this.$route.name && this.$route.name !== 'Home';
      }
    },
    methods: {
      goBack() {
        if (window.history.length > 1) {
          this.$router.back();
          return;
        }

        this.$router.push('/');
      }
    },
    mounted(){
      this.$store.commit("setLoading", false);
    }
  };
  </script>
  
