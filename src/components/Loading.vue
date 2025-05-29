<template>
  <div>
    <!-- Overlay -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
      <!-- Spinner -->
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      isLoading: state => state.application.isLoading
    })
  },
};
</script>
