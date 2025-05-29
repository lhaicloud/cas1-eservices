<template>
    <div class="justify-center flex items-center min-h-screen w-full text-white text-xs lg:text-base px-5">
      <div>
        <div class="space-y-3">
          <div class="bg-white text-gray-800 rounded-lg pb-5 px-5 py-5 space-y-5">
            <div class="relative space-y-1">
              <select
                id="service_type"
                v-model="application.service_type"
                class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                placeholder=" "
              >
                <option disabled value="">Please Select</option>
                <option :value="service" v-for="service in services" :key="service.id">{{ service.cfdescript }}</option>
              </select>
              <label
                for="service_type"
                :class="[
                  'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                  application.service_type ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                ]"
                class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
              >
                Service Type:
              </label>
            </div>

            <div class="relative space-y-1">
              <select
                id="individual"
                v-model="application.is_company"
                class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                placeholder=" "
              >
                <option disabled value="">Please Select</option>
                <option :value="0">Individual</option>
                <option :value="1">Company</option>
              </select>
              <label
                for="individual"
                :class="[
                  'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                  application.is_company !== null && application.is_company !== undefined ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                ]"
                class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
              >
                Individual or Company:
              </label>
            </div>

            <div class="relative space-y-1">
              <select
                id="classification"
                v-model="application.classification"
                class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                placeholder=" "
              >
                <option disabled value="">Please Select</option>
                <option :value="'A'">Indigenous / Light Materials</option>
                <option :value="'B'">Concrete Residential / Commercial Building</option>
                <option :value="'C'">Construction / Special Lightning</option>
              </select>
              <label
                for="classification"
                :class="[
                  'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                  application.classification ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                ]"
                class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
              >
                Classification:
              </label>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:flex justify-center items-center gap-2 mt-5">
          <button class="btn btn-primary justify-center" @click="proceed()" v-if="!application.submitted_at">Proceed</button>
          <button class="btn btn-primary justify-center" @click="newApplication()" :disabled="!application.service_type && !application.is_company && !application.classification" v-if="application.submitted_at">New Application</button>

          <button class="btn btn-white" v-if="application.lname != null && !application.dfapply" @click="continueApplication()">Continue Application</button>
          <button class="btn btn-white" @click="viewExistingApplication()">I Have Existing Application</button>
        </div>
      </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: "ElectricalServiceApplication",
    data() {
      return {
        selectedService: null,
        selectedType: null,
        selectedClassification: null,
        // application: this.$store.state.application,
        services:[
          { cfdescript: "New Connection", cfnewconnect: "YES" },
          { cfdescript: "Relocation", cfnewconnect: "NO" },
          { cfdescript: "Extension / Additional Connection", cfnewconnect: "NO" },
        ]
      };
    },
    computed:{
       ...mapState({
          application: state => state.application
        }),
    },
    watch: {
      'application.service_type': function (newVal) {
        this.$store.commit("setServiceType", newVal);
        this.selectedService = newVal
      },
      // 'application.is_company': function (newVal) {
      //   console.log("comasomd")
      //   this.$store.commit("setIsCompany", newVal);
      //   this.selectedType = newVal
      // },
      // 'application.classification': function (newVal) {
      //   this.$store.commit("setClassification", newVal);
      //   this.selectedClassification = newVal
      // },
    },
    methods: {
      proceed() {
        if(!this.application.service_type){
          alert("Please select a service type.");
          return;
        }
        if(this.application.is_company == null){
          alert("Please select a individual/company.");
          return;
        }
        if(this.application.classification == null){
          alert("Please select a classification.");
          return;
        }
        this.$router.push({ name: "NewConnectionApplication"});
        
      },
      continueApplication(){
        this.$router.push({ name: "NewConnectionApplication"});
      },
      viewExistingApplication(){
        this.$router.push({ name: "ViewExistingApplication"});
      },
      newApplication(){
        this.$store.commit('resetApplication');
        this.$router.push({ name: "NewConnectionApplication"});
      }
    },
    mounted() {
      // console.log(this.$store.state.application);
      if(this.application.dfapply){
        this.$store.commit('resetApplication');
      }
    },
  };
  </script>
  