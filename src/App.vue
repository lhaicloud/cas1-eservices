<template>
    <div class="relative min-h-screen flex flex-col">
       <main class="flex-grow py-4">
            <router-view :key="$route.fullPath"></router-view>
        </main>
        <footer class="absolute bottom-0 w-full bg-gray-800 text-white text-center p-1 text-xs">
            Camarines Sur 1 Electric Cooperative, Inc. © 2025.
        </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: "App",
  };
  </script>
  