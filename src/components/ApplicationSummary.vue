<template>
  <div
    class="bg-white text-gray-800 rounded-lg pb-5 px-5 pt-3 overflow-auto"
  >
    <div>
        <button class="text-gray-600 hover:text-black float-left" @click="back()">
        &lt;
        </button>
        <h1 class="mb-2 font-medium">Review Application Details</h1>
    </div>
    <hr />
    <div class="mt-5">
      <div class="text-xs">
        <div class="text-left">
          <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <h1 class="font-medium">Service Applied For</h1>
              <span>{{ application.service_type.cfdescript.toUpperCase() }} </span>
            </div>
            <!-- <div> -->
              <div v-if="application.account_number">
                <h1 class="font-medium">Account Number</h1>
                <span
                  >{{ application.account_number }}</span
                >
              </div>
              <div>
                <h1 class="font-medium">Applicant Name</h1>
                <span
                  >{{ application.fname }} {{ application.mname }}
                  {{ application.lname }}</span
                >
              </div>
              <div v-if="!application.is_company">
                <h1 class="font-medium">Spouse Name</h1>
                <span>{{ application.spname }}</span>
              </div>
            <!-- </div> -->
            <div v-if="!application.is_company">
              <h1 class="font-medium">Applicant Address</h1>
              <span>{{ application.applicant_address }}</span>
            </div>
            <div v-if="application.is_company">
              <h1 class="font-medium">Company Name</h1>
              <span>{{ application.company_name }}</span>
            </div>
            <div v-if="application.is_company">
              <h1 class="font-medium">Company Address</h1>
              <span>{{ application.applicant_address }}</span>
            </div>
            <div>
              <h1 class="font-medium">Location of Premises</h1>
              <span>{{ application.service_address }}</span>
            </div>
            <div v-if="application.spa">
              <h1 class="font-medium">Name of Authorized Signatory</h1>
              <span>{{ application.authorized_signatory_name }}</span>
            </div>
            <div v-if="application.spa">
              <h1 class="font-medium">Address of Authorized Signatory</h1>
              <span>{{ application.authorized_signatory_address }}</span>
            </div>
            <!-- <div class="grid grid-cols-3 md:col-span-1" v-if="!this.application.is_company"> -->
            <div>
              <h1 class="font-medium">Date of Birth</h1>
              <span>{{ formatDate(application.birthdate) }}</span>
            </div>
              <!-- <div class="text-center">
                <h1 class="font-medium">Sex</h1>
                <span>{{ application.sex }}</span>
              </div> -->
            <div>
              <h1 class="font-medium">Civil Status</h1>
              <span>{{ application.civil_status || "None" }}</span>
            </div>
            <!-- </div> -->
            <div>
              <h1 class="font-medium">Contact No.</h1>
              <span>{{application.contact_no }}</span>
            </div>
            <div>
              <h1 class="font-medium">Email Address</h1>
              <span>{{ application.email || "None" }}</span>
            </div>
            <div>
              <h1 class="font-medium">Electrician</h1>
              <span>{{
                electrician
                  ? electrician.cffname +
                    " " +
                    electrician.cfmidname +
                    " " +
                    electrician.cflname
                  : "None"
              }}</span>
            </div>
            <div class="md:col-span-3">
              <h1 class="font-medium">Schedule</h1>
              <div class="md:grid grid-cols-3">
                <div class="mt-2">
                  <h1>Date</h1>
                  {{ formatDate(application.selectedDate.date) }}
                </div>
                <div class="mt-2">
                  <h1>Time</h1>
                  {{ application.selectedDate.time }}
                </div>
                <div class="mt-2">
                  <h1>Location</h1>
                  {{ application.selectedDate.location }}
                </div>
              </div>
            </div>
          </div>
           <div class="mt-4 flex">
            <input type="checkbox" id="terms" class="mr-2" v-model="application.is_agree_term"/>
            <h1 for="terms" class="cursor-pointer">
              I have read and agree to 
              <a href="https://casureco1.com/terms" class="underline font-bold" target="_blank">the terms and conditions</a> and
              <a href="https://casureco1.com/privacy-policy" class="underline font-bold" target="_blank">the privacy policy</a>.
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ["application"],
  data() {
    return {
      // application: this.$store.state.application,
      // electricians: this.$store.state.electricians,
    };
  },
  computed: {
    ...mapState({
        electricians: state => state.electricians,
    }),
    electrician() {
      return this.electricians.find((el) => {
        return el.idelectricians == this.application.electrician_id;
      });
    },
  },
  mounted(){
    
    
  },
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    back(){
      this.$emit("back");
    }
  },
};
</script>
