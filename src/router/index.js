import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/components/Home')
// import Home from '@/components/Home'
const Overview = () => import('@/components/Overview')
// import Overview from '@/components/Overview'
const Vehicle = () => import('@/components/Vehicle')
//import Vehicle from '@/components/Vehicle'
const Login = () => import('@/components/Login')
//import Login from '@/components/Login'
import AuthGuard from '@/router/auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  },
  routes: [{
    path: '/',
    name: 'homepage',
    component: Home
  },
  {
    path: '/overview',
    name: 'overviewpage',
    component: Overview,
    beforeEnter: AuthGuard
  },
  {
    path: '/login',
    name: 'loginpage',
    component: Login
  },
  {
    path: '/vehicle/:vehicleKey',
    name: 'vehiclepage',
    component: Vehicle,
    props: true,
    beforeEnter: AuthGuard
  }
  ]
})
