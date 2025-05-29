<template>
    <div class="justify-center text-center flex items-center min-h-screen w-full p-5 text-gray-800">
      <div class="bg-white w-full lg:max-w-md rounded-lg p-5">
        <div>
          <h1 class="font-bold">Account Verification</h1>
          <form class="mt-5">
            
            <div>
              <div class="relative mb-6">
              <input
                type="tel"
                id="account_number"
                ref="account_number"
                v-model="AccountNumber"
                maxlength="8"
                autocomplete="off"
                placeholder="1234-5678"
                class="peer block w-full border border-gray-300 rounded-md px-3 pt-4 pb-1.5 text-sm text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <label
                for="account_number"
                :class="[
                  'absolute left-3 text-gray-500 transition-all duration-200 ease-in-out bg-white px-1',
                  AccountNumber ? '-top-2 text-xs text-blue-500' : 'top-2.5 text-sm',
                ]"
                class="peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Enter your account number
              </label>
            </div>
            <div class="relative mb-6">
              <input
                type="text"
                id="account_name"
                v-model="AccountName"
                autocomplete="off"
                placeholder=" "
                class="peer block w-full border border-gray-300 rounded-md px-3 pt-4 pb-1.5 text-sm text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <label
                for="account_name"
                :class="[
                  'absolute left-3 text-gray-500 transition-all duration-200 ease-in-out bg-white px-1',
                  AccountName ? '-top-2 text-xs text-blue-500' : 'top-2.5 text-sm',
                ]"
                class="peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Enter your account name
              </label>
              <small class="text-gray-400 mt-1 block">
                Ex. Dela Cruz, Juan S.<br />(not case-sensitive)
              </small>
            </div>

            </div>
            
            <button
              type="submit"
              class="btn btn-primary mt-2 mb-2 col-md-12"
              @click.prevent="submit()"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      loading: false,
      AccountNumber: "",
      AccountName: "",
    };
  },
  mounted() {
    this.$refs.account_number.focus();
  },
  methods: {
    submit(){
              
          var self = this;
          self.loading = true;
          axios
          .post(`${import.meta.env.VITE_CASURECO1API_URL}/billinquiry/mobile/findAccount`,
            {account_no: self.AccountNumber,accountname: self.AccountName},
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_CASURECO1API_TOKEN}`
              }
            }
          )
          .then(response => {
            // console.log(response)
            self.loading = false;  
            var data = response.data.master;
            var billmo = response.data.curr_billmo;
            self.$store.commit('updateAccountData',data)
            // self.$store.commit('updatecurr_billmo',billmo)
            
            // var data = response.data;
            // console.log(response.data);

            // this.$swal({
            //   title: 'Verified',
            //   text: "Account successfully verified!",
            //   icon: 'success',
            //   showCancelButton: false,
            //   confirmButtonColor: '#3085d6',
            //   cancelButtonColor: '#d33',
            //   confirmButtonText: 'OK'
            // }).then((result) => {
            //   if (result.value) {
            //     //  window.location.href = "https://casureco1api.com/tools/landbank?account=data";
            //     //  this.$router.push({name: 'account',params : {accountData : data, curr_billmo: billmo}})
            //      this.$router.push({name: 'account'})
            //   }
            // })
            
            
          })
          .catch(error => {
              self.loading = false;
              // this.$swal({
              //   icon: 'error',
              //   title: 'Account Not Found',
              //   text: 'Note: Account name must be exactly the same with the Billing Notice or Receipt.',
              // })

              console.log(error)
              
          }); 
      }
  },
};
</script>
