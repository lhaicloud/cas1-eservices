import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store"; // Adjust this path if needed

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./components/Home.vue"),
  },
  {
    path: "/report-brownout",
    name: "ReportBrownout",
    component: () => import("./components/ReportBrownout.vue")
  },
  {
    path: "/report-brownout/tickets",
    name: "TicketDetails",
    component: () => import("./components/Tickets.vue"),
    props: true,
  },
  {
    path: "/bill-inquiry",
    name: "BillInquiry",
    component: () => import("./components/BillInquiry.vue")
  },
  { path: '/bill-inquiry/account', name: 'account', component: () => import("./components/Account.vue") },
  {
    path: "/new-connection-application",
    name: "NewConnectionApplication",
    component: () => import("./components/NewConnectionApplication.vue")
  },
  {
    path: "/electrical-service-application",
    name: "ElectricalServiceApplication",
    component: () => import("./components/ElectricalServiceApplication.vue")
  },
  {
    path: "/electrical-service-application/requirements",
    name: "NewConnectionApplicationRequirements",
    component: () => import("./components/NewConnectionApplicationRequirements.vue")
  },
  {
    path: "/existing-application",
    name: "ViewExistingApplication",
    component: () => import("./components/ViewExistingApplication.vue")
  },
  {
    path: "/electrical-service-application/existing-application/details",
    name: "ViewExistingApplicationDetails",
    component: () => import("./components/ViewExistingApplicationDetails.vue")
  },
  {
    path: "/capture",
    name: "CaptureImage",
    component: () => import("./components/CaptureImage.vue")
  },
  
  
];

const router = new VueRouter({
  mode: "history",
  routes,
});


export default router;
