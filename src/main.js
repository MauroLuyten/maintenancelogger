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
import { firebaseConfig } from './firebaseconfig';

Vue.use(Vuetify, {
    theme: {
        primary: '#37464f',
        accent: '#fbc02d',
        secondary: '#62727b',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
    }
})
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
    created() {
        firebase.initializeApp(firebaseConfig)
        firebase.auth().onAuthStateChanged(user => {
            if (user && !this.$store.getters.getUser) {
                this.$store.dispatch('autoLogin', user)
            }
        })
    }
})
