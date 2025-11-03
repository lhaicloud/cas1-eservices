<template>
  <div class="bg-white text-gray-800 rounded-lg pb-5 px-5 pt-3 overflow-auto">
    <div>
        <button class="text-gray-600 hover:text-black float-left" @click="back()">
        &lt;
        </button>
        <h1 class="mb-2 font-medium">Pre-Membership Seminar Schedule</h1>
    </div>
    <hr />
    <div class="text-center mt-3">
      <span class="text-xs text-gray-500"
        >Please select a schedule for your appointment.</span
      >
    </div>
    <div class="mt-5">
      <div class="w-full max-w-md mx-auto">
        <div class="flex justify-between items-center mb-4">
          <button @click="prevMonth" :disabled="isCurrentMonth" :class="isCurrentMonth ? 'text-gray-300' : 'text-gray-600 hover:text-black'">
            &lt;
          </button>
          <h2 class="text-lg font-semibold">{{ monthYear }}</h2>
          <button @click="nextMonth" class="text-gray-600 hover:text-black">
            &gt;
          </button>
        </div>
        <div class="grid grid-cols-7 text-center text-gray-500 text-sm mb-2">
          <div v-for="day in weekDays" :key="day">{{ day }}</div>
        </div>
        <div class="grid grid-cols-7 text-center gap-1">
          <div
            v-for="(blank, i) in firstDayOfMonth"
            :key="'blank-' + i"
            class="h-10"
          ></div>
          <div
            v-for="day in daysInMonth"
            :key="day"
          >
            <!-- Available date -->
            <div
              v-if="isAvailable(day)"
              class="h-10 flex items-center justify-center rounded-lg text-white cursor-pointer transition-all duration-150"
              @click="selectDay(day)"
              :class="isSelected(day) ? 'bg-blue-500' : 'bg-gray-400'"
            >
              {{ day }}
            </div>

            <!-- Unavailable date -->
            <div
              v-else
              class="h-10 flex items-center justify-center rounded-lg text-gray-400 opacity-50 cursor-not-allowed"
            >
              {{ day }}
            </div>
          </div>
        </div>
        <div
          class="border-t py-2 text-left text-xs"
          v-if="application.selectedDate"
        >
          <h1 class="font-medium">Selected Date:</h1>
          <div class="grid grid-cols-3">
            <div>Date</div>
            <div class="col-span-2">
              {{ formatDate(application.selectedDate.date) }}
            </div>
            <div>Time</div>
            <div class="col-span-2">
              {{ application.selectedDate.time }}
            </div>
            <div>Location</div>
            <div class="col-span-2">
              {{ application.selectedDate.location }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import axios from 'axios'

export default {
  props: ["application"],
  data() {
    return {
      currentDate: new Date(),
      // application: this.$store.state.application,
      availableDates: [],
    };
  },
  created(){
    if(this.application.selectedDate){
      this.currentDate = new Date(this.application.selectedDate.date);
    }
    this.getAvailableDates();
  },
  watch: {
    application: {
      handler: debounce(function (newVal) {
        console.log(newVal);
        this.$store.commit("setApplication", newVal);
      }, 200), // 500ms delay
      immediate: true,
      deep: true,
    },
  },
  computed: {
    monthYear() {
      return this.currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    },
    daysInMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      return new Date(year, month, 0).getDate();
    },
    firstDayOfMonth() {
      const first = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      return first.getDay(); // Sunday = 0
    },
    weekDays() {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    },
    isCurrentMonth() {
      const today = new Date();
      return (
        this.currentDate.getMonth() === today.getMonth() &&
        this.currentDate.getFullYear() === today.getFullYear()
      );
    }
  },
  methods: {
    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.currentDate.getMonth() === today.getMonth() &&
        this.currentDate.getFullYear() === today.getFullYear()
      );
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },
    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },
    isAvailable(day) {
      const current_date = new Date().getFullYear() + "-" + 
      String(new Date().getMonth() + 1).padStart(2, '0') + "-" + 
      String(new Date().getDate()).padStart(2, '0');
      
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, "0");
      const date = String(day).padStart(2, "0");
      const formatted = `${year}-${month}-${date}`;

      return this.availableDates.some((entry) => entry.date === formatted) && formatted >= current_date;
    },
    selectDay(day) {
      console.log("Selected day:", day);
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, "0"); // zero-padded
      const date = String(day).padStart(2, "0"); // zero-padded

      const formatted = `${year}-${month}-${date}`;

      const selectedDate = this.availableDates.find((dt) => {
        return dt.date == formatted;
      });
      this.application.selectedDate = selectedDate;
      // this.$store.commit("setSelectedDate", selectedDate);
      // const sDdate = this.availableDates.find((dt) => { return dt.date == formatted })

      // console.log(this.selectedDate);
    },
    isSelected(day) {
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, "0"); // zero-padded
      const date = String(day).padStart(2, "0"); // zero-padded

      const formatted = `${year}-${month}-${date}`;

      return (
        this.application.selectedDate &&
        this.application.selectedDate.date == formatted
      );
    },
    formatDate(date) {
      const dt = new Date(date);
      const year = dt.getFullYear();
      const month = dt.toLocaleString("en-US", { month: "short" }); // "Apr"
      const day = String(dt.getDate()).padStart(2, "0"); 
     
      return day + " " + month + " " + year;
    },
    back(){
      this.$emit('back');
    },
    getAvailableDates(){
      this.$store.commit("setLoading", true);
      this.availableDates = [];
      axios.get(`${import.meta.env.VITE_CIMS_API_URL}/api/consumer-services/online-application/getAvailableDates`)
        .then((response) => {
          if (response.data.length > 0) {
            this.availableDates = response.data;
          } else {
            alert("No available dates found.");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Error fetching available dates.");
        })
        .finally(() => {
          this.$store.commit("setLoading", false);
        });
    }
  },
};
</script>
