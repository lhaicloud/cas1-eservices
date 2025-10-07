<template>
    <div class="flex items-center justify-center text-xs lg:text-base min-h-screen text-gray-800">
        <!-- <header class="absolute top-0 w-full bg-gray-800 text-white justify-center p-2 text-xs flex items-center gap-1 px-2">
            <img src="/images/cas1-logo.webp" alt="CASURECO 1 LOGO" width="15" height="20"> CASURECO I
        </header> -->
        <!-- <div v-if="isMessengerBrowser" class="text-justify bg-red-500 text-white p-5 rounded-lg">
            <h1>To provide accurate results, we need access to your location.
Please open this link in your device’s main browser (like Chrome or Safari), as Facebook Messenger’s built-in browser may not allow location access.</h1>
        </div> -->
        <SpinnerOverlay v-if="isLoading"/>
        <div class="w-full md:w-1/2 xl:w-2/5 grid grid-cols-1 m-3 space-y-2 pb-10">
            
            <!-- <div v-if="!tickets" class="border border-gray-300 rounded-lg bg-white p-5"> -->
            <div>
                <div v-if="!isSummary" class="rounded-lg space-y-5 bg-white p-5">
                    <h3 class="font-bold text-center text-base border-b pb-3">Brownout Report</h3>
                    <div v-if="tickets && tickets.pending_ticket.length > 0" class="bg-orange-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700">
                    <!-- <div class="bg-orange-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700"> -->
                        <router-link :to="{ name: 'TicketDetails', params: { data: tickets, tab: 1 }}">You already have an active ticket. You can’t create a new one until it’s resolved or closed. <span class="font-medium text-blue-700 hover:border-b border-blue-700">Click here to view details</span>.</router-link>
                    </div>
                    <div v-if="tickets && tickets.ticket_history.length > 0 && tickets.pending_ticket.length == 0" class="bg-blue-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700">
                        
                        <router-link :to="{ name: 'TicketDetails', params: { data: tickets, tab: 2 }}">You have {{ tickets.ticket_history.length }} resolved ticket{{ tickets.ticket_history.length !== 1 ? 's' : '' }} in the past 30 days. <span class="font-medium text-blue-700 hover:border-b border-blue-700">Click here to view details</span></router-link>
                    </div>
                    <ul class="flex justify-center gap-5">
                        <li class="p-2 cursor-pointer hover:border-b-2 hover:border-blue-500" :class="!isFollowUp ? 'border-b-2 text-blue-700 border-blue-700 font-semibold hover:border-blue-700 hover:border-b-2' : ''" @click="isFollowUp = false;">
                            Submit A Report
                        </li>
                        <li class="p-2 cursor-pointer hover:border-b-2 hover:border-blue-500" :class="isFollowUp ? 'border-b-2 text-blue-700 border-blue-700 font-semibold hover:border-blue-700 hover:border-b-2' : ''" @click="isFollowUp = true;"> 
                            Follow-up Report
                        </li>
                    </ul>
                    <!-- <div class="space-y-3 p-4 rounded-2xl shadow bg-white border">
                        <p class="text-sm font-medium text-gray-800">
                           Would you like to submit a new report or follow up on an existing one?
                        </p>
                        <div class="flex gap-3">
                            <button
                            class="px-4 py-2 rounded-xl text-sm font-medium transition"
                            :class="isFollowUp ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
                            @click="isFollowUp = true"
                            >
                            Yes
                            </button>
                            <button
                            class="px-4 py-2 rounded-xl text-sm font-medium transition"
                            :class="isFollowUp === false ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
                            @click="isFollowUp = false"
                            >
                            No
                            </button>
                        </div>
                    </div> -->

                    <div v-if="isFollowUp !== null && isFollowUp" class="space-y-3">
                        <div class="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm" v-if="Object.values(errors).some(error => error)">
                            <ul class="text-left px-5 m-0 list-disc">
                                <li v-for="error in errors" v-if="error"><small>{{ error }}</small></li>
                            </ul>
                        </div>
                        <p class="text-sm">
                            Please enter your Ticket Number:
                        </p>
                        <div class="flex gap-1 mt-2">
                            <div class="relative space-y-1 flex-grow">
                                <input
                                    id="ticketno"
                                    type="tel"
                                    v-model="TicketNo"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1',
                                    errors.ticket ? 'border-red-500 ring-red-500 ' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    placeholder=" "
                                    autocomplete="off"
                                    @keyup.enter="followUpTicket"
                                    ref="ticketno"
                                    
                                />
                                <label
                                    for="ticketno"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    (TicketNo) ? '-top-3 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.ticket ? '' : '',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                    ref="accountLabel"
                                >
                                    Ticket Number:
                                </label>
                            </div>
                            <button class="px-3 bg-gray-200 rounded-md border-gray-400 active:bg-gray-300 hover:bg-gray-300" @click="followUpTicket">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" role="img">
                                    <circle cx="11" cy="11" r="7"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </div>
                        <div v-if="followedTicket" class="mt-5">
                            <div class="mt-5 space-y-3 p-4 rounded-2xl shadow border bg-white">
                                <div class="grid grid-cols-2 text-center">
                                <h4 class="col-span-2 font-medium border-b pb-2 mb-2">Ticket No. {{ followedTicket.ticket_no.toString().padStart(7, '0') }}</h4>
                            </div>
                            <div class="space-y-1">
                                <!-- <div class="flex">
                                    <h4 class="flex-1">Ticket No.</h4> 
                                    <div class="flex-none px-1">:</div>
                                    <h4 class="flex-1 font-medium">{{ history.ticket_no.toString().padStart(7, '0') }}</h4>
                                </div> -->
                                <div class="grid grid-cols-2">
                                    <h4 class="col-span-1">Name</h4> 
                                    <h4 class="col-span-1">: {{ followedTicket.name }}</h4>
                                </div>
                                <div class="flex">
                                    <h4 class="flex-1">Mobile No.</h4>
                                    <div class="flex-none px-1">:</div>
                                    <h4 class="flex-1">{{ followedTicket.mobile }}</h4>
                                </div>
                                <div class="flex">
                                    <h4 class="flex-1">Address</h4>
                                    <div class="flex-none px-1">:</div>
                                    <h4 class="flex-1">{{ followedTicket.address }}</h4>
                                </div>
                                <!-- <div class="flex">
                                    <h4 class="flex-1">Status</h4>
                                    <div class="flex-none px-1">:</div>
                                    <div class="flex-1 font-bold" :class="statusClass[history.status]">{{ formatStatus(history.status) }}</div>
                                </div> -->
                                <div class="flex">
                                    <h4 class="flex-1">Message</h4>
                                    <div class="flex-none px-1">:</div>
                                    <div class="flex-1 break-words overflow-auto">{{ followedTicket.message }}</div>
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

                                    <div class="relative mb-3 shadow-md rounded-lg p-3 border" :class="index === displayLogs.length - 1 ? 'border-blue-300 bg-blue-50' : 'border-gray-300'"
                                            v-for="(log, index) in displayLogs"
                                            :key="log._id">
                                        <div class="absolute -left-6 top-0 w-4 h-4 rounded-full"
                                            :class="index === displayLogs.length - 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                        <div class="absolute h-0.5 w-5 -left-5 top-2" :class="index === displayLogs.length - 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
                                        <p :class="index === displayLogs.length - 1 ? 'font-bold' : 'font-medium'">
                                            {{ formatStatus(log) }}
                                        </p>

                                        <p class="text-gray-600"
                                            :class="index === displayLogs.length - 1 ? 'font-semibold' : ''">
                                            {{ formatDate(log.created_at) }}
                                        </p>

                                        <p v-if="log.remarks" class="text-gray-500 mt-1">{{ log.remarks }}</p>
                                        <div 
                                        class="mt-2"
                                        v-if="
                                            log.status_type === 'resolve' &&
                                            followedTicket.status === 3 &&
                                            log._id === latestResolveId
                                        "
                                        >
                                        <h1>Can you confirm if you now have electricity?</h1>
                                        <div class="flex gap-3 mt-1">
                                            <button
                                            class="bg-blue-600 py-1 px-2 rounded text-white hover:bg-blue-500 active:bg-blue-700 text-xs"
                                            @click="updateTicket(followedTicket,4)"
                                            >
                                            Yes, I Do
                                            </button>
                                            <button
                                            class="bg-red-600 py-1 px-2 rounded text-white hover:bg-red-500 active:bg-red-700 text-xs"
                                            @click="updateTicket(followedTicket,5)"
                                            >
                                            No, I Don't
                                            </button>
                                        </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        
                        </div>
                    </div>
                    <div class="space-y-3" v-if="isFollowUp !== null && isFollowUp === false">
                        
                        <!-- <div v-if="tickets && tickets.pending_ticket.length == 0" class="bg-red-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700"> -->
                        <!-- <div class="bg-orange-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700" v-if="tickets_in_range.length > 0">
                            There {{ tickets_in_range.length === 1 ? 'is' : 'are' }} {{ tickets_in_range.length }} active ticket{{ tickets_in_range.length !== 1 ? 's' : '' }} in your area.
                        </div> -->
                      
                        
                        <div class="space-y-3 p-4 rounded-2xl shadow bg-white border" v-if="isFollowUp !== null && isFollowUp === false && locationType === null">
                            <p class="text-sm font-medium text-gray-800">
                                Do you have your account number?
                            </p>
                            <p class="text-xs text-gray-500">
                                If you don’t have it, you can use your current location instead.
                            </p>
                            <div class="flex gap-3">
                                <button
                                class="px-4 py-2 rounded-xl text-sm font-medium transition"
                                :class="locationType == 'account' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
                                @click="locationType = 'account'"
                                :disabled="fetching_location"
                                >
                                Yes
                                </button>
                                <button
                                class="px-4 py-2 rounded-xl text-sm font-medium transition"
                                :class="locationType == 'current' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
                                @click="locationType = 'current'"
                                :disabled="fetching_location"
                                >
                                No
                                </button>
                            </div>
                        </div>
                        
                        <div v-if="locationType !== null" class="space-y-3">
                            <div class="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm" ref="error_message" v-if="Object.values(errors).some(error => error)">
                                <ul class="text-left px-5 m-0 list-disc">
                                    <li v-for="error in errors" v-if="error"><small>{{ error }}</small></li>
                                </ul>
                            </div>
                            <div class="text-center" v-if="!isGrantedLocation && !fetching_location && locationType == 'current' && !isMessengerBrowser">
                                <button class="btn btn-success " @click="getLocation()">Allow Location Access</button>
                            </div>
                            <!-- <div v-if="!data.userLocation && !fetching_location" class="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm text-center"><small>No Location Data</small></div> -->
                            <div v-if="fetching_location && !data.userLocation" class="text-center my-3 font-bold text-md">Please wait, Fetching Location...</div>
                            <div v-if="!fetching_location && data.userLocation">

                                <l-map :zoom="zoom" :center="center" @ready="onMapReady" class=" h-36 w-full rounded z-0"  ref="map">
                                    <l-tile-layer :url="tileLayerUrl" />
                                    <l-marker v-if="data.userLocation" :zIndexOffset="1000"  :lat-lng="data.userLocation" :draggable="true" @moveend="updateLocation">
                                        <l-popup>Drag me to change location</l-popup>
                                    </l-marker>
                                    <l-marker 
                                        v-for="(marker, index) in tickets_in_range" 
                                        :key="index" 
                                        :lat-lng="[marker[1], marker[0]]"
                                        :icon="customIcon"
                                    ></l-marker>
                                    
                                    
                                </l-map>
                            </div>
                            <p class="text-xs text-gray-500 text-center my-5">
                                <h3 class="text-center">Kindly fill in the details below. You may <span class="font-bold">drag the location icon</span> to mark your location. </h3>
                            </p>

                            <!-- <div class="grid grid-cols-2 items-center p-2">
                                <div class="space-x-2 flex items-center justify-center">
                                    <input type="radio" id="inlineRadio1" name="inlineRadio" value="account" v-model="locationType" :disabled="tickets && tickets.pending_ticket.length > 0">
                                    <h1 for="inlineRadio1" @click="locationType='account'" class="cursor-pointer">Account Number</h1>
                                    
                                </div>
                                <div class="space-x-2 flex items-center justify-center">
                                    <input type="radio" id="inlineRadio2" name="inlineRadio" value="current" v-model="locationType" :disabled="tickets && tickets.pending_ticket.length > 0">
                                    <h1 for="inlineRadio2" @click="locationType='current'" class="cursor-pointer">Current location</h1>
                                </div>
                            </div> -->
                        <div v-if="locationType == 'manual'" class="space-y-3">
                            <div class="relative space-y-1">
                                <select
                                    ref="mun"
                                    id="mun"
                                    v-model="data.municipality"
                                    @change="getBrgy()"
                                    @blur="validateField('municipality')"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm appearance-none focus:outline-none focus:ring-1',
                                    errors.municipality ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    :disabled="tickets && tickets.pending_ticket.length > 0"
                                >
                                    <!-- <option disabled value="">Please Select</option> -->
                                    <option :value="mun" v-for="mun in municipalities" :key="mun.id">{{ mun.name }}</option>
                                </select>
                                <label
                                    for="mun"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    (data.municipality) ? '-top-2 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.municipality ? 'bg-red-100 text-red-500' : 'bg-white',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                >
                                    Municipality: <span class="text-red-500">*</span>
                                </label>
                            </div>
                            <div class="relative space-y-1">
                                <select
                                    ref="bgy"
                                    id="bgy"
                                    v-model="data.barangay"
                                    @blur="validateField('barangay')"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm appearance-none focus:outline-none focus:ring-1',
                                    errors.barangay ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    :disabled="!data.municipality || (tickets && tickets.pending_ticket.length > 0)"
                                >
                                    <!-- <option disabled value="">Please Select</option> -->
                                    <option :value="bgy" v-for="bgy in brgys" :key="bgy.id">{{ bgy.name }}</option>
                                </select>
                                <label
                                    for="bgy"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    data.barangay ? '-top-2 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.barangay ? 'bg-red-100 text-red-500' : 'bg-white',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                >
                                    Barangay: <span class="text-red-500">*</span>
                                </label>
                                </div>

                                <div class="relative space-y-1">
                                <input
                                    id="zone"
                                    type="text"
                                    v-model="data.zone"
                                    @blur="validateField('zone')"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1',
                                    errors.zone ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    :disabled="tickets && tickets.pending_ticket.length > 0"
                                    placeholder=" "
                                    autocomplete="off"
                                />
                                <label
                                    for="zone"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    data.zone ? '-top-2 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.zone ? 'text-red-500' : 'bg-white',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                >
                                    Sitio/Zone/Street: <span class="text-red-500">*</span>
                                </label>
                                </div>
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-3 gap-y-3">
                            <!-- Account Number -->
                            <div class="relative space-y-1" v-if="locationType == 'account'">
                                <input
                                    id="account"
                                    type="tel"
                                    v-model="data.account"
                                    @keyup="debouncedValidateField"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1',
                                    errors.account ? 'border-red-500 ring-red-500 ' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    :disabled="tickets && tickets.pending_ticket.length > 0"
                                    placeholder=" "
                                    autocomplete="off"
                                    
                                />
                                <label
                                    for="account"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    (data.account) ? '-top-3 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.account ? '' : '',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                    ref="accountLabel"
                                >
                                    Account Number: <span class="text-red-500">*</span>
                                </label>
                            </div>

                            <!-- Mobile field -->
                            <div class="relative space-y-1">
                                <input
                                id="mobile"
                                type="number"
                                v-model="data.mobile"
                                @blur="validateField('mobile')"
                                :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1',
                                    errors.mobile ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                ]"
                                :disabled="tickets && tickets.pending_ticket.length > 0"
                                placeholder=" "
                                autocomplete="off"
                                />
                                <label
                                for="mobile"
                                :class="[
                                    'absolute left-3 bg-white px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    data.mobile ? '-top-3 text-xs text-blue-500' : 'top-2 text-sm',
                                ]"
                                class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                Mobile No.: <span class="text-red-500">*</span>
                                </label>
                            </div>

                            <!-- Name field -->
                            <div class="relative space-y-1" :class="locationType == 'account' ? 'col-span-full' : 'col-span-1 order-first'">
                                <input
                                    id="name"
                                    type="text"
                                    v-model="data.name"
                                    @blur="validateField('name')"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 uppercase',
                                    errors.name ? 'border-red-500 ring-red-500 ' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    :disabled="tickets && tickets.pending_ticket.length > 0"
                                    placeholder=" "
                                    autocomplete="off"
                                />
                                <label
                                    for="name"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    (data.name) ? '-top-3 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.name ? '' : '',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                    ref="nameLabel"
                                >
                                    Name: <span class="text-red-500">*</span>
                                </label>
                            </div>

                            <!-- Account Address -->
                             <div class="relative space-y-1 col-span-full" v-if="locationType == 'account'">
                                <input
                                    id="address"
                                    type="text"
                                    v-model="data.address"
                                    @blur="validateField('address')"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 uppercase',
                                    errors.address ? 'border-red-500 ring-red-500 ' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                                    ]"
                                    :disabled="tickets && tickets.pending_ticket.length > 0"
                                    placeholder=" "
                                    autocomplete="off"
                                />
                                <label
                                    for="address"
                                    :class="[
                                    'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    (data.address) ? '-top-3 text-xs text-blue-500 bg-white' : 'top-2 text-sm bg-transparent',
                                    errors.address ? '' : '',
                                    ]"
                                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                                    ref="addressLabel"
                                >
                                    Address: <span class="text-red-500">*</span>
                                </label>
                            </div>

                            

                            <!-- Message textarea -->
                            <div class="relative col-span-full space-y-1">
                                <textarea
                                id="message"
                                rows="2"
                                v-model="data.message"
                                :disabled="tickets && tickets.pending_ticket.length > 0"
                                placeholder="(Optional, but it’s helpful for us to understand your issue better)"
                                class="peer block w-full border border-gray-300 rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                ></textarea>
                                <label
                                for="message"
                                :class="[
                                    'absolute left-3 bg-white px-1 transition-all duration-200 ease-in-out text-gray-500',
                                    data.message ? '-top-3 text-xs text-blue-500' : 'top-2 text-sm',
                                ]"
                                class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500"
                                >
                                Message:
                                </label>
                            </div>

                            </div>
                            <div class="text-center">
                                <button class="btn btn-primary w-full lg:w-1/2 justify-center" @click="submitReport()" :disabled="isLoading || tickets && tickets.pending_ticket.length > 0">Submit</button>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                </div>
                <div v-if="isSummary" class="bg-green-50 p-5 rounded-lg border border-green-200 text-green-600">
                    <div class="border-b border-green-200 pb-3 mb-5 text-center">
                        <div class="flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-green-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 class="font-semibold text-lg">Thank you!</h1>
                        <h1 class="font-medium">Your report has been submitted</h1>
                        
                    </div>
                    <div class="space-y-1.5 text-gray-800">
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Ticket No.</h4> 
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <h4 class="flex-1 font-semibold">{{ summaryData.ticket_no.toString().padStart(7, '0') }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Name</h4> 
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <h4 class="flex-1">{{ summaryData.name }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Mobile No.</h4>
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <h4 class="flex-1">{{ summaryData.mobile }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Address</h4>
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <h4 class="flex-1">{{ summaryData.address }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Date</h4>
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <h4 class="flex-1">{{ curr_datetime.toLocaleString() }}</h4>
                        </div>
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Status</h4>
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <div class="flex-1 break-words text-red-500 font-bold" >Open</div>
                        </div>
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Message</h4>
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <div class="flex-1 break-words overflow-auto">{{ summaryData.message }}</div>
                        </div>
                       
                        
                    </div>
                    <p class="mt-5 mb-5 text-black">
                        Note: <br/>
                        Kindly keep your ticket number for follow-up or status inquiries.
                    </p>
                    <button class="text-gray-800 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 py-1 px-2 text-sm rounded-md" @click="gobackhome()">Back to home</button>
                </div>
            </div>
                
            
        </div>
    </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import L from "leaflet";

// Import Leaflet Fullscreen Plugin
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
import axios from 'axios'
import SpinnerOverlay from "./SpinnerOverlay.vue";
import Tickets from "./Tickets.vue";
import debounce from 'lodash/debounce';

    export default {
        components: { LMap, LTileLayer, LMarker, LPopup,SpinnerOverlay,Tickets },
        data() {
            return {
                center: [51.505, -0.09], // Default: Manila, Philippines
                zoom: 17,
                tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                userLocation: null, // Stores user's location
                userLocation2: null,
                locationType: this.$route.query.type ?? null,
                fetching_location: false,
                data: { 
                    userLocation: "", 
                    latitude: "",
                    longitude: "",
                    mobile: this.$route.query.mobile ?? "",
                    name: this.$route.query.name ?? "",
                    zone: "",
                    barangay: "",
                    municipality: "",
                    message: this.$route.query.message ?? "",
                    account: this.$route.query.account ?? "",
                    address: "",
                    accountValid : false
                },
                errors: {
                    server: null,
                    name: null,
                    mobile: null,
                    userLocation: null,
                    municipality: null,
                    zone: null,
                    barangay: null,
                    account: null,
                    address: null
                },
                brgys: [],
                municipalities: [],
                psgcData: [],
                name_error: false,
                name_error_message: '',
                mobile_error: false,
                mobile_error_message: '',
                location_error: false,
                location_error_message: '',
                isLoading: false,
                isSummary: false,
                summaryData: [],
                curr_datetime: new Date(),
                tickets: null,
                tickets_in_range: [],
                customIcon: L.icon({
                iconUrl: "/images/marker2.png",  // Change this path
                    iconSize: [30, 30],  // Size of the icon
                    iconAnchor: [15, 30],  // Anchor point of the icon (bottom-center)
                    popupAnchor: [0, -30]  // Popup anchor position
                }),
                isMessengerBrowser: false,
                messengerID: null,
                debouncedValidateField: null,
                isGrantedLocation: false,
                TicketNo: '',
                isFollowUp: (this.$route.query.account !== null ? false : true) ?? false,
                followedTicket: null,
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
                }
            };
        },
        computed: {
            displayLogs() {
                if (!this.followedTicket?.ticket_logs) return [];

                const logs = this.followedTicket.ticket_logs;

                // Normalize created_at to hour:minute
                const normalizeTime = (dateStr) => {
                    return new Date(dateStr).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                };

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
            latestResolveId() {
                if (!this.followedTicket?.ticket_logs) return null;
                const resolves = this.followedTicket.ticket_logs
                .filter(l => l.status_type === 'resolve')
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // newest first
                return resolves.length ? resolves[0]._id : null;
            }
        },
        created() {
            if(this.$route.query.token){
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token'); // token is decoded properly now
                this.messengerID = this.decryptAES(token, import.meta.env.VITE_AES_KEY);
                localStorage.setItem("device_id", this.messengerID);
            }

            this.debouncedValidateField = debounce(this.validateAccountNumber, 500); // 300ms delay

            this.getMyTicketHistory()
            this.getPSGC()
            
           
        },
        mounted(){
            
            if (navigator.permissions) {
                navigator.permissions.query({ name: "geolocation" }).then((result) => {
                    if (result.state === "granted") {
                        this.isGrantedLocation = true;
                        this.errors.server = ""
                    }else{
                        this.isGrantedLocation = false;
                    }

                    result.onchange = () => {
                        if (result.state === "granted") {
                            this.isGrantedLocation = true;
                            console.log("✅ User allowed location access");
                        } else if (result.state === "denied") {
                            this.isGrantedLocation = false;
                            console.log("❌ User denied location access");
                        }
                    };
                });
            }
            if(this.locationType == 'account'){
               
               this.validateAccountNumber();
            }else{
                this.getLocation();
            }
            
        },
        watch: {
            locationType(newval){
                this.data.municipality = ""
                this.data.barangay = ""
                this.data.zone = ""
                this.data.account = ""
                this.data.name = ""
                this.data.address = ""
                this.data.userLocation = ""
                this.data.accountValid = false

                this.errors.municipality = null
                this.errors.barangay = null
                this.errors.zone = null
                this.errors.account = null
                this.errors.name = null
                this.errors.mobile = null
                this.errors.server = null

                if(newval == 'current'){
                    if (navigator.userAgent.includes("FBAN") || navigator.userAgent.includes("FBAV")) {
                        this.errors.server = "To provide accurate results, we need access to your location. Please open this link in your device’s main browser (like Chrome or Safari), as Facebook Messenger’s built-in browser may not allow location access.";
                        this.isMessengerBrowser = true;
                        return;
                    }else{
                        this.isMessengerBrowser = false;
                    }
                    this.getLocation();
                }
            },
            isFollowUp(newval){
                this.locationType = null
                if(newval){
                    setTimeout(() => {
                        this.$refs.ticketno.focus();
                    }, 300);
                }else{
                    this.getMyTicketHistory();
                }
            }
        },  
        methods: {
            detectMessengerBrowser(){
                alert('asdsad')
                if (navigator.userAgent.includes("FBAN") || navigator.userAgent.includes("FBAV")) {
                    this.isMessengerBrowser = true;
                }
            },
            decryptAES(base64Cipher, hexKey) {
                try {
                    const key = CryptoJS.enc.Hex.parse(hexKey);

                    // Decode Base64 → WordArray
                    const rawData = CryptoJS.enc.Base64.parse(base64Cipher);

                    // Extract IV (first 16 bytes) and ciphertext (rest)
                    const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4), 16); // 16 bytes = 4 words
                    const ciphertext = CryptoJS.lib.WordArray.create(rawData.words.slice(4), rawData.sigBytes - 16);

                    // Decrypt
                    const decrypted = CryptoJS.AES.decrypt(
                    { ciphertext: ciphertext },
                    key,
                    {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }
                    );

                    return decrypted.toString(CryptoJS.enc.Utf8);
                } catch (e) {
                    console.error("Decryption failed:", e.message);
                    return null;
                }
            },
            async getLocation() {
                if ("geolocation" in navigator) {
                    try {
                        
                        
                        // console.log("Fetching location...");
                        this.errors.server = ""
                        
                        this.fetching_location = true;

                        const position = await new Promise((resolve, reject) => {
                                navigator.geolocation.getCurrentPosition(
                                    (pos) => {
                                        this.fetching_location = false;
                                        resolve(pos); // ✅ Resolve on success
                                    },
                                    (error) => {
                                        switch (error.code) {
                                            case error.PERMISSION_DENIED:
                                                this.errors.server = "Permission denied. Please allow location access.";
                                                break;
                                            case error.POSITION_UNAVAILABLE:
                                                this.errors.server = "Location information is unavailable.";
                                                break;
                                            case error.TIMEOUT:
                                                this.errors.server = "Location request timed out.";
                                                break;
                                            default:
                                                this.errors.server = "An unknown error occurred.";
                                        }
                                        this.fetching_location = false;
                                        reject(error); // ✅ Reject on error
                                    },
                                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                                );
                            });

                        
                        

                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                  
                        this.data.userLocation = [lat, lng];
                        this.userLocation2 = [lat, lng];
                        this.center = [lat, lng];

                        // console.log("Latitude:", lat, "Longitude:", lng);
                        // this.getMyTicketRange()

                        // Call reverse geocoding function
                        // await this.getAddress(lat, lng);
                        // console.log("Location fully loaded.");
                        this.fetching_location = false;
                    } catch (error) {
                        console.error("Error getting location:", error.message);
                        this.errors.server = "Location access denied. Kindly allow location permissions in your browser settings to proceed."
                        this.fetching_location = false;
                    }
                } else {
                    console.error("Geolocation is not supported by this browser.");
                    this.errors.server = "Geolocation is not supported by this browser"
                }
            },
            onMapReady(map) {
                // const map = this.$refs.map.mapObject;
        
                // Add Fullscreen Control to Map
                if (L.control && L.control.fullscreen) {
                    map.addControl(L.control.fullscreen({ position: "topright" }));
                } else {
                    console.error("Fullscreen plugin not loaded correctly");
                }
            },
            getAddress(lat, lng) {
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                    console.log("Full Address:", data);

                    const barangay = data.address.suburb || data.address.village || "Not Found";
                    const municipality = data.address.city || data.address.town || "Not Found";
                    const street = data.address.road || "Not Found";

                    console.log("Barangay:", barangay);
                    console.log("Municipality:", municipality);
                    console.log("Street:", street);
                    })
                    .catch(error => console.error("Error fetching address:", error));
            },
            handleLocationType() {
                if (this.locationType === "current") {
                    this.getLocation();
                }
            },
            updateLocation(event) {
                console.log([event.target.getLatLng().lat, event.target.getLatLng().lng])
                this.data.userLocation = [event.target.getLatLng().lat, event.target.getLatLng().lng];
                this.userLocation2 = [event.target.getLatLng().lat, event.target.getLatLng().lng];
                this.center = this.data.userLocation;
                // this.getMyTicketRange()
                // this.getAddress(event.target.getLatLng().lat, event.target.getLatLng().lng);
                // this.$swal({
                //     title: "Are you sure?",
                //     text: "You changed your pinned location, are you sure you want to change it?",
                //     icon: "warning",
                //     showCancelButton: true,
                //     confirmButtonText: "Yes",
                //     cancelButtonText: "No",
                // }).then((result) => {
                //     if (result.isConfirmed) {
                //         this.data.userLocation = [event.target.getLatLng().lat, event.target.getLatLng().lng];
                //         this.userLocation2 = [event.target.getLatLng().lat, event.target.getLatLng().lng];
                //         this.center = this.data.userLocation;
                //     }else{
                //         this.data.userLocation = [...this.userLocation2]
                //     }
                // });
                
            },
            getDeviceId() {
                let deviceId = localStorage.getItem("device_id");
                if (!deviceId) {
                     
                    if (window.crypto && window.crypto.randomUUID) {
                        // Modern browsers (Chrome 92+, Edge 92+, Firefox 95+)
                        deviceId = window.crypto.randomUUID();
                    } else {
                        // Fallback for older browsers / Node 18
                        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                            const r = Math.random() * 16 | 0;
                            const v = c === 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    }
                    localStorage.setItem("device_id", deviceId);
                }
                return deviceId;
            },
            resetForms(){
                this.errors = {
                    server: null,
                    name: null,
                    mobile: null,
                    userLocation: null,
                    municipality: null
                }
                this.data = { 
                    userLocation: "", 
                    latitude: "",
                    longitude: "",
                    mobile: "",
                    name: "",
                    zone: "",
                    barangay: "",
                    municipality: "",
                    message: "",
                    account: "",
                    accountValid: false,
                }
                

            },
            async submitReport(){
                var self = this
                
                self.errors.server = null
               
                if(self.tickets && self.tickets.pending_ticket.length > 0){
                    self.errors.server = "You have an active ticket."
                    return;
                }
                await Promise.all(Object.keys(this.data).map(field => this.validateField(field)));

                if (Object.values(this.errors).some((error) => error)) { 
                    self.$refs.error_message.focus();
                    return; 
                }

                const rawData = self.data
                self.curr_datetime = new Date();
                
                
                const userDeviceID = this.$route.query.token && this.messengerID ? this.messengerID : self.getDeviceId()
                
                rawData.latitude = rawData.userLocation[0]
                rawData.longitude = rawData.userLocation[1]

                // const address = rawData.zone + ", " + rawData.barangay.name + ", " + rawData.municipality.name
                const address2 = self.locationType == 'current' ? 'Current Location' : rawData.address

                const formData = {
                    name: rawData.name.toUpperCase(),
                    address: address2.toUpperCase(),
                    mobile: rawData.mobile,
                    location:{
                        type: "Point",
                        coordinates:[rawData.longitude,rawData.latitude]
                    },
                    message: rawData.message,
                    uuid: userDeviceID.toString(),
                    account: rawData.account ?? "",
                    sid: this.$route.query.sid ?? ""
                }
                self.summaryData = formData
                // self.$swal({
                //     title: "Report Summary",
                //     html:
                //         "<h6>Please review your report details before you submit</h6><br/>"+
                //         `<div style='text-align:left;'><h6>Name: ${formData.name} </h6>`+
                //         `<h6>Mobile No.: ${formData.mobile} </h6>`+
                //         `<h6>Address: ${address2}</h6>`+
                //         `${formData.message.length > 0 ? `<h6>Message: ${formData.message}</h6>` : ''}</div>`,
                //     icon: "warning",
                //     customClass: {
                //         title: "swal-custom-title",
                //         popup: "custom-swal-popup",
                //     },
                //     showCancelButton: true,
                //     confirmButtonText: "Submit",
                //     cancelButtonText: "Cancel",
                // }).then((result) => {
                //     if (result.isConfirmed) {
                        self.isLoading = true
                        axios.post(`${import.meta.env.VITE_API_URL}/ticket/create`, formData)
                        .then((response) => {
                            self.summaryData.ticket_no = response.data.ticket_no
                            self.summaryData.created_at = response.data.created_at
                            self.$nextTick(() => {
                                self.isSummary = true
                            })
                            // self.$swal({
                            //     title: 'Report Submitted',
                            //     html:
                            //         "<h6>Thank you! Your brownout report has been received</h6><br/>"+
                            //         `<div style='text-align:left;'><h6>Name: ${formData.name} </h6>`+
                            //         `<h6>Mobile Number: ${formData.mobile} </h6>`+
                            //         `<h6>Address: ${address2}</h6>`+
                            //         "<h6>Ticket No.: ABCDEFGHI</h6>"+
                            //         `<h6>Date: ${curr_datetime.toLocaleString()} </h6> ${formData.message.length > 0 ? `<h6>Message: ${formData.message}</h6>` : ''}</div>`,
                            //     icon: 'success',
                            //     customClass: {
                            //         title: "swal-custom-title",
                            //     },
                            // })
                            self.isLoading = false
                            self.resetForms()
                        })
                        .catch((error) => {
                            self.isLoading = false
                            self.errors.server = "There was an error occurred. Please try again"
                            switch (error.response.status) {
                                case 409:
                                    self.errors.server = error.response.data.detail
                                    break;
                                case 422:
                                    self.errors.server = error.response.data.detail
                                    break;
                                default:
                                    self.errors.server = "There was an error occurred. Please try again"
                                    break;
                            }
                            
                        })
                //     }
                // });
            },
            getPSGC(){
                var self = this
                fetch("/psgc.json") // Replace with your file path
                .then(response => response.json()) // Parse JSON
                .then(data => {
                    self.psgcData = data
                    self.municipalities = data.filter((m) => m.geo_level == 'Mun').sort((a, b) => a.name.localeCompare(b.name))
                }) // Use the JSON data
                .catch(error => console.error("Error loading JSON:", error));
            },
            getBrgy(){
                var self = this
                self.brgys = self.psgcData.filter((psgc) => psgc.geo_code.startsWith(self.data.municipality.geo_code.substring(0, 6)) && psgc.geo_level == 'Bgy').sort((a, b) => a.name.localeCompare(b.name))
            },
            validateName(name) {
                const regex = /^[A-Za-zÑñ0-9.,'’\-()\/ ]+$/;

                // Check if empty
                if (!name) return "Name is required.";
                // console.log(name.length)
                // Check length constraints
                if (name.length < 2) return `Invalid Name`;
                if (name.length > 50) return `Invalid Name`;

                // Check pattern
                if (!regex.test(name)) return "Name contains invalid characters.";

                return ""; // No errors, valid name
            },
            async validateAccountNumber() {
                try {
                    const account = this.data.account
                    if (!account) return "Account is required.";

                    if(account.length < 8) return 
                    this.errors.account = null
                    this.isLoading = true
                    // this.data.name = null;
                    // this.data.address = null;
                    const response = await fetch(`https://eservicesapi.casureco1.com/api/master/account/verify?accno=${account}`);
                    const data = await response.json();

                    

                    if(data.isValid){
                        if(data.data.nflatitude == null || data.data.nflongitude == null){
                            this.isLoading = false
                            this.data.userLocation = [0,0];
                            this.data.accountValid = false;
                            this.data.name = ""
                            this.data.address = ""
                            this.errors.account = "Account has no location data. Please use current location";
                            return "Account has no location data. Please use current location";
                        }
                        this.data.userLocation = [
                            data.data.nflatitude ?? 0,
                            data.data.nflongitude ?? 0
                        ];

                        this.data.accountValid = true;
                        this.data.name = data.data.account_name;
                        this.data.address = data.data.account_address;
                        
                        console.log(this.data.userLocation)
                        this.userLocation2 = [data.data.nflatitude, data.data.nflongitude];
                        this.center = [data.data.nflatitude, data.data.nflongitude];
                        
                    }else{
                        this.data.userLocation = [0,0];
                        this.data.name = null;
                        this.data.address = null;
                        this.errors.account = "Invalid Account Number"
                    }

                    this.isLoading = false
                    return data.isValid ? "" : "Invalid Account Number";
                } catch (error) {
                    this.isLoading = false
                    console.error("Error fetching account:", error);
                    return "Error validating account";
                }
            },
            validateMobileNumber(mobile) {
                // Remove spaces and dashes (optional formatting characters)
                mobile = mobile.replace(/[\s-]/g, "");
                // Convert +63 to 0 if it starts with +63
                if (mobile.startsWith("63")) {
                    mobile = "0" + mobile.slice(2);
                }
                // Validate that it follows the 11-digit PH mobile format
                const regex = /^09\d{9}$/;
                return regex.test(mobile) ? "" : "Invalid Mobile Number";
            },
            async validateField(field) {
                const value = typeof this.data[field] === 'string' ? this.data[field].trim() : this.data[field];

                const rules = {
                    // account: async () => {
                    //     // Only validate account if locationType is 'account'
                    //     if (this.locationType === 'account') {
                    //         return await this.validateAccountNumber(value);
                    //     }
                    //     return ""; // skip validation otherwise
                    // },
                    account: () => this.locationType == 'account' ?  this.data.accountValid ? "" : "Invalid Account Number" : "",
                    mobile: () => this.validateMobileNumber(value),
                    name: () => this.validateName(value),
                    userLocation: () => (value ? "" : this.locationType === 'current' ? "Location is required." : ''),
                    address: () => (value ? "" : this.locationType === 'account' ? "Address is required." : ""),
                    // municipality: () => (value ? "" : this.locationType === 'manual' ? "Municipality is required." : ""),
                    // barangay: () => (value ? "" : this.locationType === 'manual' ? "Barangay is required." : ""),
                    // zone: () => (value ? "" : this.locationType === 'manual' ? "Sitio/Zone/Street is required." : ""),
                };
                console.log(this.errors)
                this.errors[field] = rules[field] ? await rules[field]() : "";
            },
            async getMyTicketHistory(){
                const userDeviceID = this.messengerID || this.getDeviceId()
                await fetch(`${import.meta.env.VITE_API_URL}/ticket/get_my_ticket/${userDeviceID}`)
                .then(response => response.json())
                .then(data => {
                    this.tickets = data
                })
                .catch(error => console.error("Error fetching address:", error));
                
            },
            async getMyTicketRange(){
                var self = this
                // console.log("Range:" + this.data.userLocation)

                const params = new URLSearchParams({
                    longitude: this.data.userLocation[1],
                    latitude: this.data.userLocation[0]
                }).toString();
                await fetch(`${import.meta.env.VITE_API_URL}/ticket/range/?${params}`)
                .then(response => response.json())
                .then(data => {
                    self.tickets_in_range = data.ticket
                    // console.log(data.ticket)
                })
                .catch(error => console.error("Error fetching address:", error));
                
            },
            plotInRangeTickets(){
                this.tickets_in_range.forEach(loc => {
                    L.marker([loc[1], loc[0]]).addTo(map)
                        .bindPopup(loc.text);
                });
            },
            formatStatus(log){
                switch(log.status_type) {
                    case 'open':
                        return 'Open';
                    case 'acknowledge':
                        return 'Acknowledged';
                    case 'troubleshoot':
                        return 'Troubleshooting';
                    case 'resolve':
                        return 'Resolved';
                    case 'close':
                        return 'Closed';
                    case 'transfer':
                        return 'Transferred to ' + this.areaMap[log.areacode];
                    case 'reopen':
                        return 'Reopened';
                    case 'reassign':
                        return 'Troubleshooting (Reassigned)';
                    default:
                        return 'Unknown Status';
                }
            },
            async followUpTicket() {
                const ticketno = this.TicketNo.trim();
                
                if (!ticketno) return;
                
                try {
                    this.errors.ticket = null;
                    this.isLoading = true;
                    const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/ticket/follow_up_ticket/${ticketno}`
                    );
                    this.isLoading = false;

                    if (!response.ok) {
                        this.errors.ticket = "Ticket Not Found";
                        this.followedTicket = null;
                        this.$nextTick(() => {
                            this.$refs.ticketno.focus();
                        });
                        return;
                    }
                    
                    const data = await response.json();
                    this.followedTicket = data;
                } catch (error) {
                    this.isLoading = false;
                    this.errors.ticket = "Network error. Please try again.";
                    console.error("Network error fetching ticket:", error);
                }
            },
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
            updateTicket(ticket,newStatus){ 
                const userDeviceID = this.$route.query.token && this.messengerID ? this.messengerID : this.getDeviceId()
                this.isLoading = true;
                axios
                    .get(`${import.meta.env.VITE_API_URL}/ticket/update/${ticket._id}/${newStatus}/${userDeviceID}`, {
                        params: {
                            remarks: ''
                        }
                    })
                    .then((response) => {
                        this.isLoading = false;
                        this.followUpTicket();
                    })
                    .catch((error) => {
                        this.isLoading = false;
                        this.errors.ticket = "Error updating ticket. Please try again.";
                        console.error("Error updating ticket:", error);
                    });
            },
            gobackhome(){
                this.locationType = null
                this.isSummary = false
                this.isFollowUp = false
            }

            
        }
    }
</script>
