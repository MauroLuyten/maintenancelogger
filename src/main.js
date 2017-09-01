import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import VueFire from 'vuefire'
//import Axios from 'axios'
import router from './router'
import { store } from './store/store'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'
import * as firebase from 'firebase'

Vue.use(Vuetify)
Vue.use(VueFire)
Vue.use(VueScrollTo)
Vue.use(VueAnalytics, {
  id: 'UA-103840909-1',
  router
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  render: h => h(App),
  created () {
    const config = {
      apiKey: "AIzaSyDe-jSD6qqbpK_CZ1uAH3DWcPt8JDWuoGs",
      authDomain: "maintenancelogger.firebaseapp.com",
      databaseURL: "https://maintenancelogger.firebaseio.com",
      projectId: "maintenancelogger",
      storageBucket: "maintenancelogger.appspot.com",
      messagingSenderId: "73510925424"
    }
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLogin', user)
      }
    })
  }
})
