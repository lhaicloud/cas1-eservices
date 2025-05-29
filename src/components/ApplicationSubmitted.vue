<template>
    <div class="bg-white text-gray-800 rounded-lg pb-5 px-5 pt-3 overflow-auto">
        
        <h1 class="text-lg font-bold mt-5">
            Application {{ title}}
        </h1>
        <p class="mt-5 text-justify">
            Your application has been {{ title.toLocaleLowerCase() }}. Kindly ensure that all required documents are prepared prior to your scheduled date. 
            Please arrive on time. Your Reference Number is <span class="font-medium">{{ application.reference_number }}.</span>
        </p>
        <div class="flex justify-center mt-5">
            <svg ref="barcode"></svg>
        </div>
        <div class="text-left mt-5 text-xs ">
            <ul v-if="application.classification">
                <li
                    v-for="item in classifications"
                    v-if="item.category === application.classification"
                    :key="item.category"
                >
                <h1>List of Requirements for {{ item.category_title }}: </h1>
                    <ul class="list-disc list-outside mt-2 mx-4">
                        <li v-for="(req, index) in item.requirements" :key="index">{{ req }}</li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="text-left mt-5 text-xs ">
            <h1>List of forms to print and submit at CASURECO I MAIN OFFICE (ISD Department): </h1>
            <ul class="list-disc list-outside mt-2 mx-4">
                <li>Personal Information Sheet</li>
                <li>Info / Checklist Form</li>
                <li>Application / Contract For Electric Service</li>
                <li>Application For Membership</li>
                <li>Electrical Inspection Report</li>
            </ul>
        </div>
        <button class="btn btn-primary mt-5" @click="downloadForms()" v-if="!application.dfapply || application.dfapply == '0000-00-00'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
            <span class="ml-1">Download Forms</span>
        </button>
        <p class="text-xs text-red-400 text-center p-2" v-if="isMessengerBrowser">Looks like you’re in Messenger. To download the file, open this link in your phone’s browser (like Chrome or Safari).</p>
        
        <p class="text-xs text-center mt-5">Date Submitted: {{ application.submitted_at }}</p>
            
    </div>
</template>

<script>
import JsBarcode from 'jsbarcode';
import axios from 'axios';

export default {
    props: ["application","loading"],
    data(){
        return{
            ReportUnit: '',
            j_params:{
                j_username: import.meta.env.VITE_JASPERSERVER_USERNAME,
                j_password: import.meta.env.VITE_JASPERSERVER_PASSWORD
            },
            classifications: [
                {
                    category: 'A',
                    category_title: 'Indigenous / Light Materials',
                    requirements: [
                    'Complete Set of Application Forms with Electrical Layout and Vicinity Map',
                    'Pre-Membership Seminar (PMS) Certificate',
                    'Xerox Copy of Residence Certificate (Cedula)/Valid ID',
                    'Fire Safety Clearance from Bureau of Fire Protection (BFP)',
                    'BAPA Endorsement for Applications within BAPA Coverage',
                    'Clearance from Accounts/Verification from Consumer Assistance Office (CAO)',
                    ],
                },
                {
                    category: 'B',
                    category_title: 'Concrete Residential / Commercial Building',
                    requirements: [
                    'Electrical Plan signed by Professional Electrical Engineer (PEE)',
                    'Electrical Permit signed by Municipal Engineer',
                    'Zoning Clearance from Municipal Planning and Development Coordinator (MPDC)',
                    'Business/DTI Permit for Commercial Connection',
                    "Special Power of Attorney/Secretary's Certificate / Board Resolution for Authorized Signatory/Representative to Sign for the Company/Corporation",
                    ],
                },
                {
                    category: 'C',
                    category_title: 'Construction / Special Lightning',
                    requirements: [
                    'Complete Set of Special Lightning Application Form with Vicinity Map',
                    'Application for Transformer Installation (if necessary)',
                    'Electrical Plan signed by Professional Electrical Engineer',
                    'Temporary Electrical Permit from Municipal Engineer',
                    'Clearance/Verification from Consumer Assistance Office (CAO)',
                    ],
                },
            ],
            errorMessage: '',
            isMessengerBrowser: false
        }
    },
    computed:{
        title(){
            if(this.application.dfapply && this.application.dfapply != '0000-00-00'){
                return 'Received'
            }
            return "Submitted"
        }
    },
  mounted() {
    setTimeout(() => {
        JsBarcode(this.$refs.barcode, this.application.reference_number, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 50,
            displayValue: true
          });
    }, 100);
    if (navigator.userAgent.includes("FBAN") || navigator.userAgent.includes("FBAV")) {
        this.isMessengerBrowser = true;
        return;
    }
  },
  methods: {
        async downloadForms() {
            const self = this;
             this.$store.commit("setLoading", true);
            

            // Make sure the loading overlay renders before proceeding
            this.$nextTick(() => {
                setTimeout(async () => {
                try {
                    if(self.application.service_type.cfnewconnect == 'YES'){
                        self.ReportUnit = 'Public/Report/Consumer/APPLICATION_BOOK';
                    }else if(self.application.service_type.cfnewconnect == 'NO'){
                        self.ReportUnit = 'Public/Report/Consumer/EXISTING_APPLICATION_BOOK';
                    }
                    self.j_params.REFERENCE_NUMBER = self.application.reference_number;

                    const response = await axios.get(
                    `${import.meta.env.VITE_JASPERSERVER_API_URL}/rest_v2/reports/${self.ReportUnit}.pdf`,
                    {
                        params: self.j_params,
                        responseType: 'arraybuffer',
                    }
                    );

                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const blobUrl = URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `${self.application.lname}-${self.application.reference_number}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                } catch (error) {
                    alert("Download failed");
                     
                } finally {
                    self.$store.commit("setLoading", false);
                }
                }, 100); // Delay allows spinner to appear before processing begins
            });
        }


  }
}
</script>