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

                            <div
                            class="relative mb-3 shadow-md rounded-lg p-3 border"
                            :class="index === displayLogs(pending.ticket_logs).length - 1 ? 'border-blue-300 bg-blue-50' : 'border-gray-300'"
                            v-for="(log, index) in displayLogs(pending.ticket_logs)"
                            :key="log._id"
                            >
                            <div class="absolute h-0.5 w-5 -left-5 top-2" :class="index === displayLogs(pending.ticket_logs).length - 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                        
                            <div class="absolute -left-6 top-0 w-4 h-4 rounded-full"
                                :class="index === displayLogs(pending.ticket_logs).length - 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>

                            <p :class="index === displayLogs(pending.ticket_logs).length - 1 ? 'font-bold' : 'font-medium'">
                                {{ formatStatus(log) }}
                            </p>

                            <p class="text-gray-600"
                                :class="index === displayLogs(pending.ticket_logs).length - 1 ? 'font-semibold' : ''">
                                {{ formatDate(log.created_at) }}
                            </p>

                            <p v-if="log.remarks" class="text-gray-500 mt-1">{{ log.remarks }}</p>

                            <!-- ✅ Confirmation only for latest resolve -->
                            <div
                                class="mt-2"
                                v-if="
                                log.status_type === 'resolve' &&
                                pending.status === 4 &&
                                log._id === latestResolveId(pending.ticket_logs)
                                "
                            >
                                <h1>Can you confirm if you now have electricity?</h1>
                                <div class="flex gap-3 mt-1">
                                <button
                                    class="bg-blue-600 py-1 px-2 rounded text-white hover:bg-blue-500 active:bg-blue-700 text-xs"
                                    @click="updateTicket(pending, 2)"
                                >
                                    Yes, I Do
                                </button>
                                <button
                                    class="bg-red-600 py-1 px-2 rounded text-white hover:bg-red-500 active:bg-red-700 text-xs"
                                    @click="updateTicket(pending, 9)"
                                >
                                    No, I Don't
                                </button>
                                </div>
                            </div>
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

                                <div
                               class="relative mb-3 shadow-md rounded-lg p-3 border"
                                :class="index === displayLogs(history.ticket_logs).length - 1 ? 'border-blue-300 bg-blue-50' : 'border-gray-300'"
                                v-for="(log, index) in displayLogs(history.ticket_logs)"
                                :key="log._id"
                                >
                                <div class="absolute h-0.5 w-5 -left-5 top-2" :class="index === displayLogs(history.ticket_logs).length - 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                <div class="absolute -left-6 top-0 w-4 h-4 rounded-full"
                                    :class="index === displayLogs(history.ticket_logs).length - 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>

                                <p :class="index === displayLogs(history.ticket_logs).length - 1 ? 'font-bold' : 'font-medium'">
                                    {{ formatStatus(log) }}
                                </p>

                                <p class="text-gray-600"
                                    :class="index === displayLogs(history.ticket_logs).length - 1 ? 'font-semibold' : ''">
                                    {{ formatDate(log.created_at) }}
                                </p>

                                <p v-if="log.remarks" class="text-gray-500 mt-1">{{ log.remarks }}</p>

                                <!-- ✅ Confirmation only for latest resolve -->
                                <div
                                    class="mt-2"
                                    v-if="
                                    log.status_type === 'resolve' &&
                                    history.status === 4 &&
                                    log._id === latestResolveId(history.ticket_logs)
                                    "
                                >
                                    <h1 class="text-sm">Can you confirm if you now have electricity?</h1>
                                    <div class="flex gap-3 mt-1">
                                    <button
                                        class="bg-blue-600 py-1 px-2 rounded text-white hover:bg-blue-500 active:bg-blue-700 text-xs"
                                        @click="updateTicket(history, 2)"
                                    >
                                        Yes, I Do
                                    </button>
                                    <button
                                        class="bg-red-600 py-1 px-2 rounded text-white hover:bg-red-500 active:bg-red-700 text-xs"
                                        @click="updateTicket(history, 9)"
                                    >
                                        No, I Don't
                                    </button>
                                    </div>
                                </div>
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
                    1: 'text-[#E53935]',
                    6: 'text-[#FBC02D]',
                    8: 'text-[#1E88E5]',
                    4: 'text-[#26A69A]',
                    2: 'text-[#9E9E9E]',
                    9: 'text-[#8E24AA]',
                },
                areaMap: {
                    '11': 'Libmanan',
                    '12': 'Cabusao',
                    '13': 'Pasacao',
                    '14': 'Pamplona',
                    '15': 'Gainza',
                    '16': 'Camaligan',
                    '17': 'San Fernando',
                    '18': 'Sipocot',
                    '19': 'Ragay',
                    '20': 'Lupi',
                    '30': 'Del Gallego',
                },
                statusMap: {
                    open: () => 'Open',
                    acknowledge: () => 'Acknowledged',
                    troubleshoot: () => 'Troubleshooting',
                    resolve: () => 'Resolved',
                    close: () => 'Closed',
                    reopen: () => 'Reopened',
                    reassign: () => 'Troubleshooting (Reassigned)',
                    transfer: (log) => `Transferred to ${this.areaMap?.[log.areacode] || 'Unknown Area'}`
                },
                tickets: {
                    pending_ticket: [], 
                    ticket_history: []
                },
            }
         },
         methods: {
            formatDate(dt) {
                if (!dt) return "";
                const date = new Date(dt);
                return date.toLocaleString("en-US", {
                timeZone: "Asia/Singapore",
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                });
            },

            formatStatus(log){
                const formatter = this.statusMap[log.status_type];
                return formatter ? formatter(log) : 'Unknown Status';
            },

            // Returns logs sorted by created_at + only last troubleshoot
            displayLogs(logs) {
                if (!logs) return [];

                // Normalize created_at to hour:minute
                const normalizeTime = (dateStr) => {
                    return new Date(dateStr).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    });
                };

                // Group by status_type + created_at (hour:minute)
                const grouped = {};
                logs.forEach((log) => {
                    const timeKey = normalizeTime(log.created_at);
                    const key = `${log.status_type}-${timeKey}`;
                    if (!grouped[key]) {
                    grouped[key] = { ...log, created_time: timeKey };
                    }
                });

                // Convert grouped object back to array and sort by created_at
                return Object.values(grouped).sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
            },

            latestResolveId(logs) {
                if (!logs) return null;
                const resolves = logs
                .filter(l => l.status_type === "resolve")
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // newest first
                return resolves.length ? resolves[0]._id : null;
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
            updateTicket(ticket, newStatus) {
                const troubleshootingRemarks = ticket.remarks
                const userDeviceID = this.$route.query.token && this.messengerID ? this.messengerID : this.getDeviceId()
                this.$store.commit("setLoading", true);
                axios
                    .get(`${import.meta.env.VITE_API_URL}/ticket/update/${ticket.ticket_no}/${newStatus}/${userDeviceID}`, { params: { remarks: troubleshootingRemarks } })
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