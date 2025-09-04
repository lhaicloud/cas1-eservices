<template>
    <div class="text-xs lg:text-base justify-center flex">
        
        <div class="w-full md:w-2/3 xl:w-2/5 pb-10">
            <div class="flex items-center gap-3 px-3 py-2">
                <router-link :to="{ name: 'ReportBrownout'}" class="text-white">< Back</router-link>
            </div>
            <ul class="flex items-center px-3 gap-3 py-3 ">
                <li class="border-b-2 text-center flex-1 py-2 cursor-pointer" :class="activeTab == 1 ? 'border-b-2 border-white text-white font-extrabold ' : 'border-gray-300 hover:border-gray-300 text-gray-300'" @click="activeTab=1">Active Ticket</li>
                <li class="border-b-2 text-center flex-1 py-2 cursor-pointer" :class="activeTab == 2 ? 'border-b-2 border-white text-white font-extrabold' : 'border-gray-300 hover:border-gray-300 text-gray-300'" @click="activeTab=2">Ticket History</li>
            </ul>
            <!-- <div v-if="activeTab == 1" class="px-3">
                <ul class="space-y-3">
                    <li v-for="pending in data.pending_ticket" class="bg-white rounded-lg border px-5 py-4">
                        <div class="grid grid-cols-2">
                            <h4 class="col-span-2 font-medium border-b pb-2 mb-2">{{ formatDate(pending.created_at) }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-1">Ticket No.</h4> 
                            <div class="flex-none px-1">:</div>
                            <h4 class="flex-1 font-medium">{{ pending.ticket_no.toString().padStart(7, '0') }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-1">Name</h4> 
                            <div class="flex-none px-1">:</div>
                            <h4 class="flex-1">{{ pending.name }}</h4>
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
                            <h4 class="flex-1">Status</h4>
                            <div class="flex-none px-1">:</div>
                            <div class="flex-1 font-bold" :class="statusClass[pending.status]">{{ formatStatus(pending.status) }}</div>
                        </div>
                        <div class="flex">
                            <h4 class="flex-1">Message</h4>
                            <div class="flex-none px-1">:</div>
                            <div class="flex-1 break-words overflow-auto">{{ pending.message }}</div>
                        </div>
                         
                    </li>
                    <li v-if="data && data.pending_ticket.length == 0 || !data" class="text-sm font-medium text-center bg-white p-5 rounded-md border"><h4>No active ticket</h4></li>
                </ul>
            </div> -->
            <div v-if="activeTab == 1" class="px-3">
                <ul class="space-y-3">
                    <li v-for="pending in tickets.pending_ticket" :key="pending.ticket_no" class="bg-white rounded-lg border px-5 py-4">
                        <div class="grid grid-cols-2 text-center">
                            <h4 class="col-span-2 font-medium border-b pb-2 mb-2">Ticket No. {{ pending.ticket_no.toString().padStart(7, '0') }}</h4>
                        </div>
                        <div class="space-y-1">
                           
                            <div class="flex">
                                <h4 class="flex-1">Name</h4> 
                                <div class="flex-none px-1">:</div>
                                <h4 class="flex-1">{{ pending.name }}</h4>
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
                            <!-- <div class="flex">
                                <h4 class="flex-1">Status</h4>
                                <div class="flex-none px-1">:</div>
                                <div class="flex-1 font-bold" :class="statusClass[pending.status]">
                                    {{ formatStatus(pending.status) }}
                                </div>
                            </div> -->
                            <div class="flex">
                                <h4 class="flex-1">Message</h4>
                                <div class="flex-none px-1">:</div>
                                <div class="flex-1 break-words overflow-auto">{{ pending.message }}</div>
                            </div>
                            <!-- <div class="flex">
                                <h4 class="flex-1">Remarks/Action</h4>
                                <div class="flex-none px-1">:</div>
                                <div class="flex-1 break-words overflow-auto">{{ pending.remarks }}</div>
                            </div> -->
                        </div>
                        

                        <!-- ✅ Timeline Stepper -->
                        <div class="mt-4 border-t pt-3">
                            <h4 class="font-medium mb-3">Timeline</h4>
                            <div class="relative pl-6">
                                <div class="absolute top-0 left-2 w-0.5 h-full bg-gray-300"></div>

                                <div v-if="pending.created_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="pending.status == 0 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="pending.status == 0 ? 'font-bold' : 'font-medium'">Submitted</p>
                                    <p class="text-gray-600" :class="pending.status == 0 ? 'font-semibold' : ''">{{ formatDate(pending.created_at) }}</p>
                                </div>

                                <div v-if="pending.acknowledged_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="pending.status == 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="pending.status == 1 ? 'font-bold' : 'font-medium'">Acknowledged</p>
                                    <p class="text-gray-600" :class="pending.status == 1 ? 'font-semibold' : ''">{{ formatDate(pending.acknowledged_at) }}</p>
                                </div>

                                <div v-if="pending.troubleshoot_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="pending.status == 2 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="pending.status == 2 ? 'font-bold' : 'font-medium'">Troubleshoot Started</p>
                                    <p class="text-gray-600" :class="pending.status == 2 ? 'font-semibold' : ''">{{ formatDate(pending.troubleshoot_at) }}</p>
                                    <p class="text-gray-500 mt-1">Our maintenance team is on their way to troubleshoot the issue</p>
                                </div>
                                 <div v-if="pending.resolved_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="pending.status == 3 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="pending.status == 3 ? 'font-bold' : 'font-medium'">Resolved</p>
                                    <p class="text-gray-600" :class="pending.status == 3 ? 'font-semibold' : ''">{{ formatDate(pending.resolved_at) }}</p>
                                    <p class="text-gray-500 mt-1">{{ pending.remarks }}</p>
                                    <p class="mt-2">
                                        <button class="bg-blue-600 py-1 px-2 rounded text-white hover:bg-blue-500 active:bg-blue-700 text-xs" @click="updateTicket(pending)">Close Ticket</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li v-if="tickets && tickets.pending_ticket.length == 0 || !tickets" class="text-sm font-medium text-center bg-white p-5 rounded-md border">
                        <h4>No active ticket</h4>
                    </li>
                </ul>
            </div>


            <div v-if="activeTab == 2" class="px-3">
                <ul class="space-y-3">
                    <li v-for="history in tickets.ticket_history" class="bg-white rounded-lg border px-5 py-4">
                        <div class="grid grid-cols-2 text-center">
                            <h4 class="col-span-2 font-medium border-b pb-2 mb-2">Ticket No. {{ history.ticket_no.toString().padStart(7, '0') }}</h4>
                        </div>
                        <div class="space-y-1">
                            <!-- <div class="flex">
                                <h4 class="flex-1">Ticket No.</h4> 
                                <div class="flex-none px-1">:</div>
                                <h4 class="flex-1 font-medium">{{ history.ticket_no.toString().padStart(7, '0') }}</h4>
                            </div> -->
                            <div class="grid grid-cols-2">
                                <h4 class="col-span-1">Name</h4> 
                                <h4 class="col-span-1">: {{ history.name }}</h4>
                            </div>
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
                            <!-- <div class="flex">
                                <h4 class="flex-1">Status</h4>
                                <div class="flex-none px-1">:</div>
                                <div class="flex-1 font-bold" :class="statusClass[history.status]">{{ formatStatus(history.status) }}</div>
                            </div> -->
                            <div class="flex">
                                <h4 class="flex-1">Message</h4>
                                <div class="flex-none px-1">:</div>
                                <div class="flex-1 break-words overflow-auto">{{ history.message }}</div>
                            </div>
                            <!-- <div class="flex">
                                <h4 class="flex-1">Remarks</h4>
                                <div class="flex-none px-1">:</div>
                                <div class="flex-1 break-words overflow-auto">{{ history.remarks }}</div>
                            </div> -->
                        </div>
                        <!-- ✅ Timeline Stepper -->
                        <div class="mt-4 border-t pt-3">
                            <h4 class="font-medium mb-3">Timeline</h4>
                            <div class="relative pl-6">
                                <div class="absolute top-0 left-2 w-0.5 h-full bg-gray-300"></div>

                                <div v-if="history.created_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="history.status == 0 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="history.status == 0 ? 'font-bold' : 'font-medium'">Submitted</p>
                                    <p class="text-gray-600" :class="history.status == 0 ? 'font-semibold' : ''">{{ formatDate(history.created_at) }}</p>
                                </div>

                                <div v-if="history.acknowledged_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="history.status == 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="history.status == 1 ? 'font-bold' : 'font-medium'">Acknowledged</p>
                                    <p class="text-gray-600" :class="history.status == 1 ? 'font-semibold' : ''">{{ formatDate(history.acknowledged_at) }}</p>
                                </div>

                                <div v-if="history.troubleshoot_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="history.status == 2 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="history.status == 2 ? 'font-bold' : 'font-medium'">Troubleshoot Started</p>
                                    <p class="text-gray-600" :class="history.status == 2 ? 'font-semibold' : ''">{{ formatDate(history.troubleshoot_at) }}</p>
                                    <p class="text-gray-500 mt-1">Our maintenance team is on their way to troubleshoot the issue</p>
                                </div>

                                <div v-if="history.resolved_at" class="relative mb-3">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="history.status == 3 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="history.status == 3 ? 'font-bold' : 'font-medium'">Resolved</p>
                                    <p class="text-gray-600" :class="history.status == 3 ? 'font-semibold' : ''">{{ formatDate(history.resolved_at) }}</p>
                                    <p class="text-gray-500 mt-1">{{ history.remarks }}</p>
                                </div>

                                <div v-if="history.closed_at" class="relative">
                                    <div class="absolute -left-5 top-3 w-3 h-3 rounded-full" :class="history.status == 4 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                    <p :class="history.status == 4 ? 'font-bold' : 'font-medium'">Closed</p>
                                    <p class="text-gray-600" :class="history.status == 4 ? 'font-semibold' : ''">{{ formatDate(history.closed_at) }}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li v-if="tickets && tickets.ticket_history.length == 0 || !tickets" class="text-sm font-medium text-center bg-white p-5 rounded-md border"><h4>No ticket history</h4></li>
                </ul>
            </div>
        </div>
        
     </div>
 </template>
 
 <script>
 import axios from 'axios'
     export default {
        props: ['data','tab'],
         created() {
            if(!this.data){
                this.getMyTicketHistory()
            } else {
                this.tickets = this.data
            }
         },
         data(){
            return{
                activeTab: this.tab || 1,
                statusClass: {
                    0: 'text-[#E53935]',
                    1: 'text-[#FBC02D]',
                    2: 'text-[#1E88E5]',
                    3: 'text-[#26A69A]',
                    4: 'text-[#9E9E9E]',
                },
                tickets: {
                    pending_ticket: [], 
                    ticket_history: []
                },
            }
         },
         methods: {
            formatDate(dt){
                const date = new Date(dt);
                const formattedDate = date.toLocaleString("en-US", {
                    timeZone: "Asia/Singapore",
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });

                return formattedDate;
            },
            formatStatus(status){
                switch(status) {
                    case 0:
                        return 'Open';
                    case 1:
                        return 'Acknowledged';
                    case 2:
                        return 'Troubleshooting';
                    case 3:
                        return 'Resolved';
                    case 4:
                        return 'Closed';
                    default:
                        return 'Unknown Status';
                }
            },
            async getMyTicketHistory(){
                const userDeviceID = this.getDeviceId()
                this.$store.commit("setLoading", true);
                await fetch(`${import.meta.env.VITE_API_URL}/ticket/get_my_ticket/${userDeviceID}`)
                .then(response => response.json())
                .then(data => {
                    this.tickets = data
                    this.$store.commit("setLoading", false);
                })
                .catch(error => {
                    console.error("Error fetching address:", error);
                    this.$store.commit("setLoading", false);
                });
                
            },
            getDeviceId() {
                let deviceId = localStorage.getItem("device_id");
                if (!deviceId) {
                    deviceId = crypto.randomUUID(); // Generate a new ID
                    localStorage.setItem("device_id", deviceId);
                }
                return deviceId;
            },
            updateTicket(ticket) {
                const troubleshootingRemarks = ticket.remarks
                this.$store.commit("setLoading", true);
                axios
                    .get(`${import.meta.env.VITE_API_URL}/ticket/update/${ticket._id}/${4}`, { params: { remarks: troubleshootingRemarks } })
                    .then((response) => {
                        this.$store.commit("setLoading", false);
                        this.getMyTicketHistory();
                    })
                    .catch((error) => {
                        this.$store.commit("setLoading", false);
                        console.error("Error updating ticket:", error);
                    });
            },
         },
     }
 </script>