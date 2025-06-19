<template>
    <div class="justify-center text-center flex items-center min-h-screen w-full text-white text-xs lg:text-base p-5">
     
        <div class="w-full md:max-w-xl">
            <div class="bg-white text-gray-800 rounded-lg px-5 py-10 flex flex-col items-center space-y-2 ">
                <h4>Plase enter your Reference Number:</h4>
                <div class="w-full relative space-y-1">
                    <input
                    id="refno"
                    type="text"
                    class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-start uppercase"
                    v-model="RefNo"
                    @input="RefNo = RefNo.toUpperCase()"
                    @keyup.enter="findReferenceNumber()"
                    placeholder=" "
                    autofocus
                    />
                    <label
                    for="refno"
                    :class="[
                        'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                        RefNo ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                    ]"
                    class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white text-xs"
                    >
                    Reference Number
                    </label>
                </div>
            </div>
            <div class="flex flex-col-reverse md:flex-row justify-center gap-2 mt-5">
                <button class="btn btn-white" @click="back()">Back</button>
                <button class="btn btn-primary" @click="findReferenceNumber()">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
    export default{
        data(){
            return{
                RefNo: '',
                application: [],
            }
        },
        mounted(){
        },      
        computed: {
            // ...mapState({
            //     application: state => state.application,
            // }),
        },
        methods:{
            findReferenceNumber(){
                var self = this;
                if(self.RefNo == ''){
                    alert("Please enter your Reference Number.");
                    return;
                }
                self.$store.commit("setLoading", true);
                axios.get(`${import.meta.env.VITE_CIMS_API_URL}/api/consumer-services/online-application/findReferenceNumber/${this.RefNo}`)
                .then(response => {
                    if(response.data.length > 0){
                        self.application = response.data[0]
                        self.$store.commit("setApplication", self.application);
                        self.$nextTick(() => {
                            self.$router.push({ name: "NewConnectionApplication" });
                        });
                    }else{
                        alert("Reference Number not found.");
                    }
                })
                .catch(error => {
                    alert("Reference Number not found.");
                    console.error(error);
                }).finally(() => {
                    self.$store.commit("setLoading", false);
                });
            },
            back(){
                this.$router.push({ name: "ElectricalServiceApplication"});
            }
        }
    }
</script>
