import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import router from '@/router/index.js'
import Axios from 'axios'
import getSymbolFromCurrency from 'currency-symbol-map'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        selectedCurrency: 'EUR', 
        selectedDistance: 'km',
        distances: {
            'km':{
                name: 'Kilometers',
                rate: 1.00
            },
            'mi': {
                name: 'Miles',
                rate: 0.621371
            }
        },
        currencies: {null:null}, 
        vehicles: [],
        error: null,
        message: null,
        loading: false
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setMessage(state, payload) {
            state.message = payload
        },
        clearVehicles(state) {
            state.vehicles = []
        },
        loadVehicles(state, payload) {
            state.vehicles = payload.vehicles
        },
        addVehicle(state, payload) {
            state.vehicles.push(payload.vehicle)
        },
        removeVehicle(state, payload) {
            state.vehicles = state.vehicles.filter(vehicle => vehicle.key !== payload.vehicleKey)
        },
        addMaintenance(state, payload) {
            state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey)
                .maintenances.push(payload.maintenance)
        },
        removeMaintenance(state, payload) {
            state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey).maintenances =
                state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey).maintenances
                    .filter(maintenance => maintenance.key !== payload.maintenanceKey)
        },
        removeAllMaintenances(state, payload) {
            state.vehicles.find(vehicle => vehicle.key === payload.vehicleKey)
                .maintenances = []
        },
        setSelectedCurrency(state, payload) {
            state.selectedCurrency = payload.selectedCurrency
        },
        setCurrencies(state, payload) {
            state.currencies = payload.currencies
        },
        setSelectedDistance(state, payload) {
            state.selectedDistance = payload.selectedDistance
        }
    },
    actions: {
        init({dispatch}){
            dispatch('loadVehicles')
            dispatch('loadCurrencies')
            dispatch('loadSelectedCurrency')
            dispatch('loadSelectedDistance')
        },
        loginUser({ commit, dispatch }, payload) {
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(
                user => {
                    const newUser = {
                        uid: user.uid,
                        email: user.email
                    }
                    commit('setUser', newUser)
                    dispatch('init')
                    commit('setLoading', false)
                    commit('setMessage', { context: 'success', text: `Successfully logged into ${payload.email}`, timeout: 4500 })
                },
            ).catch(
                error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                }
                )
        },
        logoutUser({ commit }) {
            firebase.auth().signOut
            commit('setUser', null)
            commit('clearVehicles')
            commit('setMessage', { context: 'success', text: 'Successfully logged out', timeout: 4500 })
        },
        registerUser({ commit, dispatch }, payload) {
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
                    dispatch('init')
                    commit('setMessage',
                        { context: 'succes', text: `Successfully registered and logged into ${payload.email}`, timeout: 4500 })
                }
                ).catch(
                error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                }
                )
        },
        autoLogin({ commit, dispatch }, payload) {
            const newUser = {
                uid: payload.uid,
                email: payload.email
            }
            commit('setUser', newUser)
            commit('setMessage', { context: 'success', text: `Automatically logged into ${payload.email}`, timeout: 4500 })
            dispatch('init')
            router.push('/overview')
        },
        loadVehicles({ commit, state }) {
            firebase.database().ref().child(`users/${state.user.uid}/vehicles/`).once('value')
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
                    commit('loadVehicles', { vehicles: vehicles })
                }

                ).catch(
                error => {
                    commit('setError', error.message)
                })
        },
        loadCurrencies({ commit, state, dispatch}) {
            Axios.get('https://api.fixer.io/latest')
            .then(response => {
                let currencies = {}
                Object.keys(response.data.rates).forEach(key=>{
                    let currency = {
                        name: key,
                        rate: response.data.rates[key]
                    }
                currencies[key] = currency
                })
                currencies['EUR'] = {name:'EUR', rate:1.00}
                commit('setCurrencies', {currencies: currencies})
            })
            .catch(
                error => {
                    commit('setError', error.message)
                })
        },
        loadSelectedCurrency({commit, state}){
            firebase
            .database()
            .ref(`users/${state.user.uid}/preferences/selectedCurrency`)
            .once('value')
            .then(snapshot => {
                commit('setSelectedCurrency', {selectedCurrency: snapshot.val()})
            })
            .catch(error => {
                commit('setError', error.message)
            })
        },
        setSelectedCurrency({commit, state}, payload) {
            firebase.database().ref(`users/${state.user.uid}/preferences/selectedCurrency`)
            .set(payload.selectedCurrency)
            .then(data => {
                commit('setSelectedCurrency', payload)
            })
            .catch(error => {
                commit('setError', error.message)
            })
        },
        loadSelectedDistance({commit, state}){
            firebase
            .database()
            .ref(`users/${state.user.uid}/preferences/selectedDistance`)
            .once('value')
            .then(snapshot => {
                commit('setSelectedDistance', {selectedDistance: snapshot.val()})
            })
            .catch(error => {
                commit('setError', error.message)
            })
        },
        setSelectedDistance({commit, state}, payload) {
            firebase.database().ref(`users/${state.user.uid}/preferences/selectedDistance`)
            .set(payload.selectedDistance)
            .then(data => {
                commit('setSelectedDistance', payload)
            })
            .catch(error => {
                commit('setError', error.message)
            })
        },
        addVehicle({ commit, state }, payload) {
            const vehicle = {
                maintenances: payload.maintenances,
                make: payload.make,
                model: payload.model,
                imgurl: payload.imgurl
            }
            firebase.database().ref(`users/${state.user.uid}/vehicles/`).push(vehicle)
                .then(data => {
                    vehicle.key = data.key
                    vehicle.maintenances = []
                    commit('addVehicle', { vehicle: vehicle })
                    commit('setMessage', { context: 'success', text: `Successfully added ${vehicle.make} ${vehicle.model}`, timeout: 4500 })
                }).catch(error => {
                    commit('setError', error)
                })
        },
        removeVehicle({ commit, state }, payload) {
            let vehicleKey = payload.vehicleKey
            firebase.database().ref(`users/${state.user.uid}/vehicles/${vehicleKey}`).remove()
                .then(data => {
                    commit('removeVehicle', { vehicleKey: vehicleKey })
                    commit('setMessage', { context: 'success', text: 'Successfully removed vehicle', timeout: 4500 })
                }).catch(error => {
                    commit('setError', error)
                })
        },
        addMaintenance({ commit, state, getters }, payload) {
            let vehicleKey = payload.vehicleKey
            let maintenance = {
                description: payload.maintenance.description,
                date: payload.maintenance.date,
                kilometers: payload.maintenance.kilometers,
                cost: payload.maintenance.cost
            }
            maintenance.cost = maintenance.cost/getters.getRateFromCurrency
            maintenance.kilometers = maintenance.kilometers/getters.getRateFromDistance
            firebase.database().ref(`users/${state.user.uid}/vehicles/${vehicleKey}/maintenances`).push(maintenance)
                .then(data => {
                    maintenance.key = data.key
                    commit('addMaintenance', { vehicleKey, maintenance })
                    commit('setMessage', { context: 'success', text: 'Successfully added maintenance', timeout: 4500 })
                }).catch(error => {
                    commit('setError', error)
                })
        },
        removeMaintenances({ commit, state, getters, dispatch }, payload) {
            let vehicleKey = payload.vehicleKey
            let maintenanceKeys = payload.maintenanceKeys
            if (maintenanceKeys.length === getters.getVehicle(vehicleKey).maintenances.length) {
                dispatch('removeAllMaintenances', { vehicleKey: vehicleKey })
            } else {
                maintenanceKeys.forEach(maintenanceKey => {
                    firebase.database().ref(`users/${state.user.uid}/vehicles/${vehicleKey}/maintenances/${maintenanceKey}`)
                        .remove()
                        .then(data => {
                            commit('removeMaintenance', { vehicleKey, maintenanceKey })
                            commit('setMessage', { context: 'success', text: 'Successfully removed maintenance', timeout: 4500 })
                        }).catch(error => {
                            commit('setError', error)
                        })
                }
                )
            }
        },
        removeAllMaintenances({ commit, state }, payload) {
            const vehicleKey = payload.vehicleKey
            let vehicleRef = firebase.database().ref(`users/${state.user.uid}/vehicles/${vehicleKey}`)
            vehicleRef.update({ maintenances: 0 })
                .then(data => {
                    commit('removeAllMaintenances', { vehicleKey: vehicleKey })
                    commit('setMessage', { context: 'success', text: 'Successfully removed maintenance', timeout: 4500 })
                }).catch(error => {
                    commit('setError', error)
                })
        },
        clearError({ commit, state }) {
            commit('setError', null)
        },
        clearMessage({ commit, state }) {
            commit('setMessage', null)
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getError(state) {
            return state.error
        },
        getLoading(state) {
            return state.loading
        },
        getVehicles(state) {
            return state.vehicles
        },
        getVehicle: (state) => (vehicleKey) => {
            return state.vehicles.find(vehicle => vehicle.key === vehicleKey)
        },
        getMessage(state) {
            return state.message
        },
        getSelectedCurrency(state){
            return state.selectedCurrency
        },
        getCurrencies(state){
            return state.currencies
        },
        getCurrencyNames(state){
            return Object.keys(state.currencies).sort()
        },
        getRateFromCurrency: (state) => {
            return state.currencies[state.selectedCurrency].rate
        },
        getSymbolFromCurrency: (state)  => {
            return getSymbolFromCurrency(state.selectedCurrency)
        },
        getAmountFromCurrency: (state, getters) => (amount) => {
            return (amount*getters.getRateFromCurrency).toFixed(2)
        },
        getSelectedDistance(state) {
            return state.selectedDistance
        },
        getDistanceConverted: (state) => (distance) => {
            return (distance * state.distances[state.selectedDistance].rate).toFixed(2)
        },
        getDistanceNames(state) {
            return Object.keys(state.distances).sort()
        },
        getDistanceName (state) {
            return state.distances[state.selectedDistance].name
        },
        getRateFromDistance (state) {
            return state.distances[state.selectedDistance].rate
        }
    },

})
