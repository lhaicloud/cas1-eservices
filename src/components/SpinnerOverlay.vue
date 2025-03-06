<template>
    <div class="loading-overlay">
         <div class="spinner"></div>
     </div>
 </template>
 
 <script>
     export default {
         mounted() {
             console.log('Component mounted.')
         }
     }
 </script>
 <style scoped>
 .loading-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 9999;
 }
 
 .spinner {
   width: 50px;
   height: 50px;
   border: 5px solid #ffffff;
   border-top: 5px solid transparent;
   border-radius: 50%;
   animation: spin 1s linear infinite;
 }
 
 @keyframes spin {
   100% {
     transform: rotate(360deg);
   }
 }
 </style>
 