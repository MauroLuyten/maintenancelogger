<template>
  <v-container fluid class="pl-0 pr-0 pt-0">
    <v-layout justify-center>
      <v-flex xs12 lg10 xl8>
        <v-layout row>
          <h1 class="display-1 ma-1">Your Vehicles</h1>
        </v-layout>
        <v-layout v-if="vehicles.length" row justify-start wrap>
          <template v-for="(vehicle) in vehicles">
            <v-flex lg4 xs12 sm6 md4  :key="vehicle.key">
              <v-card class="white ma-1" @click.native="selectVehicle(vehicle.key)" hover>
                <v-card-media height="250" :src="vehicle.imgurl" cover>
                </v-card-media>
                <v-card-title class="grey lighten-3">
                  <h2 class="title">
                    {{vehicleTitle(vehicle)}}
                  </h2>
                </v-card-title>
                <v-card-actions class="grey lighten-2 pa-0">
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                      <v-btn 
                        icon
                        slot="activator"
                        @click.stop="selectVehicle(vehicle.key)"
                        class="hidden-md-and-up">
                        <v-icon>build</v-icon>
                      </v-btn>
                      <span>Show Maintenances</span>
                  </v-tooltip>
                  <v-tooltip top>
                      <v-btn 
                        icon 
                        slot="activator"
                        @click.stop="selectedVehicle = vehicle">
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <span>Remove Vehicle</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
        <v-layout v-if="!vehicles.length">
          <v-flex>
            <p class="headline ma-1">You currently don't have any vehicles added.</p>
          </v-flex>
        </v-layout>
        <addVehicleDialog 
          @confirmed="addVehicle">
        </addVehicleDialog>
        <deleteVehicleDialog 
          :vehicle="selectedVehicle"
          @cancelled="selectedVehicle = null" 
          @confirmed="deleteVehicle(selectedVehicle.key)">
          <p slot="text">
            Are you sure you want to remove
            <b>{{selectedModel}}</b> and its maintenances?
          </p>
        </deleteVehicleDialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedVehicle: null,
    }
  },
  components: {
    addVehicleDialog: require('@/components/dialogs/addVehicleDialog.vue'),
    deleteVehicleDialog: require('@/components/dialogs/deleteVehicleDialog.vue')
  },
  computed: {
    vehicles() {
      return this.$store.getters.getVehicles
    },
    user() {
      return this.$store.getters.getUser
    },
    selectedModel() {
      return this.selectedVehicle===null? '' : `${this.selectedVehicle.make} ${this.selectedVehicle.model}`
    }
  },
  methods: {
    selectVehicle(key) {
      this.$router.push({
        path: 'vehicle/' + key,
      })
    },
    addVehicle(newVehicle) {
      if (newVehicle.model) {
        this.$store.dispatch('addVehicle', newVehicle)
      }
    },
    deleteVehicle(vehicleKey) {
      this.$store.dispatch('removeVehicle', {vehicleKey: vehicleKey})
      this.selectedVehicle = null
    },
    vehicleTitle(vehicle) {
      return vehicle.make === undefined ?
      vehicle.model : 
      vehicle.make + ' ' + vehicle.model
    }
  }
}
</script>