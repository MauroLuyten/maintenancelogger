<style lang="stylus">

@import './stylus/main'

</style>

<template>
  <v-app fixed-toolbar fill-height>
    <v-navigation-drawer persistent v-model="sideNav">
      <v-list>
        <v-list-tile v-for="item in AuthenticatedMenuItems" :key="item.title" :to="item.link" exact>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="isAuthenticated" @click="logout">
          <v-list-tile-action>
            <v-icon>lock</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="primary" dark>
      <v-toolbar-side-icon @click.native.stop="sideNav=!sideNav"></v-toolbar-side-icon>
      <v-toolbar-title >
        <router-link to="/" tag="span" style="cursor: pointer">Maintenance Logger</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only mr-0">
        <v-btn flat v-for="item in AuthenticatedMenuItems" :key="item.title" :to="item.link" exact>
          <v-icon dark left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
      <v-menu left offset-y class="mr-0" v-if="isAuthenticated" id="accountmenu">
        <v-btn flat :icon="xsOnly" slot="activator">
          <v-icon :left="!xsOnly" dark>account_circle</v-icon>
          <div class="hidden-xs-only ma-0 pa-0">Account</div>
        </v-btn>
        <v-card style="width:276px">
          <v-card-title class="title">Your account</v-card-title>
          <v-card-text>{{user.email}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark class="red" @click.native="logout">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
    <main class="grey lighten-3 elevation-0 pb-3">
      <router-view></router-view>
      <v-snackbar
      :timeout="message.timeout"
      :success="message.context === 'success'"
      :info="message.context === 'info'"
      :warning="message.context === 'warning'"
      :error="message.context === 'error'"
      v-model="message"
    >{{message.text}}</v-snackbar>
    </main>
    <v-footer class="secondary white--text">
      <span>&copy; Maintenance Logger 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      sideNav: false,
      menuItems: [
        { icon: 'home', title: 'Home', link: '/' },
        { icon: 'web', title: 'Overview', link: '/overview' },
        { icon: 'lock', title: 'Login', link: '/login' },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser
    },
    message: {
      get () {
        return this.$store.getters.getMessage === null ? false : this.$store.getters.getMessage
      },
      set (value) {
        if(value==false){
          this.$store.dispatch('clearMessage')
        }
      }
    },
    isAuthenticated: function() {
      return this.user !== null
    },
    AuthenticatedMenuItems: function() {
      var items = this.menuItems
      if (this.isAuthenticated === true) {
        items = items.filter(function(obj) {
          return obj.title !== 'Login'
        })
      }
      return items
    },
    xsOnly: function() {
      return window.matchMedia("(max-width:600px)").matches
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logoutUser')
      this.$router.push('/login')
    },
    clearAuthErrors: function() {
      var vm = this
      vm.auth.message = ''
      vm.auth.hasErrors = false
    },
  }
}
</script>
