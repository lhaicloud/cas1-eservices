<template>
    <div class="text-xs lg:text-base">
        <ul class="flex items-center px-3 gap-3 py-3 ">
            <li class="border-b-2 text-center flex-1 py-2 cursor-pointer" :class="activeTab == 'Pending' ? 'border-b-2 border-red-500 font-semibold text-red-500 ' : 'border-gray-300 hover:border-gray-300 text-white'" @click="activeTab='Pending'">Active Ticket</li>
            <li class="border-b-2 text-center flex-1 py-2 cursor-pointer" :class="activeTab == 'History' ? 'border-b-2 border-red-500 font-semibold text-red-500' : 'border-gray-300 hover:border-gray-300 text-white'" @click="activeTab='History'">Ticket History</li>
        </ul>
        <div v-if="activeTab == 'Pending'" class="px-3">
            <ul class="space-y-3">
                <li v-for="pending in data.pending_ticket" class="bg-white rounded-lg border px-5 py-4">
                    <div class="grid grid-cols-2">
                        <h4 class="col-span-2 font-medium border-b pb-2 mb-2">{{ formatDate(pending.created_at) }}</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Ticket No.</h4> 
                        <div class="flex-none px-1">:</div>
                        <h4 class="flex-1 font-medium">ABC20250304123</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Mobile No.</h4>
                        <div class="flex-none px-1">:</div>
                        <h4 class="flex-1">{{ pending.mobile }}</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Address</h4>
                        <div class="flex-none px-1">:</div>
                        <h4 class="flex-1">{{ pending.address }}</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Message</h4>
                        <div class="flex-none px-1">:</div>
                        <div class="flex-1 break-words overflow-auto">{{ pending.message }}</div>
                    </div>
                </li>
                <li v-if="data && data.pending_ticket.length == 0 || !data" class="text-sm font-medium text-center bg-white p-5 rounded-md border"><h4>No active ticket</h4></li>
            </ul>
        </div>
        <div v-if="activeTab == 'History'" class="px-3">
            <ul class="space-y-3">
                <li v-for="history in data.ticket_history" class="bg-white rounded-lg border px-5 py-4">
                    <div class="grid grid-cols-2">
                        <h4 class="col-span-2 font-medium border-b pb-2 mb-2">{{ formatDate(history.created_at) }}</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Ticket No.</h4> 
                        <div class="flex-none px-1">:</div>
                        <h4 class="flex-1 font-medium">ABC20250304123</h4>
                    </div>
                    <!-- <div class="grid grid-cols-2">
                        <h4 class="col-span-1">Name</h4> 
                        <h4 class="col-span-1">: {{ history.name }}</h4>
                    </div> -->
                    <div class="flex">
                        <h4 class="flex-1">Mobile No.</h4>
                        <div class="flex-none px-1">:</div>
                        <h4 class="flex-1">{{ history.mobile }}</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Address</h4>
                        <div class="flex-none px-1">:</div>
                        <h4 class="flex-1">{{ history.address }}</h4>
                    </div>
                    <div class="flex">
                        <h4 class="flex-1">Message</h4>
                        <div class="flex-none px-1">:</div>
                        <div class="flex-1 break-words overflow-auto">{{ history.message }}</div>
                    </div>
                </li>
                <li v-if="data && data.ticket_history.length == 0 || !data" class="text-sm font-medium text-center bg-white p-5 rounded-md border"><h4>No ticket history</h4></li>
            </ul>
        </div>
     </div>
 </template>
 
 <script>
     export default {
        props: [ 'data' ],
         mounted() {
            if(!this.data){this.$router.push({name: "ReportBrownout"})}
         },
         data(){
            return{
                activeTab: 'Pending'
            }
         },
         methods: {
            formatDate(dt){
                const date = new Date(dt);

                const formattedDate = date.toLocaleString("en-US", {
                    timeZone: "Asia/Manila",
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });

                return formattedDate;
            }
         }
     }
 </script>