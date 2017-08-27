<template>
 <v-container fluid class="pl-2 pr-2 pt-2">
    <v-layout row justify-center class="pl-2 pr-2 pt-2">
        <v-flex xs12 sm6 md4 lg3 xl2>
            <v-card>
                <v-progress-linear class="blue-grey lighten-1 mb-0" indeterminate :active="authloading"></v-progress-linear>
                <v-card-media class="blue-grey lighten-3">
                    <v-card-title>
                        <h2 class="headline black--text">{{authModeTitle}}</h2>
                    </v-card-title>
                </v-card-media>
                <v-card-text>
                    <v-alert error dismissible v-if="auth.hasErrors" v-model="auth.hasErrors">{{auth.message}}</v-alert>
                    <v-text-field v-model="auth.email" :hint="hints.email" persistent-hint :rules="[rules.email]" type="text" name="input-email" label="Email" required>
                    </v-text-field>
                    <v-text-field v-model="auth.password" :hint="hints.password" persistent-hint min="8" counter type="password" name="input-password" label="Password" required>
                    </v-text-field>
                    <v-text-field v-if="!isAuthModeLogin" v-model="auth.password2" :hint="hints.password" :rules="[rules.password2]" persistent-hint min="8" counter type="password" name="input-password-repeat" label="Password" required>
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :raised="isAuthModeLogin" :flat="!isAuthModeLogin" :class="loginClass" @click.native="login">Login</v-btn>
                    <v-btn :raised="!isAuthModeLogin" :flat="isAuthModeLogin" :class="registerClass" @click.native="register">Register</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
 </v-container>
</template>

<script>
import Firebase from 'firebase'
import { database } from '@/firebase-config'
export default {
    data() {
        return {
            authloading: false,
            authmode: 'login',
            auth: {
                user: null,
                email: '',
                password: '',
                password2: '',
                message: '',
                userName: '',
                hasErrors: false
            },
            hints: {
                email: 'Email address you want to use',
                password: 'Password with min. 8 characters'
            },
            rules: {
                email: (value) => {
                    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid email address.'
                },
                password2: (value) => {
                    return this.auth.password === value || "Passwords don't match."
                }
            }


        }
    },
    computed: {
        isAuthModeLogin: function () {
            return this.authmode === 'login'
        },
        authModeTitle: function () {
            return this.isAuthModeLogin ? 'Login' : 'Register'
        },
        loginClass: function () {
            return this.isAuthModeLogin ? 'blue-grey darken-1 white--text' : 'blue-grey--text'
        },
        registerClass: function () {
            return !this.isAuthModeLogin ? 'blue-grey darken-1 white--text' : 'blue-grey--text'
        },
    },
    methods: {
        login: function () {
            var vm = this
            !this.isAuthModeLogin ? this.authmode = 'login' : (
                vm.loginloading = true,
                Firebase.auth().signInWithEmailAndPassword(vm.auth.email, vm.auth.password)
                    .then(function (data) {
                        vm.auth.user = Firebase.auth().currentUser
                        vm.loginloading = false
                        vm.$router.push('/overview')
                    }).catch(function (error) {
                        vm.auth.message = error.message
                        vm.auth.hasErrors = true
                        vm.loginloading = false
                    })
            )
        },
        register: function () {
            var vm = this
            if (this.isAuthModeLogin) { 
                    this.authmode = 'register' 
                } else {
                vm.loginloading = true
                vm.auth.message = ''
                vm.auth.hasErrors = false
                if (vm.auth.email === '' || vm.auth.password === '') {
                    // alert('Please provide the email and password');
                    vm.loginloading = false
                    return
                }
                // Create a new user in firebase
                Firebase.auth().createUserWithEmailAndPassword(vm.auth.email, vm.auth.password)
                    .then(function (data) {
                        vm.auth.message = 'Successfully created user'
                        vm.auth.user = Firebase.auth().currentUser
                        database.ref('users').child(vm.auth.user.uid).set({
                            vehicles: 0,
                            email: vm.auth.email
                        })
                        vm.auth.email = ''
                        vm.auth.password = ''
                        vm.loginloading = false
                        vm.$router.push('/overview')
                    }).catch(function (error) {
                        vm.auth.message = error.message
                        vm.auth.hasErrors = true
                        vm.loginloading = false
                    })

            }
        }

    }

}
</script>
