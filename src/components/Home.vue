<template>
    <div class="justify-center text-center flex items-center min-h-screen w-full">
       
      <div class="w-full py-10 space-y-10">
        <h1 class="text-xl text-white font-bold">WELCOME TO CASURECO 1</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-10">
            <router-link :to="{name: 'ReportBrownout'}" class="btn btn-danger justify-center">Report A Brownout</router-link>
            <router-link :to="{name: 'BillInquiry'}" class="btn btn-danger justify-center">Bill Inquiry</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Home",
  };
  </script>
  