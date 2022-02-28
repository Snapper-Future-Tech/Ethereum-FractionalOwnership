import Vue from "vue";
import VueRouter from "vue-router";

// Logged in components
import LoggedIn from "../views/LoggedIn"
import Dashboard from "../components/Dashboard"
import AddProperty from "../components/AddProperty"
import MyProperties from "../components/MyProperties"
import MyInvestments from "../components/MyInvestments"

// Not logged in components
import NotLoggedIn from "../views/NotLoggedIn"
import Home from "../components/Home";
import Login from "../components/Login"
import Register from "../components/Register"

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: '/home',
    component: NotLoggedIn,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
      },
      {
        path: '/login',
        name: 'Login',
        component: Login,
      },
      {
        path: '/register',
        name: 'Register',
        component: Register,
      }
    ]
  },
  {
    path: '/u',
    name: 'LoggedIn',
    redirect: '/u/dashboard',
    component: LoggedIn,
    children: [
      {
        path: '/u/dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: '/u/add-property',
        name: 'AddProperty',
        component: AddProperty,
      },
      {
        path: '/u/my-properties',
        name: 'MyProperties',
        component: MyProperties,
      },
      {
        path: '/u/open-properties',
        name: 'OpenProperties',
        component: MyProperties,
      },
      {
        path: '/u/my-investments',
        name: 'MyInvestments',
        component: MyInvestments,
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if(store.getters['getUser'].email === undefined) {
    if(/\/u\//.test(to.path)) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
