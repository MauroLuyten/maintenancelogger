import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import VueFire from 'vuefire'
//import Axios from 'axios'
import router from './router'
//import { store } from './store/store'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'

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
  //store: store,
  render: h => h(App)
})
