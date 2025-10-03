import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const getDefaultApplication = () => ({
  service_type: null,
  is_agree_term: false,
  same_address: true,
  step: 1,
  electrician_id: null,
  selectedDate: null,
  is_company: null,
  applicant_barangay: null,
  no_electrician: 0,
  classification: null,
});

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    application: {
      service_type: null,
      is_agree_term: false,
      same_address: true,
      step: 1,
      electrician_id: null,
      selectedDate: null,
      is_company: null,
      applicant_barangay: null,
      no_electrician: 0,
      classification: null,
    },
    isLoading: false,
    electricians: null,
    electricians1: null,
    psgcdata: [],
    accountData: [],
    curr_billmo: ''
  },
  mutations: {
    setApplication(state, application) {
      state.application = { ...application };
    },
    clearApplication(state) {
      state.application = [];
    },
    setServiceType(state, service_type) {
      state.application.service_type = service_type;
    },
    setAgreeTerm(state,is_agree_term){
      state.application.is_agree_term = is_agree_term
    },
    setElectrician(state, electrician) {
      state.application.electrician_id = electrician;
    },
    setSelectedDate(state, date){
      state.application.selectedDate = date
    },
    setElectricians(state,data){
      state.electricians = data
    },
    setElectricians1(state,data){
      state.electricians1 = data
    },
    setStep(state,step){
      state.step = step
    },
    resetApplication(state) {
      state.application = getDefaultApplication();
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setIsCompany(state, data){
      state.application.is_company = data
    },
    setClassification(state, data){
      state.application.classification = data
    },
    setPsgcData(state,data){
      state.psgcdata = data
    },
    updateAccountData (state,data) {
      state.accountData = data
    },
    updatecurr_billmo (state,data) {
      state.curr_billmo = data
    }
  },
});
