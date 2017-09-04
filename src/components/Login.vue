<template>
  <v-container fluid class="pl-2 pr-2 pt-2">
    <v-layout row justify-center class="pl-2 pr-2 pt-2">
      <v-flex xs12 sm6 md4 lg3 xl2>
        <v-card>
          <v-progress-linear 
            class="blue-grey lighten-1 mb-0" 
            indeterminate 
            :active="loading">
          </v-progress-linear>
          <v-card-media class="blue-grey lighten-3">
            <v-card-title>
              <h2 class="headline black--text">{{authModeTitle}}</h2>
            </v-card-title>
          </v-card-media>
          <v-card-text>
            <v-alert 
              error 
              dismissible 
              v-if="error" 
              v-model="error">
                {{error.message}}
            </v-alert>
            <v-text-field 
              v-model="email" 
              :hint="hints.email" 
              persistent-hint 
              :rules="[rules.email]" 
              type="text" 
              name="input-email" 
              label="Email" 
              required>
            </v-text-field>
            <v-text-field 
              v-model="password" 
              :hint="hints.password" 
              persistent-hint 
              min="8" 
              counter 
              type="password" 
              name="input-password" 
              label="Password" 
              required>
            </v-text-field>
            <v-text-field 
              v-if="!isAuthModeLogin" 
              v-model="password2" 
              :hint="hints.password" 
              :rules="[rules.password2]" 
              persistent-hint 
              min="8" 
              counter 
              type="password" 
              name="input-password-repeat" 
              label="Password" 
              required>
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              :raised="isAuthModeLogin" 
              :flat="!isAuthModeLogin" 
              :class="loginClass" 
              @click.native="login">
                Login
            </v-btn>
            <v-btn 
              :raised="!isAuthModeLogin" 
              :flat="isAuthModeLogin" 
              :class="registerClass" 
              @click.native="register">
                Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      email: '',
      password: '',
      password2: '',
      authmode: 'login',
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
          return this.password === value || "Passwords don't match."
        }
      },


    }
  },
  computed: {
    isAuthModeLogin() {
      return this.authmode === 'login'
    },
    authModeTitle() {
      return this.isAuthModeLogin ? 'Login' : 'Register'
    },
    loginClass() {
      return this.isAuthModeLogin ? 'blue-grey darken-1 white--text' : 'blue-grey--text'
    },
    registerClass() {
      return !this.isAuthModeLogin ? 'blue-grey darken-1 white--text' : 'blue-grey--text'
    },
    user() {
      return this.$store.getters.getUser
    },
    error() {
      return this.$store.getters.getError
    },
    loading() {
      return this.$store.getters.getLoading
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/overview')
      }
    }
  },
  methods: {
    login: function() {
      var vm = this
      !this.isAuthModeLogin ? this.authmode = 'login' : (
        this.$store.dispatch('loginUser', { email: this.email, password: this.password })
      )
    },
    register: function() {
      var vm = this
      this.isAuthModeLogin ? this.authmode = 'register' : (
        this.$store.dispatch('registerUser', { email: this.email, password: this.password })
      )
    }
  }
}
</script>
