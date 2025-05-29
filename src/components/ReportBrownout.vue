<template>
    <div class="flex items-center justify-center text-xs lg:text-base min-h-screen text-gray-800">
        <!-- <header class="absolute top-0 w-full bg-gray-800 text-white justify-center p-2 text-xs flex items-center gap-1 px-2">
            <img src="/images/cas1-logo.webp" alt="CASURECO 1 LOGO" width="15" height="20"> CASURECO I
        </header> -->
        <div v-if="isMessengerBrowser" class="text-justify bg-red-500 text-white p-5 rounded-lg">
            <h1>To provide accurate results, we need access to your location.
Please open this link in your device’s main browser (like Chrome or Safari), as Facebook Messenger’s built-in browser may not allow location access.</h1>
        </div>
        <SpinnerOverlay v-if="isLoading"/>
        <div class="w-full md:w-1/2 xl:w-2/5 grid grid-cols-1 m-3 space-y-2 pb-10" v-if="!isMessengerBrowser">
            
            <!-- <div v-if="!tickets" class="border border-gray-300 rounded-lg bg-white p-5"> -->
            <div>
                <div v-if="!isSummary" class="rounded-lg space-y-8 bg-white p-3">
                    <div class="space-y-2">
                        <h3 class="font-bold text-center text-lg">Brownout Report</h3>
                        <h3 class="text-center">Please provide the details below </h3>
                    </div>
                    <!-- <hr/> -->
                    <div class="space-y-3">
                        <div v-if="tickets && tickets.pending_ticket.length > 0" class="bg-orange-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700">
                        <!-- <div class="bg-orange-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700"> -->
                            You have an active ticket. Click here to view the details: 
                            <router-link :to="{ name: 'TicketDetails', params: { data: tickets }}" class="text-blue-700 hover:underline cursor-pointer">View Ticket</router-link>
                        </div>
                        <!-- <div v-if="tickets && tickets.pending_ticket.length == 0" class="bg-red-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700"> -->
                        <div class="bg-orange-100 text-center border border-gray-300 rounded-lg p-3 text-gray-700" v-if="tickets_in_range.length > 0">
                            There {{ tickets_in_range.length === 1 ? 'is' : 'are' }} {{ tickets_in_range.length }} active ticket{{ tickets_in_range.length !== 1 ? 's' : '' }} in your area.
                        </div>
                        <div class="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm" ref="error_message" v-if="Object.values(errors).some(error => error)">
                            <ul class="text-left px-5 m-0 list-disc">
                                <li v-for="error in errors" v-if="error"><small>{{ error }}</small></li>
                            </ul>
                        </div>
                        <div class="text-center" v-if="!data.userLocation && locationType == 'current' && !fetching_location">
                            <button class="btn btn-success " @click="getLocation()">Allow Location Access</button>
                        </div>
                        <div v-if="fetching_location && !data.userLocation && locationType == 'current'" class="text-center my-3">Please wait, Fetching Location...</div>
                        <div v-if="locationType == 'current' && !fetching_location && data.userLocation">
                            <l-map :zoom="zoom" :center="center" @ready="onMapReady" class=" h-36 md:h-48 w-full rounded"  ref="map">
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
                        <div class="space-y-1">
                            <div class="space-x-2">
                                <input type="radio" id="inlineRadio1" name="inlineRadio" value="current" v-model="locationType" :disabled="tickets && tickets.pending_ticket.length > 0">
                                <label for="inlineRadio1">Get my current location</label>
                            </div>

                            <div class="space-x-2">
                                <input type="radio" id="inlineRadio2" name="inlineRadio" value="manual" v-model="locationType" :disabled="tickets && tickets.pending_ticket.length > 0">
                                <label for="inlineRadio2">Enter Address Manually</label>
                            </div>
                        </div>
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
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">

                            <!-- Name field -->
                            <div class="relative space-y-1">
                                <input
                                    id="name"
                                    type="text"
                                    v-model="data.name"
                                    @blur="validateField('name')"
                                    :class="[
                                    'peer block w-full border rounded-md px-3 pt-4 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1',
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

                            <!-- Message textarea -->
                            <div class="relative col-span-full space-y-1">
                                <textarea
                                id="message"
                                rows="2"
                                v-model="data.message"
                                :disabled="tickets && tickets.pending_ticket.length > 0"
                                placeholder=" "
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
                                Message: <span class="text-xs">(Optional, but it’s helpful for us to understand your issue better)</span>
                                </label>
                            </div>

                            </div>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-primary w-full lg:w-1/2 justify-center" @click="submitReport()" :disabled="isLoading || tickets && tickets.pending_ticket.length > 0">Submit</button>
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
                        <h2 >Your report has been received</h2>
                    </div>
                    <div class="space-y-1.5 text-gray-800">
                        <div class="flex">
                            <h4 class="flex-none w-16 lg:w-32">Ticket No.</h4> 
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <h4 class="flex-1 font-medium">20250304123</h4>
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
                            <h4 class="flex-none w-16 lg:w-32">Message</h4>
                            <div class="flex-none px-5 lg:px-8">:</div>
                            <div class="flex-1 break-words overflow-auto">{{ summaryData.message }}</div>
                        </div>
                    </div>
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
import CryptoJS from 'crypto-js';

    export default {
        components: { LMap, LTileLayer, LMarker, LPopup,SpinnerOverlay,Tickets },
        data() {
            return {
                center: [51.505, -0.09], // Default: Manila, Philippines
                zoom: 17,
                tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                userLocation: null, // Stores user's location
                userLocation2: null,
                locationType: 'current',
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
                },
                errors: {
                    server: null,
                    name: null,
                    mobile: null,
                    userLocation: null,
                    municipality: null,
                    zone: null,
                    barangay: null,
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
            };
        },
        created() {
            this.getMyTicketHistory()
            this.getPSGC()
            if(this.$route.query.token){
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token'); // token is decoded properly now
                this.messengerID = this.decryptAES(token, import.meta.env.VITE_AES_KEY);
            }
           
        },
        mounted(){
            if (navigator.userAgent.includes("FBAN") || navigator.userAgent.includes("FBAV")) {
                this.isMessengerBrowser = true;
                return;
            }
            if (navigator.permissions) {
                navigator.permissions.query({ name: "geolocation" }).then((result) => {
                    if (result.state === "granted") {
                        this.errors.server = ""
                        this.getLocation();
                    }else{
                        this.errors.server = "Please allow location access"
                    }
                });
            }
            
        },
        watch: {
            locationType(){
                this.data.municipality = ""
                this.data.barangay = ""
                this.data.zone = ""

                this.errors.municipality = null
                this.errors.barangay = null
                this.errors.zone = null
            }
        },  
        methods: {
            async getLocation() {
                if ("geolocation" in navigator) {
                    try {
                        
                        
                        // console.log("Fetching location...");
                        this.errors.server = ""
                        
                        this.fetching_location = true;

                        const position = await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });
                        
                        

                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        this.data.userLocation = [lat, lng];
                        this.userLocation2 = [lat, lng];
                        this.center = [lat, lng];

                        // console.log("Latitude:", lat, "Longitude:", lng);
                        this.getMyTicketRange()
                        // Call reverse geocoding function
                        // await this.getAddress(lat, lng);
                        // console.log("Location fully loaded.");
                        this.fetching_location = false;
                    } catch (error) {
                        console.error("Error getting location:", error.message);
                        this.errors.server = "Error getting location"
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
                this.data.userLocation = [event.target.getLatLng().lat, event.target.getLatLng().lng];
                this.userLocation2 = [event.target.getLatLng().lat, event.target.getLatLng().lng];
                this.center = this.data.userLocation;
                this.getMyTicketRange()
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
                    deviceId = crypto.randomUUID(); // Generate a new ID
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
                }
            },
            submitReport(){
                var self = this
                if(self.tickets && self.tickets.pending_ticket.length > 0){
                    self.errors.server = "You have an active ticket."
                    return;
                }
                Object.keys(this.data).forEach((field) => this.validateField(field));

                if (Object.values(this.errors).some((error) => error)) {
                    self.$refs.error_message.focus()
                    return;
                }
                

                const rawData = self.data
                self.curr_datetime = new Date();
                
                const userDeviceID = this.$route.query.token && this.messengerID ? this.messengerID : self.getDeviceId()

                rawData.latitude = rawData.userLocation[0]
                rawData.longitude = rawData.userLocation[1]

                const address = rawData.zone + ", " + rawData.barangay.name + ", " + rawData.municipality.name
                const address2 = self.locationType == 'current' ? 'Current Location' : address
                const formData = {
                    created_at: self.curr_datetime.toISOString(),
                    name: rawData.name,
                    address: address2,
                    mobile: rawData.mobile,
                    location:{
                        type: "Point",
                        coordinates:[rawData.longitude,rawData.latitude]
                    },
                    // latitude: rawData.latitude.toString(),
                    // longitude: rawData.longitude.toString(),
                    message: rawData.message,
                    uuid: userDeviceID.toString()
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
                            self.isSummary = true
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
            validateName() {
                const regex = /^[A-Za-zÑñ.]+(?:[-' ][A-Za-zÑñ.]+)*$/;

                // Trim whitespace
                const name = this.data.name.trim();
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
            validateField(field) {
                const value = this.data[field] == "" ? this.data[field].trim() : this.data[field];

                const rules = {
                    mobile: () => this.validateMobileNumber(value),
                    name: () => this.validateName(value, 2, 50),
                    userLocation: () => (value ? "" : this.locationType == 'current' ? "Location is required." : ''),
                    municipality: () => (value ? "" : this.locationType == 'manual' ? "Municipality is required." : ""),
                    barangay: () => (value ? "" : this.locationType == 'manual' ? "Barangay is required." : ""),
                    zone: () => (value ? "" : this.locationType == 'manual' ? "Sitio/Zone/Street is required." : ""),
                };

                this.errors[field] = rules[field] ? rules[field]() : "";
                
                // console.log(this.errors)
            },
            async getMyTicketHistory(){
                const userDeviceID = this.getDeviceId()
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
            decryptAES(encryptedBase64, hexKey) {
                const key = CryptoJS.enc.Hex.parse(hexKey);
                const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedBase64);

                // Extract IV (first 16 bytes = 4 words)
                const iv = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4), 16);

                // Extract ciphertext (rest)
                const ciphertext = CryptoJS.lib.WordArray.create(
                    encryptedWordArray.words.slice(4),
                    encryptedWordArray.sigBytes - 16
                );

                const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });

                return decrypted.toString(CryptoJS.enc.Utf8);
            }
        }
    }
</script>
