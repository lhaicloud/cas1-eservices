<template>
    <div class="justify-center text-center flex items-center min-h-screen w-full">
       
      <div class="w-full xl:w-3/4 py-10 space-y-10">
        <h1 class="text-xl text-white font-bold">WELCOME TO CASURECO 1</h1>
        <div class="grid grid-cols-1 md:w-1/2 lg:w-1/3 mx-auto gap-3 px-10">
            <router-link :to="{name: 'ReportBrownout'}" class="btn btn-primary justify-center">Report A Brownout</router-link>
            <!-- <router-link :to="{name: 'BillInquiry'}" class="btn btn-primary justify-center">Bill Inquiry</router-link> -->
            <router-link :to="{name: 'ElectricalServiceApplication'}" class="btn btn-primary justify-center">Electrical Service</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Home",
  };
  </script>
  