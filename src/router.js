import Vue from "vue";
import VueRouter from "vue-router";

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
];

export default new VueRouter({
  mode: "history",
  routes,
});
