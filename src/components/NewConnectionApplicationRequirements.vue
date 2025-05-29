<template>
    <div class="justify-center text-center flex items-center min-h-screen w-full text-white text-xs lg:text-base p-4">
        <div>
            <div class="bg-white text-gray-800 rounded-lg pb-5 px-5 pt-3">
              <h1 class="mb-2 font-medium">Classification of Premises Applied for and its Requirements</h1>
              <hr>
              <ul class="text-left mx-auto mt-3 grid grid-cols-1 gap-3 list">
                <li class="font-medium">
                  A. INDIGENOUS / LIGHT MATERIALS
                  <ul class="mt-2 list-disc list-outside ml-6 font-normal">
                    <li>Complete Set of Application Forms with Electrical Layout and Vicinity Map</li>
                    <li>Pre-Membership Seminar (PMS) Certificate</li>
                    <li>Xerox Copy of Residence Certificate (Cedula)/Valid ID</li>
                    <li>Fire Safety Clearance from Bureau of Fire Protection (BFP)</li>
                    <li>BAPA Endorsement for Applications within BAPA Coverage</li>
                    <li>Clearance from Accounts/Verification from Consumer Assistance Office (CAO)</li>
                  </ul>
                </li>
                <li class="font-medium">
                  B. CONCRETE RESIDENTIAL / COMMERCIAL BUILDING
                  <ul class="mt-2 list-disc list-outside ml-6 font-normal">
                    <li>Electrical Plan signed by Professional Electrical Engineer (PEE)</li>
                    <li>Electrical Permit signed by Municipal Engineer</li>
                    <li>Zoning Clearance from Municipal Planning and Development Coordinator (MPDC)</li>
                    <li>Business/DTI Permit for Commercial Connection</li>
                    <li>Special Power of Attorney/Secretary's Certificate / Board Resolution for Authorized Signatory/Representative to Sign for the Company/Corporation</li>
                  </ul>
                </li>
                <li class="font-medium">
                  C. CONSTRUCTION / SPECIAL LIGHTNING
                  <ul class="mt-2 list-disc list-outside ml-6 font-normal">
                    <li>Complete Set of Special Lightning Application Form with Vicinity Map</li>
                    <li>Application for Transformer Installation (if necessary)</li>
                    <li>Electrical Plan signed by Professional Electrical Engineer</li>
                    <li>Temporary Electrical Permit from Municipal Engineer</li>
                    <li>Clearance/Verification from Consumer Assistance Office (CAO)</li>
                  </ul>
                </li>
              </ul>
          </div>
         
          <div class="space-y-2 mt-5">
            <router-link :to="{name: 'ElectricalServiceApplication'}" class="btn btn-primary justify-center">Continue</router-link> <br>
            <router-link :to="{ name: 'Home' }" class="btn btn-white">Back</router-link>
          </div>
          
        </div>
    </div>
  </template>
  
  <script>
  export default {
    
  };
  </script>
  