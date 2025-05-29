<template>
    <div class="bg-white text-gray-800 rounded-lg pb-5 px-5 pt-3 overflow-auto">
        <div>
            <button class="text-gray-600 hover:text-black float-left" @click="back()">
            &lt;
            </button>
            <h1 class="mb-2 font-medium">Electrician Information</h1>
        </div>
        <hr>
        <div class="flex items-center">
            <div class="relative mt-3 space-y-1 text-left flex-1">
            <input
                id="search"
                type="text"
                v-model="searchQuery"
                @input="searchElectrician()"
                placeholder=" "
                autocomplete="off"
                autofocus
                :class="[
                'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                ]"
            />
            <label
                for="search"
                :class="[
                'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                searchQuery ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                ]"
                class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
            >
                Search by Name or Address
            </label>
        </div>
        <button
            class=" text-gray-600 hover:text-black border border-gray-300 rounded-md p-2 ml-1 mt-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
            @click="searchElectrician()"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
        </button>
        </div>
        <div class="mt-3">
            <div class="text-start space-x-1 relative">
                <input type="checkbox" id="no_electrician" class="mr-2" v-model="application.no_electrician" @change="selectElectrician({})"/>
                <label for="no_electrician" class="text-xs mt-1.5">I don't have one yet</label>
            </div>
            <div class="text-start border-b">
                <span class="text-xs text-gray-500">Selected: <span v-if="application.electrician">{{application.electrician.cflname}}, {{ application.electrician.cffname }} {{ application.electrician.cfmidname }}</span></span>
            </div>
            <ul class=" max-h-96 overflow-auto" v-if="!fetching">
                <li v-for="(e, index) in orderedElectricians" :key="index" class="flex items-center border-b py-2 rounded-lg px-2"  @click="selectElectrician(e)" :class="application.electrician_id && application.electrician_id === e.idelectricians ? 'bg-blue-200' : ''">
                <div class="w-1/5">
                    <img onerror="this.onerror=null; this.src='/images/cas1-logo.svg';" :src="e.image_path" alt="NOT FOUND" class="rounded-full w-16" v-if="e.cfidno != ''">
                </div>
                <div class="flex relative w-4/5 text-left px-3">
                    <div class="space-y-2">
                        <h2 class="font-bold"><b>{{e.cflname}}, {{e.cffname}} {{e.cfmidname}}</b></h2>
                        <ul class="text-xs">
                            <li><i class="bi bi-credit-card-2-front"></i> {{e.cfidno}}</li>
                            <li><i class="bi bi-house"></i> {{e.cfaddress}}</li>
                            <li><i class="bi bi-telephone"></i> {{e.contact_no}}</li>
                        </ul>
                        
                    </div>
                    
                </div>

                </li>
            </ul>
            <div v-if="fetching">
                <h1 class="text-sm">Fetching, please wait</h1>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

    export default {
        name: "Electrician",
        props: ["application"],
        data() {
            return {
                searchQuery: '',
                // electricians: [],
                // electricians1: [],
                // application: this.$store.state.application,
                fetching: false
            };
        },
        created() {
            // this.getElectricians();
        },  
        watch: {
            // 'application.electrician_id': function (newVal) {
            //     this.$store.commit("setElectrician", newVal);
            // },
            // application: {
            //     handler: function(newVal) {
            //         this.$store.commit("setApplication", newVal);
            //     },
            //     immediate: true,
            //     deep: true,
            // },
            electricians(newVal){
                this.$store.commit("setElectricians",newVal)
            },
            
            
        },
        computed: {
            orderedElectricians() {
                var sortingArr = [ '06', '08', '04', '05', '03', '02' ,'01', '09' ,'10' ,'07' ];
                const filtered = this.electricians.filter((d) => { return d.cfareacode == this.application.service_cfareacode });
                return filtered.sort((a, b) => sortingArr.indexOf(a.cfareacode) - sortingArr.indexOf(b.cfareacode));
            },
            ...mapState({
                electricians: state => state.electricians,
                electricians1: state => state.electricians1,
            }),
            
        },
        methods: {
            async getElectricians(){
                var self = this;
                self.fetching = true
                await fetch(`${import.meta.env.VITE_CIMS_API_URL}/api/electricians/get`)
                .then(response => response.json())
                .then(data => {
                self.fetching = false
                data.map((item) => {
                    item.image_path = import.meta.env.VITE_CIMS_API_URL + "/"+item.filename
                })
                self.electricians = data.filter((d) => { return d.cfareacode == self.application.service_cfareacode });
                self.electricians1 = data.filter((d) => { return d.cfareacode == self.application.service_cfareacode });
                if(data.length == 0){
                    self.getLocalElectrians()
                }
                // self.$store.commit("setElectricians", data)
                // console.log(data);
                })
                .catch(function (error) {
                self.fetching = false
                console.log(error);
                self.getLocalElectrians()
                });
                
            },
            getLocalElectrians(){
                var self = this 
                fetch('/electricians.json')
                .then(response => response.json())
                .then(data => {
                data.map((item) => {
                    item.image_path = "/electricians/"+item.cfidno+".jpg"
                })
                self.electricians = data;
                self.electricians1 = data;
                // self.$store.commit("setElectricians", data)
                })
                .catch(error => {
                console.error('Error loading JSON:', error);
                });
            },
            searchElectrician() {
                if (this.searchQuery.length > 0) {
                    const filtered = this.electricians1.filter(e => e.cflname.toLowerCase().includes(this.searchQuery.toLowerCase()) || e.cffname.toLowerCase().includes(this.searchQuery.toLowerCase()) || e.cfaddress.toLowerCase().includes(this.searchQuery.toLowerCase() || e.cfidno.toLowerCase().includes(this.searchQuery.toLowerCase())));
                    this.$store.commit('setElectricians', filtered);
                } else {
                    console.log(this.electricians1)
                    this.$store.commit('setElectricians', this.electricians1);
                }
            },
            selectElectrician(e) {
                if(this.application.no_electrician){
                    this.application.electrician_id = null;
                    this.application.electrician = null;
                    return;
                }
                this.application.electrician_id = e.idelectricians;
                this.application.electrician = this.electricians.find((el) => {
                    return el.idelectricians == e.idelectricians;
                });
                
                this.$store.commit("setElectrician", e.idelectricians);
                
                // }
            },
            back(){
                this.$emit('back') // Emit a custom event
            }
        }
    };
</script>