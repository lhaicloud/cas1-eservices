<template>
    <div class="justify-center text-center min-h-screen w-full text-white p-4">
      <div class="w-full mx-auto space-y-2">
        <div class="w-full max-w-4xl mx-auto bg-white py-3 rounded-lg">
            <div  ref="stepContainer" class="flex items-center justify-between overflow-x-scroll px-2 overflow-y-hidden">
              
              <div
                v-for="(stepLabel, index) in visibleSteps"
                :key="index"
                class="flex-1 flex flex-col items-center relative bg-gray-100 p-2"
                :class="(visibleSteps.length > 4 ? 'px-2' : '')"
                :style="{ minWidth: 'max-content' }"
                :ref="index === application.step - 1 ? 'activeStep' : null"
              >
                <!-- Connector line -->
                <div
                  class="absolute top-1/3 left-0 w-full h-1 z-0"
                >
                  <div
                    :class="[
                      'h-full',
                      index <= application.step - 1 ? 'bg-blue-500' : 'bg-gray-300'
                    ]"
                  ></div>
                </div>

                <!-- Step Circle -->
                <div
                  class="z-10 flex items-center justify-center w-8 h-8 border-2 rounded-full text-sm font-bold"
                  :class="[
                    index < application.step - 1 ? 'bg-blue-500 text-white border-blue-500' :
                    index === application.step - 1 ? 'bg-white border-blue-500 text-blue-500' :
                    'bg-white border-gray-300 text-gray-400'
                  ]"
                >
                  
                  <!-- <span v-if="index + 1 < application.step" class="text-lg">✓</span> -->

                  <svg v-if="index === application.step - 1" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.007 7.007 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65a7.007 7.007 0 0 0-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.5.38 1.05.7 1.69.98l.38 2.65A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .5-.42l.38-2.65a7.007 7.007 0 0 0 1.69-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
                  </svg>
                  <span v-else>
                    {{ index + 1 < application.step  ? '✓' : index + 1 }}
                  </span>

                </div>

                <!-- Label -->
                <span
                  class="mt-2 text-xs text-center"
                  :class="index <= application.step - 1 ? 'text-blue-600 font-medium' : 'text-gray-400'"
                >
                  {{ stepLabel }}
                </span>
              </div>
            </div>
          </div>
          <div ref="errorMessage" class="bg-red-100 text-red-500 text-sm rounded-lg p-3 text-left max-w-4xl mx-auto" v-if="errorFields.length > 0">
            <h1>Please fill out the following required fields:</h1>
            <ul class="ml-3">
              <li v-for="e in errorFields"> {{ e }}</li>
            </ul>
          </div>
          <div ref="errorMessage2" class="bg-red-100 text-red-500 text-sm rounded-lg p-3 text-left max-w-4xl mx-auto" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:max-w-4xl lg:mx-auto">
           
            <div v-if="application.step >= 5" class="bg-green-100 text-green-800 rounded-md py-1.5 px-5 text-sm text-start flex items-center space-x-2">
                <div class="z-10 flex items-center justify-center w-5 h-5 border-2 rounded-full text-xs font-bold bg-green-500 border-green-500 text-white">✓</div> 
                <h1>{{ formatDate(application.submitted_at) }} - Submitted</h1>
            </div>
            <div v-if="application.step >= 6" class="bg-green-100 text-green-800 rounded-md py-1.5 px-5 text-sm text-start flex items-center space-x-2">
                <div class="z-10 flex items-center justify-center w-5 h-5 border-2 rounded-full text-xs font-bold bg-green-500 border-green-500 text-white">✓</div> 
                <h1>{{ formatDate(application.dfapply) }} - Received</h1>
            </div>
            <div v-if="application.step >= 7" class="bg-green-100 text-green-800 rounded-md py-1.5 px-5 text-sm text-star flex items-center space-x-2">
                <div class="z-10 flex items-center justify-center w-5 h-5 border-2 rounded-full text-xs font-bold bg-green-500 border-green-500 text-white">✓</div> 
                <h1>{{ formatDate(application.dfinspect) }} - Inspection</h1>
            </div>
            <div v-if="application.step >= 8" class="bg-green-100 text-green-800 rounded-md py-1.5 px-5 text-sm text-start flex items-center space-x-2">
                <div class="z-10 flex items-center justify-center w-5 h-5 border-2 rounded-full text-xs font-bold bg-green-500 border-green-500 text-white">✓</div> 
                <h1>{{ formatDate(application.dfsmemo) }} - Service Memorandum</h1>
            </div>
            <div v-if="application.step >= 9" class="bg-green-100 text-green-800 rounded-md py-1.5 px-5 text-sm text-start flex items-center space-x-2">
                <div class="z-10 flex items-center justify-center w-5 h-5 border-2 rounded-full text-xs font-bold bg-green-500 border-green-500 text-white">✓</div> 
                <h1>{{ formatDate(application.dfmct) }} - Material Charge Ticket</h1>
            </div>
            <div v-if="application.step >= 10" class="bg-green-100 text-green-800 rounded-md py-1.5 px-5 text-sm text-start flex items-center space-x-2">
                <div class="z-10 flex items-center justify-center w-5 h-5 border-2 rounded-full text-xs font-bold bg-green-500 border-green-500 text-white">✓</div> 
                <h1>{{ formatDate(application.dfconnect) }} - Connection</h1>
            </div>
          </div>
          <div class="text-sm bg-orange-100 rounded-md text-orange-800 text-start py-1.5 px-5 flex items-center space-x-2 max-w-4xl mx-auto" v-if="application.submitted_at && application.remarks">
            <div class="z-10 flex items-center justify-center w-6 h-5 border-2 rounded-full text-xs font-bold bg-orange-500 border-orange-500 text-white">&#8505;</div> 
            <span>Remarks: {{ application.remarks }}</span>
          </div>
          <!-- Step 1 -->
          <div class="bg-white text-gray-800 rounded-lg pb-5 px-5 pt-3 overflow-auto max-w-4xl mx-auto" v-if="application.step === 1">
            <div>
              <button class="text-gray-600 hover:text-black float-left" @click="back()">
                &lt;
              </button>
              <h1 class="mb-2 font-medium">Personal Information</h1>
            </div>
            
            <hr>
            <div class="text-left mx-auto mt-3 grid grid-cols-1 gap-3">
                <span class="text-red-600 text-xs">* - Required fields</span>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-4">
                  <div class="relative space-y-1">
                    <select
                      id="service_type"
                      v-model="application.service_type"
                      class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                      placeholder=" "
                    >
                      <option disabled value="">Please Select</option>
                      <option :value="service" v-for="service in services" :key="service.idservice1">{{ service.cfdescript }}</option>
                    </select>
                    <label              
                      for="service_type"
                      :class="[
                        'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                        application.service_type ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                      ]"
                      class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                    >
                      Service Type: <span class="text-red-600 text-xs">*</span>
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
                      Individual or Company: <span class="text-red-600 text-xs">*</span>
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
                      Classification: <span class="text-red-600 text-xs">*</span>
                    </label>
                  </div>
                    
                    <!-- <div class="flex items-center space-x-4 justify-center md:col-span-3">
                      <div>
                        <input type="radio" id="individual" v-model="application.is_company" :value="0" class="mr-2" />
                        <label for="individual" class="cursor-pointer">Individual</label>
                      </div>
                      <div>
                        <input type="radio" id="company" v-model="application.is_company" :value="1" class="mr-2" />
                        <label for="company" class="cursor-pointer">Company</label>
                      </div>
                    </div> -->
                   
                    <div v-if="application.service_type && application.service_type.cfnewconnect == 'NO'" class="relative space-y-1">
                      <label 
                        for="can" 
                        :class="[
                          'flex items-center gap-x-1 absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.account_number ? '-top-1.5 text-xs text-blue-500 bg-white' : 'top-3.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-5 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16" height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Consumer Account Number <span class="text-red-600 text-xs">*</span>
                      </label>
                      <input
                        type="text"
                        id="can"
                        v-model="application.account_number"
                        class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 read-only:bg-white"
                        @click="showModal=true"
                        readonly
                        required
                        placeholder=" "
                      />
                    </div>
                    <div class="relative space-y-1">
                      <input
                        id="fname"
                        type="text"
                        v-model="application.fname"
                        @input="application.fname = application.fname.toUpperCase()"
                        :class="[
                          'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        ]"
                        placeholder=" "
                        autocomplete="off"
                        required
                      />
                      <label
                        for="fname"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.fname ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        First Name <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>
                    <!-- Middle Name -->
                    <div class="relative space-y-1">
                      <input
                        id="mname"
                        type="text"
                        v-model="application.mname"
                        @input="application.mname = application.mname.toUpperCase()"
                        :class="[
                          'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        ]"
                        placeholder=" "
                        autocomplete="off"
                      />
                      <label
                        for="mname"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.mname ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Middle Name
                      </label>
                    </div>

                    <!-- Last Name -->
                    <div class="relative space-y-1">
                      <input
                        id="lname"
                        type="text"
                        v-model="application.lname"
                        @input="application.lname = application.lname.toUpperCase()"
                        :class="[
                          'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        ]"
                        placeholder=" "
                        autocomplete="off"
                        required
                      />
                      <label
                        for="lname"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.lname ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Last Name <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>

                    <!-- Spouse Name -->
                    <div class="relative space-y-1" v-if="!application.is_company">
                      <input
                        id="spname"
                        type="text"
                        v-model="application.spname"
                        @input="application.spname = application.spname.toUpperCase()"
                        :class="[
                          'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        ]"
                        placeholder=" "
                        autocomplete="off"
                        required
                      />
                      <label
                        for="spname"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.spname ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Spouse Name
                      </label>
                    </div>

                    <!-- Company Name -->
                    <div class="relative space-y-1" v-if="application.is_company">
                      <input
                        id="company_name"
                        type="text"
                        v-model="application.company_name"
                        @input="application.company_name = application.company_name.toUpperCase()"
                        :class="[
                          'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        ]"
                        placeholder=" "
                        autocomplete="off"
                        required
                      />
                      <label
                        for="company_name"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.company_name ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Name of Company <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>
                    <div class="relative space-y-1">
                      <select
                        id="applicant_municipality"
                        v-model="application.applicant_municipality"
                        @change="getBrgy()"
                        required
                        class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                        placeholder=" "
                      >
                        <option disabled value="">Please select</option>
                        <option :value="mun" v-for="mun in municipalities" :key="mun.idpsgc">{{ mun.name }}</option>
                      </select>
                      <label
                        for="applicant_municipality"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.applicant_municipality ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Municipality <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>
                    <div class="relative space-y-1">
                      <select
                        :disabled="!application.applicant_municipality"
                        id="applicant_barangay"
                        v-model="application.applicant_barangay"
                        required
                        class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                        :class="!application.applicant_municipality ? 'bg-gray-100' : ''"
                        placeholder=" "
                      >
                        <option disabled value="">Please select</option>
                        <option :value="brgy" v-for="brgy in brgys1" :key="brgy.idbgy">{{ brgy.cfdescript }}</option>
                      </select>
                      <label
                        for="applicant_barangay"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.applicant_barangay ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Barangay <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>

                    <div class="relative space-y-1">
                      <input
                        type="text"
                        id="zone"
                        v-model="application.applicant_zone"
                        @input="application.applicant_zone = application.applicant_zone.toUpperCase()"
                        required
                        class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                        placeholder=" "
                      />
                      <label
                        for="zone"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.applicant_zone ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Zone/Street/Sitio/Block <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>
                    <div class="md:col-span-3 grid grid-cols-3 gap-3">
                      <div class="relative col-span-3 flex items-center ">
                        <input type="checkbox" id="same_address" v-model="application.same_address" class="mr-2"/>
                        <label for="same_address" class="text-sm ml-2">Service Address is same as the above address</label>
                      </div>
                      <div v-if="application.same_address" class="text-[0.6rem] text-gray-500 col-span-3">If checked, the service address will be the same as the applicant's address.</div>
                      <div v-if="!application.same_address" class="text-[0.6rem] leading-none text-gray-500 col-span-3">If not checked, please fill out the service address below.</div>
                      <h1 v-if="!application.same_address" class="text-xs col-span-3">Location of Premises/Bldg. Applied for Serv. Conn. <span class="text-red-600 text-xs">*</span></h1>
                        
                      <!-- <div v-if="!application.same_address" class="space-y-4"> -->
                        <!-- Municipality -->
                        <div class="relative space-y-1 col-span-3 md:col-span-1" v-if="!application.same_address">
                          <select
                            id="service_municipality"
                            class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                            v-model="application.service_municipality"
                            @change="getBrgy2()"
                            required
                          >
                            <option disabled value="">Please select</option>
                            <option :value="mun" v-for="mun in municipalities" :key="mun.idpsgc">{{ mun.name }}</option>
                          </select>
                          <label
                            for="service_municipality"
                            :class="[
                              'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                              application.service_municipality ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                            ]"
                            class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                          >
                            Municipality <span class="text-red-600 text-xs">*</span>
                          </label>
                        </div>

                        <!-- Barangay -->
                        <div class="relative space-y-1 col-span-3 md:col-span-1" v-if="!application.same_address">
                          <select
                            :disabled="!application.service_municipality"
                            id="service_barangay"
                            class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                            v-model="application.service_barangay"
                            :class="!application.service_municipality ? 'bg-gray-100' : ''"
                            required
                          >
                            <option disabled value="">Please select</option>
                            <option :value="brgy" v-for="brgy in brgys2" :key="brgy.idbgy">{{ brgy.cfdescript }}</option>
                          </select>
                          <label
                            for="service_barangay"
                            :class="[
                              'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                              application.service_barangay ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                            ]"
                            class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                          >
                            Barangay <span class="text-red-600 text-xs">*</span>
                          </label>
                        </div>

                        <!-- Zone/Street/Sitio/Block -->
                        <div class="relative space-y-1 col-span-3 md:col-span-1" v-if="!application.same_address">
                          <input
                            type="text"
                            id="zone2"
                            v-model="application.service_zone"
                            @input="application.service_zone = application.service_zone.toUpperCase()"
                            required
                            placeholder=" "
                            class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                          />
                          <label
                            for="zone2"
                            :class="[
                              'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                              application.service_zone ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                            ]"
                            class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                          >
                            Zone/Street/Sitio/Block <span class="text-red-600 text-xs">*</span>
                          </label>
                        </div>
                      <!-- </div> -->
                    </div>
                    <div class="md:col-span-3 relative">
                        <input type="checkbox" id="spa" v-model="application.spa" class="mr-2"/>
                        <label for="spa" class="ml-3 mt-1.5 text-xs">W/ SPA</label>
                    </div>
                    <div v-if="application.spa" class="relative space-y-1">
                      <input
                        id="authorized_signatory_name"
                        type="text"
                        v-model="application.authorized_signatory_name"
                        @input="application.authorized_signatory_name = application.authorized_signatory_name.toUpperCase()"
                        class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                        placeholder=" "
                        required
                      />
                      <label
                        for="authorized_signatory_name"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.authorized_signatory_name ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Name <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>

                    <!-- Authorized Signatory Address -->
                    <div v-if="application.spa" class="relative space-y-1 md:col-span-2">
                      <input
                        id="authorized_signatory_address"
                        type="text"
                        v-model="application.authorized_signatory_address"
                        @input="application.authorized_signatory_address = application.authorized_signatory_address.toUpperCase()"
                        class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                        placeholder=" "
                        required
                      />
                      <label
                        for="authorized_signatory_address"
                        :class="[
                          'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                          application.authorized_signatory_address ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                        ]"
                        class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                      >
                        Address <span class="text-red-600 text-xs">*</span>
                      </label>
                    </div>
                    <div class="grid md:grid-cols-3 md:col-span-3 gap-x-2 gap-y-4  mt-2">
                      <div v-if="!application.is_company" class="relative space-y-1">
                        <input
                          type="date"
                          id="birthdate"
                          v-model="application.birthdate"
                          required
                          class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <label
                          for="birthdate"
                          class="absolute left-3 -top-3 text-xs bg-white px-1 transition-all duration-200 ease-in-out peer-focus:text-blue-500"
                        >
                          Date of Birth <span class="text-red-600 text-xs">*</span>
                        </label>
                      </div>
                      
                      <div v-if="!application.is_company" class="relative space-y-1">
                        <select
                          id="civil_status"
                          v-model="application.civil_status"
                          required
                          class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                          placeholder=" "
                        >
                          <option disabled value="">Select Civil Status</option>
                          <option value="SINGLE">Single</option>
                          <option value="MARRIED">Married</option>
                          <option value="WIDOWED">Widowed</option>
                          <option value="SEPARATED">Separated</option>
                          <option value="DIVORCED">Divorced</option>
                        </select>
                        <label
                          for="civil_status"
                          :class="[
                            'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                            application.civil_status ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                          ]"
                          class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                        >
                          Civil Status <span class="text-red-600 text-xs">*</span>
                        </label>
                      </div>
                      <div class="relative space-y-1">
                        <div class="relative flex items-center">
                          <span class="text-sm top-[0.80rem] left-3 absolute">+63</span>

                          <input
                            type="tel"
                            id="contact_no"
                            v-model="application.contact_no"
                            placeholder=" "
                            pattern="[0-9]{10}"
                            maxlength="10"
                            required
                            class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 pl-12 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />

                          <label
                            for="contact_no"
                            class="absolute -top-2 left-3 px-1 text-xs text-gray-500 bg-white transition-all duration-200 ease-in-out peer-focus:text-blue-500"
                          >
                            Contact No. <span class="text-red-600 text-xs">*</span>
                          </label>
                        </div>
                        
                      </div>
                      <div class="relative space-y-1">
                        <input
                          type="email"
                          id="email"
                          v-model="application.email"
                          @input="application.email = application.email.toUpperCase()"
                          @keyup.enter="next()"
                          required
                          placeholder=" "
                          class="peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 uppercase"
                        />
                        <label
                          for="email"
                          :class="[
                            'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
                            application.email ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
                          ]"
                          class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
                        >
                          Email <span class="text-red-600 text-xs">*</span>
                        </label>
                        <div class="text-[0.6rem] text-gray-500 col-span-3">
                          Please provide a valid email. We'll use it to send you application updates and confirmations.
                        </div>
                      </div>
                      <!-- <div v-if="!application.is_company">
                        <label for="male">Sex</label>
                        <div class="flex items-center space-x-4">
                          <div>
                            <input type="radio" id="male" v-model="application.sex" value="M" class="mr-2" />
                            <label for="male" class="cursor-pointer">Male</label>
                          </div>
                          <div>
                            <input type="radio" id="female" v-model="application.sex" value="F" class="mr-2" />
                            <label for="female" class="cursor-pointer">Female</label>
                          </div>
                        </div>
                      </div> -->
                    </div>
                    
                    
                  </div>
            </div>
          </div>
          
          <!-- Step 2 -->
          <div v-if="application.step === 2" class="max-w-4xl mx-auto">
            <electrician :application="application" @back="back()"></electrician>
          </div>

          <!-- STEP 3 -->
          <div v-if="application.step === 3" class="max-w-4xl mx-auto">
            <schedule :application="application" @back="back()"></schedule>
          </div>

          <!-- STEP 4 -->

          <div v-if="application.step == 4" class="max-w-4xl mx-auto">
              <application-summary :application="application" @back="back()"></application-summary>
          </div>
          
          <!-- STEP 5 -->
          <div v-if="application.step >= 5" class="max-w-4xl mx-auto">
            <application-submitted :application="application"></application-submitted>
          </div>

          <div class="flex flex-col-reverse md:flex-row justify-between gap-2 mt-4 max-w-4xl mx-auto">
              <!-- Left buttons -->
              <div class="flex flex-col md:flex-row justify-start items-center gap-2 w-full md:w-auto">
                <button class="btn btn-white mx-1 w-full md:w-auto" @click="back()" v-if="application.step < 5 && application.step > 1">&lt; Back</button>
                <button class="btn btn-primary justify-center mx-1 w-full md:w-auto"
                        @click="newApplication()" 
                        :disabled="!application.service_type && !application.is_company && !application.classification"
                        v-if="application.submitted_at && application.step >= 5">New Application</button>
                <button class="btn btn-secondary mx-1 w-full md:w-auto"
                        @click="viewExistingApplication()" 
                        v-if="application.step == 1">I Have An Existing Application</button>
              </div>

              <!-- Right buttons -->
              <div class="flex flex-col md:flex-row justify-end items-center gap-2 w-full md:w-auto">
                <!-- <button class="btn btn-white mx-1 w-full md:w-auto"
                        v-if="application.lname != null && (application.dfapply && application.dfapply == '0000-00-00') && application.step == 1" 
                        @click="continueApplication()">Continue Application</button> -->
                <button class="btn btn-primary mx-1 w-full md:w-auto" 
                        @click="next()" v-if="application.step < 4">Next</button>
                <button class="btn btn-primary mx-1 w-full md:w-auto" 
                        @click="submitApplication()" 
                        v-if="application.step == 4 && !application.submitted_at" 
                        :disabled="!application.is_agree_term">Submit</button>
                <button class="btn btn-warning mx-1 w-full md:w-auto" 
                        v-if="application.step == 4 && application.submitted_at" 
                        @click="updateApplication()">Update</button>
                <button class="btn btn-white mx-1 w-full md:w-auto" @click="application.step = 1" v-if="application.step == 5">Edit Application</button>
              </div>
            </div>


          

          
          
          <!-- <div class="mt-3" v-if="application.step < 5"> -->
            <!-- <button class="btn btn-white" @click="back()">Back</button> -->
          <!-- </div> -->

          <!-- <button class="btn btn-white" @click="back()">Back</button> -->
          
         
      </div>
      
      <FindAccount :visible.sync="showModal" :application.sync="application" />
    </div>
</template>

<script>  
import debounce from 'lodash/debounce';
import Schedule from './Schedule.vue';
import ApplicationSummary from './ApplicationSummary.vue';
import Electrician from './Electrician.vue';
import ApplicationSubmitted from './ApplicationSubmitted.vue';
import FindAccount from './FindAccount.vue'
import axios from 'axios'
import { nextTick } from 'vue';
import { mapState } from 'vuex';

  export default {
    components: {
      Schedule, ApplicationSummary, Electrician, ApplicationSubmitted, FindAccount
    },
    name: "NewConnectionApplication",
    data() {
      return {
        application: this.$store.state.application,
        steps: [
          "Info",
          "Electrician",
          "Schedule",
          "Submit",
          "Received",
          "Inspection",
          "Service Memorandum",
          "Material Charge Ticket",
          "Connected"
        ],
        errorMessage: '',
        errorFields: [],
        psgcData: [],
        municipalities: [],
        municipalities2: [],
        brgys1: [],
        brgys2: [],
        showModal: false,
        services:[
          { cfdescript: "NEW CONNECTION", cfnewconnect: "YES", idservice1: 1 },
          { cfdescript: "RELOCATION", cfnewconnect: "NO", idservice1: 8 },
          { cfdescript: "EXTENSION / ADDITIONAL CONNECTION", cfnewconnect: "NO", idservice1: 6 },
        ]
      };
    },
    computed: {
      stepProgress() {
        return `${(this.application.step - 1) / 3 * 100}%`;
      },
      applicant_address(){
        return this.application.applicant_zone + ', ' + this.application.applicant_barangay.cfdescript.toUpperCase()  + ", " + this.application.applicant_municipality.name.toUpperCase()
      },
      service_address(){
        // return this.application.same_address ? this.applicant_address : this.application.service_zone + ', ' + this.application.service_barangay.cfdescript.toUpperCase() + ", " + this.application.service_municipality.name.toUpperCase()
      },
      visibleSteps() {
        const allSteps = [
          "Fill up",
          "Electrician",
          "Schedule",
          "Submit",
          "Received",
          "Inspection",
          "Service Memo",
          "M.C.T.",
          "Connected"
        ];

        // Hide the last 5 steps if not submitted
        if (!this.application?.submitted_at) {
          return allSteps.slice(0, 4); // Up to "Submit"
        }

        return allSteps;
      },
      ...mapState({
        electricians: state => state.electricians,
        electricians1: state => state.electricians,
      }),
      
    },
    watch: {
      application: {
        handler: debounce(function (newVal) {
          this.$store.commit('setApplication', newVal);
        }, 500),
        deep: true
      },
      'application.same_address': function (newVal) {
        if (newVal) {
          this.application.service_address = this.applicant_address;
          this.application.service_zone = this.application.applicant_zone
          this.application.service_municipality = this.application.applicant_municipality
          this.application.service_barangay = this.application.applicant_barangay
        } else {
          this.application.service_address = null;
          this.application.service_zone = null;
          this.application.service_municipality = null;
          this.application.service_barangay = null;
        }
      },
      'application.is_company': function (newVal) {
        if (newVal) {
          if(this.application.same_address) {
            this.application.service_address =  this.application.applicant_address;
          }
          this.application.spname = null;
          this.application.birthdate = null;
          this.application.sex = null;
          this.application.civil_status = null;
          this.application.applicant_address = null;
        } else {
          this.application.company_name = null;
          this.application.authorized_signatory_name = null;
          this.application.authorized_signatory_address = null;
          this.application.spa = false;
        }
        this.application.is_company = newVal
      },
      'application.applicant_address': function (newVal) {
        if (this.application.same_address) {
          this.application.service_address = newVal;
        }
      },
      // 'application.company_address': function (newVal) {
      //   if (this.application.same_address) {
      //     this.application.service_address = newVal;
      //   }
      // },
      'application.applicant_municipality': function (newVal) {
        this.getBrgy();
        if (this.application.same_address) {
          this.application.service_municipality = newVal;
          this.getBrgy2();
        }
        if (newVal) {
          this.application.applicant_cfareacode = newVal.cfareacode;
        } else {
          this.application.applicant_cfareacode = null;
        }
      },
      'application.applicant_barangay': function (newVal) {
        if (this.application.same_address) {
          this.application.service_barangay = newVal;
        }
      },
      'application.applicant_zone': function (newVal) { 
        if (this.application.same_address) {
          this.application.service_zone = newVal;
        }
      },
      'application.service_municipality': function (newVal) {
        if(newVal){
          // this.application.service_barangay = null;  
          this.application.service_cfareacode = newVal.cfareacode;
          
          // this.application.electrician_id = null;
          // this.application.electrician = null;
        }
      },
      'application.step'(newVal) {
        this.scrollToActiveStep()
      },
      // 'application.no_electrician' :function (newVal) {
      //     // this.application.electrician = null
      //     // this.application.electrician_id = null
      // },
      
      
    },
    methods: {
      validateApplication() {
        if (this.application.same_address) {
          this.application.service_address = this.applicant_address;
          this.application.service_zone = this.application.applicant_zone
          this.application.service_municipality = this.application.applicant_municipality
          this.application.service_barangay = this.application.applicant_barangay
        }else{
          const zone = this.application.service_zone || '';
          const barangay = this.application.service_barangay?.cfdescript?.toUpperCase() || '';
          const municipality = this.application.service_municipality?.name?.toUpperCase() || '';

          this.application.service_address = `${zone}, ${barangay}, ${municipality}`;
        }

        this.errorFields = []
        const requiredFields = {
          service_type: "Service Type",
          is_company: "Individual or Company",
          classification: "Classification",
          fname: "First Name",
          lname: "Last Name",
          service_address: "Service Address",
          contact_no: "Contact Number",
          email: "Email Address",
          service_barangay: "Service Barangay",
          service_municipality: "Service Municipality",
          service_zone: "Service Zone/Sitio/Street",
        };
        if(this.application.service_type.cfnewconnect == 'NO'){
           Object.assign(requiredFields, {
            account_number: "Account Number"
          });
          
        }
        if (!this.application.is_company) {
          Object.assign(requiredFields, {
            // spname: "Spouse",
            // applicant_address: "Applicant Address",
            birthdate: "Birthdate",
            civil_status: "Civil Status",
            applicant_municipality: "Municipality",
            applicant_barangay: "Barangay",
            applicant_zone: "Zone/Street/Sitio/Block",
          });
        }
        


        if (this.application.is_company) {
          Object.assign(requiredFields, {
            company_name: "Company Name",
            // company_address: "Company Address",
            // service_municipality: "Service Municipality",
            // service_barangay: "Service Barangay",
            // service_zone: "Service Zone/Street/Sitio/Block",
          });

          if (this.application.spa) {
            Object.assign(requiredFields, {
              authorized_signatory_name: "Authorized Signatory Name",
              authorized_signatory_address: "Authorized Signatory Address",
            });
          }
        }

        const missingFields = Object.keys(requiredFields).filter(
          (key) => this.application[key] === null || this.application[key] === undefined || this.application[key] === ''
        );
        console.log(missingFields)
        // ✅ Validate age: at least 18 years old
        if (!this.application.is_company && this.application.birthdate) {
          const birthDate = new Date(this.application.birthdate);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();

          if (age < 18 || (age === 18 && m < 0) || (age === 18 && m === 0 && today.getDate() < birthDate.getDate())) {
            missingFields.push("birthdate");
          }
        }
        
        if (missingFields.length > 0) {
          this.errorFields = missingFields.map((key) => `• ${requiredFields[key]}`);
          nextTick(() => {
            const target = this.$refs.errorMessage;
            if (target && target.scrollIntoView) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          })
          return false;
        }
        
        this.application.applicant_address = this.applicant_address
        // this.application.service_address = this.service_address

        return true;
      },
      next(){
        if(this.application.step === 1) {
          if (!this.validateApplication()) return;
        } else if (this.application.step === 2) {
          const { electrician_id, no_electrician, electrician, service_cfareacode } = this.application;

          const isNoElectricianSelected = electrician_id == null && no_electrician == 0;
          const isElectricianFromOtherArea = electrician && electrician.cfareacode !== service_cfareacode;
          // console.log(isNoElectricianSelected)
          // console.log(isElectricianFromOtherArea)
          if (isNoElectricianSelected || isElectricianFromOtherArea) {
            alert("Please select an electrician in your area.");
            return;
          }
        }else if(this.application.step == 3){
          if(!this.application.selectedDate){
            alert("Please select a Date");
            return;
          }
        }
        if(this.application.step < 5) {
          this.application.step += 1;
        }
      },
      back(){
        if(this.application.step > 1){
          this.application.step -= 1;
        }else{
          this.$router.push({ name: "Home"});
        }
      },
      async submitApplication(){
        var self = this
        if(!self.application.is_agree_term){return;}
        self.errorMessage = ''
        self.$store.commit("setLoading", true);
        await axios.post(`${import.meta.env.VITE_CIMS_API_URL}/api/consumer-services/online-application/insert`, {form_data: JSON.stringify(self.application) })
        .then(response => {
          self.application.submitted_at = response.data.submitted_at
          self.application.reference_number = response.data.reference_number
          self.application.step = response.data.step;
          self.$store.commit("setLoading", false);
        })
        .catch(error => {
          self.$store.commit("setLoading", false);
          self.errorMessage = 'An unexpected error occurred. Please try again later.';
          if (error.response) {
            // Server responded with a status code (500 in this case)
            if (error.response.status === 500) {
              self.errorMessage = 'Something went wrong on our end. Please try again later.';
            } else if (error.response.status === 400) {
              self.errorMessage = 'Bad request. Please check your input.';
            } else if (error.response.status === 422) {
              self.errorMessage = 'Validation failed. Please review your form.';
            } else {
              self.errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
            }
          } else if (error.request) {
            // No response received
            self.errorMessage = 'Server is not responding. Please check your internet connection or try again later.';
          } else {
            // Something else went wrong
            self.errorMessage = error.message || self.errorMessage;
          }
          nextTick(() => {
            const target = self.$refs.errorMessage2;
            if (target && target.scrollIntoView) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          })
        });
      },
      generateRefNumber2() {
        const now = Date.now(); // current timestamp
        const random = Math.floor(Math.random() * 1000); // random number 0-999
        const refno = `${now}${random}`;
        // this.application.reference_number = refno
        // this.application.submitted_at = Date.now();
      },
      generateRefNumber() {
        const refno = Math.random().toString(36).substr(2, 8).toUpperCase();
        // this.application.reference_number = refno
        // this.application.submitted_at = Date.now();
      },
      async getPSGC(){
          var self = this
          await fetch("/psgc.json") // Replace with your file path
          .then(response => response.json()) // Parse JSON
          .then(data => {
              self.psgcData = data
              self.$store.commit("setPsgcData",data)
              self.municipalities = data.filter((m) => m.geo_level == 'Mun').sort((a, b) => a.name.localeCompare(b.name))
              if(self.application.applicant_municipality){
                self.getBrgy()
              }
              if(self.application.service_municipality){
                self.getBrgy2()
              }
          }) // Use the JSON data
          .catch(error => console.error("Error loading JSON:", error));
      },
      async getBrgy(){
          const cftowncode = this.application.applicant_municipality.cfareacode;
          const apiUrl = `${import.meta.env.VITE_CIMS_API_URL}/api/bgy/get?cftowncode=${encodeURIComponent(cftowncode)}`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            this.brgys1 = data
          } catch (error) {
            console.error("Error loading JSON:", error);
          }
          // self.brgys1 = self.psgcData.filter((psgc) => psgc.geo_code.startsWith(self.application.applicant_municipality.geo_code.substring(0, 6)) && psgc.geo_level == 'Bgy').sort((a, b) => a.name.localeCompare(b.name))
          
      },
      async getBrgy2(){
          const cftowncode = this.application.service_municipality.cfareacode;
          const apiUrl = `${import.meta.env.VITE_CIMS_API_URL}/api/bgy/get?cftowncode=${encodeURIComponent(cftowncode)}`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            this.brgys2 = data
          } catch (error) {
            console.error("Error loading JSON:", error);
          }
          // self.brgys2 = self.psgcData.filter((psgc) => psgc.geo_code.startsWith(self.application.service_municipality.geo_code.substring(0, 6)) && psgc.geo_level == 'Bgy').sort((a, b) => a.name.localeCompare(b.name))
      },
      scrollToActiveStep() {
        if (
          this.visibleSteps.length > 4 &&
          this.$refs.stepContainer &&
          this.$refs.activeStep
        ) {
          nextTick(() => {
            const container = this.$refs.stepContainer
            const active = this.$refs.activeStep

            if (active && active[0]) {
              const el = active[0]
              container.scrollTo({
                left: el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2,
                behavior: 'smooth'
              })
            }
          })
        }
      },
      updateApplication(){

        var self = this
        if(!self.application.is_agree_term){return;}
        self.errorMessage = ''
        self.$store.commit("setLoading", true);
        axios.patch(`${import.meta.env.VITE_CIMS_API_URL}/api/consumer-services/online-application/update`, {form_data: JSON.stringify(self.application) })
        .then(response => {
          self.application = response.data[0]
          self.$store.commit("setLoading", false);
          // this.$store.commit("setApplication", response.data)
          // this.$router.push({ name: "NewConnectionApplication"});
        })
        .catch(error => {
          self.$store.commit("setLoading", false);
          self.errorMessage = 'An unexpected error occurred. Please try again later.';
          if (error.response) {
            // Server responded with a status code (500 in this case)
            if (error.response.status === 500) {
              self.errorMessage = 'Something went wrong on our end. Please try again later.';
            } else if (error.response.status === 400) {
              self.errorMessage = 'Bad request. Please check your input.';
            } else if (error.response.status === 422) {
              self.errorMessage = 'Validation failed. Please review your form.';
            } else {
              self.errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
            }
          } else if (error.request) {
            // No response received
            self.errorMessage = 'Server is not responding. Please check your internet connection or try again later.';
          } else {
            // Something else went wrong
            self.errorMessage = error.message || self.errorMessage;
          }
          nextTick(() => {
            const target = self.$refs.errorMessage2;
            if (target && target.scrollIntoView) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          })
        });
      },
      async getElectricians(){
          var self = this;
          await fetch(`${import.meta.env.VITE_CIMS_API_URL}/api/electricians/get`)
          .then(response => response.json())
          .then(data => {
          data.map((item) => {
              item.image_path = import.meta.env.VITE_CIMS_API_URL + "/"+item.filename
          })
          // self.electricians = data.filter((d) => { return d.cfareacode == self.application.service_cfareacode });
          // self.electricians1 = data.filter((d) => { return d.cfareacode == self.application.service_cfareacode });
          if(data.length == 0){
              self.getLocalElectrians()
          }
          self.$store.commit("setElectricians", data)
          self.$store.commit("setElectricians1", data)
          // console.log(data);
          })
          .catch(function (error) {
            console.log(error);
            self.getLocalElectrians()
          });
          
      },
      async getLocalElectrians(){
          var self = this 
          await fetch('/electricians.json')
          .then(response => response.json())
          .then(data => {
          data.map((item) => {
              item.image_path = "/electricians/"+item.cfidno+".jpg"
          })
          // self.electricians = data;
          // self.electricians1 = data;
          self.$store.commit("setElectricians", data)
          self.$store.commit("setElectricians1", data)
          })
          .catch(error => {
          console.error('Error loading JSON:', error);
          });
      },
      formatDate(date) {
        if(!date){return '00/00/0000'}
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Date(date).toLocaleDateString("en-US", options);
      },
      async getApplication(){
        if(this.application && this.application.reference_number){
          await fetch(`${import.meta.env.VITE_CIMS_API_URL}/api/consumer-services/online-application/findReferenceNumber/${this.application.reference_number}`)
          .then(response => response.json())
          .then(data => {
            this.application = data[0]
            // console.log(this.application)
          })
          .catch(error => {
            console.error('Error loading JSON:', error);
          });
        }
      },
      viewExistingApplication(){
        this.$router.push({ name: "ViewExistingApplication"});
      },
      newApplication(){
        this.$store.commit('resetApplication');
        this.$router.go();
      }
      
    },
    created() {
      this.getPSGC();
      this.getApplication();
    },
    mounted() {
      this.getElectricians();
      // if(!this.application.service_type){this.$router.push({ name: "ElectricalServiceApplication"});}
      this.scrollToActiveStep()
      // console.log(this.application)
    },
  };  
</script>