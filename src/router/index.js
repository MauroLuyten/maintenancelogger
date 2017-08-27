import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Overview from '@/components/Overview'
import Vehicle from '@/components/Vehicle'
import Login from '@/components/Login'
import Firebase from 'firebase'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
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
      beforeEnter: (to, from, next) => {
        if (!Firebase.auth().currentUser) {
          next({
            path: '/login'
          })
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'loginpage',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (Firebase.auth().currentUser) {
          next({
            path: '/overview'
          })
        } else {
          next()
        }
      }
    },
    {
      path: '/vehicle/:vehicleKey',
      name: 'vehiclepage',
      component: Vehicle,
      props: true,
      beforeEnter: (to, from, next) => {
        if (!Firebase.auth().currentUser) {
          next({
            path: '/login'
          })
        } else {
          next()
        }
      }
    },
  ],

})
