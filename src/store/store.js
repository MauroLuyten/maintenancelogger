import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    vehicles: [],
    error: null,
    loading: false
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    loadVehicles (state, payload) {
      state.vehicles = payload
    },
    addVehicle (state, payload) {
      state.vehicles.push(payload)
    },
    removeVehicle (state, payload) {
      state.vehicles = state.vehicles.filter(vehicle => vehicle.key !== payload)
    },
    addMaintenance (state, payload) {
      state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey).maintenances.push(payload.maintenance)
    }
  },
  actions: {
    loginUser ({commit, dispatch}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            uid: user.uid,
            email: user.email
          }
          commit('setUser', newUser)
          dispatch('loadVehicles')
        },
      ).catch(
        error => {
          commit('setError', error)
        }
      )
    },
    logoutUser ({commit}) {
      firebase.auth().signOut
      commit('setUser', null)
    },
    registerUser ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            uid: user.uid,
            email: user.email
          }
          commit('setUser', newUser)
        }
      ).catch(
        error => {
          commit('setError', error)
        }
      )
    },
    autoLogin ({commit, dispatch}, payload) {
      const newUser = {
        uid: payload.uid,
        email: payload.email
      }
      commit('setUser', newUser)
      dispatch('loadVehicles')
    },
    loadVehicles ({commit, state}) {
      firebase.database().ref().child('users/' + state.user.uid + '/vehicles').once('value')
      .then(snapshot => {
        const vehicles = []
        snapshot.forEach(item => {
          let vehicle = item.val()
          vehicle.key = item.key
          if (vehicle.maintenances !== '0') {
            let maintenances = []
            Object.keys(vehicle.maintenances).forEach(key => {
              let maintenance = vehicle.maintenances[key]
              maintenance.key = key
              maintenances.push(maintenance)
            })
            vehicle.maintenances = maintenances
          }
          vehicles.push(vehicle)
        })
        commit('loadVehicles', vehicles)
      }

      ).catch(
        error => {
          commit('setError', error)
        }
      )
    },
    addVehicle ({commit, state}, payload) {
      const vehicle = {
        maintenances: payload.maintenances,
        model: payload.model,
        imgurl: payload.imgurl
      }
      firebase.database().ref('users/' + state.user.uid + '/vehicles').push(vehicle)
      .then(data => {
        vehicle.key = data.key
        commit('addVehicle', vehicle)
      }).catch(error => {
        commit('setError', error)
      })
    },
    removeVehicle ({commit, state}, payload) {
      let vehicleKey = payload.vehicleKey
      firebase.database().ref('users/' + state.user.uid + '/vehicles/' + vehicleKey).remove()
      .then(data => {
        commit('removeVehicle', vehicleKey)
      }).catch(error => {
        commit('setError', error)
      })
    },
    addMaintenance ({commit, state}, payload) {
      let vehicleKey = payload.vehicleKey
      const maintenance = {
        description: payload.maintenance.description,
        date: payload.maintenance.date,
        kilometers: payload.maintenance.kilometers,
        cost: payload.maintenance.cost
      }
      firebase.database().ref('users/' + state.user.uid + '/vehicles/' + vehicleKey + '/maintenances').push(maintenance)
      .then(data => {
        maintenance.key = data.key
        commit('addMaintenance', {vehicleKey, maintenance})
      }).catch(error => {
        commit('setError', error)
      })
    }
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getError (state) {
      return state.error
    },
    getVehicles (state) {
      return state.vehicles
    },
    getVehicle: (state) => (vehicleKey) => {
      return state.vehicles.find(vehicle => vehicle.key === vehicleKey)
    }
  }
})
