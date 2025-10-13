<template>
  <div class="max-w-4xl mx-auto p-4 flex items-center min-h-screen justify-center">
    <div class="shadow-lg rounded-xl flex flex-col text-center w-full lg:max-w-xl gap-2" v-if="data">
      <!-- Header -->
      <div class="bg-white border-b rounded-xl px-3">
        <div class="flex flex-wrap items-center py-0.5 px-2 gap-2 border-b">
          <div class="flex justify-start items-center mt-1">
            <!-- Minimal outline user icon. Uses currentColor so you can color via text color utilities. -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="User icon" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            </svg>

          </div>
          <div class="flex-1 text-left pt-3">
            <h1 class="font-bold">{{ account_data.cflastname }}, {{ account_data.cffirstnam }} {{ account_data.cfmidname }}</h1>
            <h1 class="font-medium">{{ account_data.cfrotcode }}-{{ account_data.cfacctno }}</h1>
          </div>
        </div>

        <!-- No bill available -->
        <div v-if="curr_index < 0" class="p-5 text-justify">
            Bill for the month of
            <span class="font-bold">{{ curr_month }} {{ curr_year }}</span>
            is not yet uploaded. Will be uploaded soon. Thank you.
        </div>
        <!-- Current Bill -->
        <div v-if="loaded && curr_index >= 0" class="flex flex-wrap px-4 border-b">
            <div class="w-full text-center py-5">
            <div class="mb-3 font-medium">Current Bill</div>
            <div>
                <h4 class="font-bold text-green-600 text-xl">PHP {{ commaNumber(totalBill) }}</h4>
                <div class="font-bold text-sm">{{ data[curr_index].billmo }} {{ data[curr_index].billyear }}</div>
            </div>
            </div>

            <div class="w-full">

                <div v-if="data[curr_index].paid == 'No' && curr_index < 0" class="text-green-600 justify-center mt-3">
                    <button
                    :disabled="data[curr_index+1].paid != 'Yes'"
                    class="bg-gray-500 text-white rounded px-2 text-sm py-0.5 ml-2 disabled:opacity-50"
                    @click="payNow()">
                    Pay Now!
                    </button>
                    <h1 v-if="data[curr_index+1].paid != 'Yes'" class="text-red-600 text-sm">Sorry, Can't pay with Past Due</h1>
                </div>

                <!-- Hidden Payment Form -->
                <form action="https://casureco1api.com/tool/landbank/apipost" method="post" id="landbank_form">
                    <input type="hidden" id="account_no" name="account_no" v-model="AccountNumber" />
                    <input type="hidden" id="accountname" name="accountname" v-model="AccountName" />
                    <input type="hidden" id="billmonth" name="billmonth" v-model="BillMonth" />
                    <input type="hidden" id="amount" name="amount" v-model="Amt" />
                </form>
            </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="bg-white rounded-xl">
        <div class="text-center p-2 py-5">
            <h1 class="font-semibold text-sm">Transaction History</h1>
        </div>
        <ul class="text-sm bg-gray-100 border-b border-t">
                <li class="flex font-semibold p-2 items-center">
                    <div class="flex-1">Bill Month</div>
                    <div class="flex-1">kWh</div>
                    <div class="flex-1">Amount</div>
                    <div class="flex-1">Payment</div>
                </li>
            </ul>
        <div class="overflow-auto max-h-[32rem] text-sm">
            
            <ul v-for="(bills,i) in data" :key="i">
            <li class="flex p-2 gap-1 items-center">
                <div class="flex-1 text-center">{{ bills.billmo }} {{ bills.billyear }}</div>
                <div class="flex-1 text-end">{{ bills.nfeuse }}</div>
                <div class="flex-1 text-end">{{ commaNumber(bills.total) }}</div>
                <div class="flex-1">
                <button v-if="bills.paid == 'Yes'" class="bg-green-700 text-white px-2 py-1 rounded text-xs hover:bg-green-600 active:bg-green-800" @click="showPayment(bills)">
                    Show
                </button>
                <button v-else class="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-500 active:bg-red-700" @click="showBill(bills)">Not Paid</button>
                </div>
            </li>
            </ul>
        </div>
      </div>
      <div class="p-4">
        <button class="bg-gray-300 py-1 px-2 rounded text-xs active:bg-gray-400 hover:bg-gray-200" @click="back()">Go back</button>
      </div>
    </div>
  </div>
</template>


<script>
    import moment from 'moment';
    import axios from 'axios';
    export default {
        mounted() {
            this.curr_billmo = this.$store.state.curr_billmo;
            var y = this.curr_billmo.substring(0,4);
            var m = this.curr_billmo.substring(4);
            var bill_mo =  y + '-' + m + '-01';
            this.curr_month = moment(bill_mo).format('MMMM');
            this.curr_year = moment(bill_mo).format('YYYY');
            
            this.AccountCode = this.$store.state.accountData.cfcodeno;
            this.AccountNumber = this.$store.state.accountData.cfrotcode +this.$store.state.accountData.cfacctno;
            this.AccountName = this.$store.state.accountData.cflastname +", "+this.$store.state.accountData.cffirstnam+' '+this.$store.state.accountData.cfmidname;
            this.account_data = this.$store.state.accountData
            
            this.getBill();
            
            

            
        },
        data(){
            return {
                account_data: null,
                data: null,
                loading: false,
                curr_month: null,
                curr_year: null,
                curr_index: 0,
                curr_billmo: null,
                loaded:false,
                AccountNumber: null,
                AccountName: null,
                Amt: null,
                pastDue: false,
                BillMonth: null
            }
        },
        computed: {
          totalBill(){
            let total = 0;
            if(this.data && this.data.length > 0){
                this.data.forEach(element => {
                    if(element.paid != 'Yes'){
                      total += parseFloat(element.total);
                    }
                });
            }
            return total.toFixed(2);
          }
        },
        methods: {
          getDue(dt){
            return moment(dt).format('MMMM DD, YYYY');
          },
          getDisco(dt){
            return moment(dt).format('MMMM DD, YYYY');
          },
          commaNumber(num){
            return Number(num).toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
          },
          getBill(){
            
            var self = this;
            self.$store.commit("setLoading", true);
            axios
                .post(`${import.meta.env.VITE_CASURECO1API_URL}/mobile/getbill`,{account: self.AccountCode})
                .then(response => {
                    self.$store.commit("setLoading", false);
                    self.data = response.data;
                    
                    // console.log(self.curr_billmo);
                    self.curr_index = self.data.findIndex(i => i.cfbillmo === self.curr_billmo);
                    // console.log(self.curr_index);
                    // console.log(self.data[self.curr_index]);
                    
                    self.loaded = true
                    self.Amt = self.data[self.curr_index].total;
                    self.BillMonth = self.data[self.curr_index].cfbillmo

                    if(self.data[self.curr_index+1].paid != 'Yes'){
                      self.pastDue = true
                    }
                })
                .catch(error => {
                    self.$store.commit("setLoading", false);
                    // console.error("An Error has occurred: "+error.message)
                }); 
          },
          showPayment(bills){ 
            var self = this;
            var dop = self.getDue(bills.dfpaid)
            var reference = bills.cfreferenc
            var amt_paid = bills.total
            this.$swal({
              title: 'Payment Details',
                html:
                  "<i class'fas fa-calendar'></i>Date of Payment: "+dop+
                  "<br/> Reference No.: " +reference+
                  "<br/> Amount Paid: " +amt_paid,
              icon: 'success'
             })
          },
          showBill(bill){
            var self = this;
            var due = self.getDue(bill.dfdue)
            var disco = self.getDisco(bill.dfdisco)
            var amt = bill.total
            var kwh = bill.nfeuse
            var billmonth = bill.billmo + ' ' + bill.billyear
            this.$swal({
              title: 'Bill Details',
                html:
                  "<br/> Bill Month: " +billmonth +
                  "<br/> Amount Due: " +amt +
                  "<br/> KWh: " + kwh +
                  "<br/><i class'fas fa-calendar'></i> Due Date: "+due+
                  "<br/> Disco Date: " +disco,
              icon: 'info'
             })
          },
          payNow(){
            var self = this
            // if(self.data[self.curr_index+1].paid != 'Yes'){
            //   self.pastDue = true
            // }
            if(self.pastDue){
              self.$swal({
                icon: 'error',
                title: 'Oops...',
                text: "Sorry, You can't pay with Past Due",
                footer: 'Please pay your past due in your nearest Consumer Assistance Office (CAO)'
              })
            }else{
              self.$swal({
                title: 'Select from our payment partners',
                input: 'select',
                inputOptions: {
                  '1': 'Paymaya (Soon)',
                  '2': 'Gcash (Soon)',
                  '3': 'Landbank'
                },
                inputPlaceholder: 'Please select',
                showCancelButton: true,
                inputValidator: function (value) {
                  return new Promise(function (resolve, reject) {
                    if (value !== '') {
                      resolve();
                    } else {
                      reject('Select Payment Partner');
                    }
                  });
                }
              }).then(function (result) {
                if (result.value == 3) {
                  document.getElementById("landbank_form").submit();
                  // var bodyFormData = new FormData();
                  // bodyFormData.append('accountname', 'Fred');
                  // bodyFormData.append('account_no', '11130630');
                  // bodyFormData.append('amount', '10.00');


                  // axios({
                  //   method: "post",
                  //   url: "https://casureco1api.com/tool/landbank",
                  //   data: bodyFormData,
                  //   headers: { "Content-Type": "multipart/form-data" },
                  // })
                  // .then(function (response) {
                  //   //handle success
                  //   console.log(response);
                  // })
                  // .catch(function (response) {
                  //   //handle error
                  //   console.log(response);
                  // });
                  // accountname
                  // account_no
                  // amount
                  // window.location.href = "https://casureco1api.com/tool/landbank?account_no="+self.AccountNumber+"&prefilled=1";
                }
              });
            }

            
          },
          back(){
            this.$router.push({name: 'BillInquiry'})
          }
        }
    }
</script>