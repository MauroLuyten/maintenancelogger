import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    vehicles: [],
    error: null,
    message: null,
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
    setMessage (state, payload) {
      state.message = payload
    },
    loadVehicles (state, payload) {
      state.vehicles = payload.vehicles
    },
    addVehicle (state, payload) {
      state.vehicles.push(payload.vehicle)
    },
    removeVehicle (state, payload) {
      state.vehicles = state.vehicles.filter(vehicle => vehicle.key !== payload.vehicleKey)
    },
    addMaintenance (state, payload) {
      state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey)
      .maintenances.push(payload.maintenance)
    },
    removeMaintenance (state, payload) {
      state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey).maintenances =
      state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey).maintenances
      .filter(maintenance => maintenance.key !== payload.maintenanceKey)
    }
  },
  actions: {
    loginUser ({commit, dispatch}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            uid: user.uid,
            email: user.email
          }
          commit('setUser', newUser)
          dispatch('loadVehicles')
          commit('setLoading', false)
          commit('setMessage', {context: 'success', text: 'Successfully logged into ' + payload.email, timeout: 4500})
        },
      ).catch(
        error => {
          commit('setError', error)
          commit('setLoading', false)
        }
      )
    },
    logoutUser ({commit}) {
      firebase.auth().signOut
      commit('setUser', null)
      commit('setMessage', {context: 'success', text: 'Successfully logged out', timeout: 4500})
    },
    registerUser ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          const newUser = {
            uid: user.uid,
            email: user.email
          }
          commit('setUser', newUser)
          commit('setLoading', false)
          commit('setMessage',
          {context: 'succes', text: 'Successfully registered and logged into ' + payload.email, timeout: 4500})
        }
      ).catch(
        error => {
          commit('setError', error)
          commit('setLoading', false)
        }
      )
    },
    autoLogin ({commit, dispatch}, payload) {
      const newUser = {
        uid: payload.uid,
        email: payload.email
      }
      commit('setUser', newUser)
      commit('setMessage', {context: 'success', text: 'Automatically logged into ' + payload.email, timeout: 4500})
      dispatch('loadVehicles')
    },
    loadVehicles ({commit, state}) {
      firebase.database().ref().child('users/' + state.user.uid + '/vehicles').once('value')
      .then(snapshot => {
        const vehicles = []
        snapshot.forEach(item => {
          let vehicle = item.val()
          vehicle.key = item.key
          let maintenances = []
          if (vehicle.maintenances !== '0') {
            Object.keys(vehicle.maintenances).forEach(key => {
              let maintenance = vehicle.maintenances[key]
              maintenance.key = key
              maintenances.push(maintenance)
            })
          }
          vehicle.maintenances = maintenances
          vehicles.push(vehicle)
        })
        commit('loadVehicles', {vehicles: vehicles})
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
        commit('addVehicle', {vehicle: vehicle})
        commit('setMessage', {context: 'success', text: 'Successfully added ' + vehicle.model, timeout: 4500})
      }).catch(error => {
        commit('setError', error)
      })
    },
    removeVehicle ({commit, state}, payload) {
      let vehicleKey = payload.vehicleKey
      firebase.database().ref('users/' + state.user.uid + '/vehicles/' + vehicleKey).remove()
      .then(data => {
        commit('removeVehicle', {vehicleKey: vehicleKey})
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
    },
    removeMaintenances ({commit, state}, payload) {
      let vehicleKey = payload.vehicleKey
      let maintenanceKeys = payload.maintenanceKeys
      maintenanceKeys.forEach(maintenanceKey => {
        firebase.database().ref('users/' + state.user.uid + '/vehicles/' + vehicleKey + '/maintenances/' + maintenanceKey)
        .remove()
        .then(data => {
          commit('removeMaintenance', {vehicleKey, maintenanceKey})
        }).catch(error => {
          commit('setError', error)
        })
      }
      )
    },
    clearError ({commit, state}) {
      commit('setError', null)
    },
    clearMessage ({commit, state}) {
      commit('setMessage', null)
    }
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getError (state) {
      return state.error
    },
    getLoading (state) {
      return state.loading
    },
    getVehicles (state) {
      return state.vehicles
    },
    getVehicle: (state) => (vehicleKey) => {
      return state.vehicles.find(vehicle => vehicle.key === vehicleKey)
    },
    getMessage (state) {
      return state.message
    }
  }
})
