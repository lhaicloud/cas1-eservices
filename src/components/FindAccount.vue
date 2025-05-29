<template>
  <div v-if="visible" class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-gray-700">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-6 px-3 py-5 relative  max-h-[90vh] overflow-y-auto">
      
      <!-- Close Button -->
      <button @click="close" class="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl">
        &times;
      </button>

      <!-- Header -->
      <h2 class="text-xl font-semibold mb-4">Find Account</h2>
      
      <div class="relative space-y-1">
        <input
          type="text"
          id="can"
          v-model="searchKey"
          @keyup.enter="findAccount"
          ref="can"
          placeholder=" "
          autocomplete="off"
          required
          :class="[
            'peer block w-full border rounded-md px-3 pt-3 pb-1.5 text-sm placeholder-transparent focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          ]"
        />
        <label
          for="can"
          :class="[
            'absolute left-3 px-1 transition-all duration-200 ease-in-out text-gray-500',
            searchKey ? '-top-3 text-xs text-blue-500 bg-white' : 'top-1.5 text-sm bg-transparent'
          ]"
          class="peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white"
        >
          Account Number/Name
        </label>
      </div>
      <button type="button" class="btn btn-primary my-3" @click="findAccount">
        Find
      </button>

      <h1 class="text-xs text-left mt-5">Results: {{ results.length }}</h1>
      <h2 class="text-xs text-left mt-2 mb-2 text-gray-500">Please select your account</h2>
      <!-- Results Table -->
      <div v-if="results.length" class=" max-h-96 overflow-y-auto rounded">
        <table class="text-xs text-start table-auto w-full">
          <thead class="bg-gray-100 sticky top-0">
            <tr>
              <th class="px-2 py-2 border">C.A.N.</th>
              <th class="px-2 py-2 border">Name</th>
              <th class="px-2 py-2 border">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" :key="result.id" @click="selectAccount(result)">
              <td class="px-2 py-2 border text-nowrap">{{ result.cfrotcode }}-{{ result.cfacctno }}</td>
              <td class="px-2 py-2 border text-nowrap">{{ result.cflastname }}, {{ result.cffirstnam }} {{ result.cfmidname }}</td>
              <td class="px-2 py-2 border text-nowrap">{{ result.cfaddress }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Results -->
      <div v-else class="text-sm text-gray-500 mt-4 ">No results found.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['visible', 'application'],
  data(){
    return {
        searchKey: '',
        results: [],
        psgcdata: this.$store.state.psgcdata
    }
  },
  computed: {
    municipalities(){
        return this.psgcdata.filter((m) => m.geo_level == 'Mun').sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  mounted(){
    
  },
  watch: {
    visible(newVal) {
        if (newVal) {
            document.body.style.overflow = 'hidden';
            this.$nextTick(() => {
                setTimeout(() => {
                if (this.$refs.can) {
                    this.$refs.can.focus();
                }
                }, 100);
            });
        }else{
            document.body.style.overflow = '';
        }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    async findAccount(){
        var self = this
        if(self.searchKey.trim() == ''){return;}
        this.$store.commit("setLoading", true);
        try {
            const response = await fetch(
            `${import.meta.env.VITE_CIMS_API_URL}/api/master/find3?search_key=${encodeURIComponent(self.searchKey)}`
            );
            self.results = await response.json();
            this.$store.commit("setLoading", false);
        } catch (error) {
            this.$store.commit("setLoading", false);
            console.log('Error loading JSON:', error);
        }
    },
    selectAccount(selected){
        // Create a new object copying the existing application, but updated
        const updatedApp = {
            ...this.application,
            account_number: selected.cfrotcode + "-" + selected.cfacctno,
            cfcodeno: selected.cfcodeno,
            fname: selected.cffirstnam,
            lname: selected.cflastname,
            mname: selected.cfmidname,
            spname: selected.cfspouse,
            applicant_municipality: this.municipalities.find(mun => mun.cfareacode === selected.cfareacode) || null,
            contact_no: selected.cfcellphone.trim(),
        };

        this.$emit('update:application', updatedApp);
        this.close();
    }
  },
  
}
</script>
