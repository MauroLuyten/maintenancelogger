<template>
  <v-container fluid class="pl-2 pr-2 pt-2">
    <v-layout justify-center>
      <v-flex xs12 md9 lg7 xl4 class="mt-3">
        <v-card id="vehicle_page_card">
          <v-card-media>
            <img :src="vehicle.imgurl" :alt="vehicle.model" style="height: 100%">
            <addMaintenanceDialog
            :loading="loading"
            @confirmed="addMaintenance"
            >

            </addMaintenanceDialog>
          </v-card-media>
          <v-card-title class="grey lighten-3">
            <h3>{{vehicle.model}}</h3>
          </v-card-title>
          <v-card-text class="ma-0 pa-0">
            <v-expansion-panel class="elevation-0 " expand>
              <v-expansion-panel-content v-model="maintenancesExpanded">
                <div slot="header" class="headline">Maintenances</div>
                <v-data-table 
                  v-model="selected" 
                  :headers="maintenanceTable.headers" 
                  :items="maintenances" 
                  class="elevation-0 white" 
                  selected-key="key" 
                  no-data-text="No maintenances added" 
                  hide-actions 
                  select-all>
                  <template slot="items" scope="props">
                    <td>
                      <v-checkbox 
                        primary 
                        hide-details 
                        v-model="props.selected">
                      </v-checkbox>
                    </td>
                    <td>{{props.item.date}}</td>
                    <td>{{props.item.description}}</td>
                    <td class="text-xs-right">{{props.item.kilometers}}</td>
                    <td class="text-xs-right">{{props.item.cost}}</td>
                  </template>
                  <template slot="footer" v-if="selected.length">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td class="text-xs-right">total: {{totalCost}}</td>
                  </template>
                </v-data-table>
                <v-layout row justify-end style="border-top:1px solid rgba(0,0,0,0.24);background-color:white" class="ma-0">
                  <v-card-actions class="pa-0">
                    <v-menu max-width="250" left>
                      <v-btn icon slot="activator" class="pa-0" :disabled="!selected.length">
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <v-card class="elevation-1">
                        <v-card-title class="title">Confirmation</v-card-title>
                        <v-card-text>Are you sure you want to remove {{selected.length}} maintenance(s)?
                        </v-card-text>
                        <v-card-actions>
                          <v-btn flat class="blue--text">Cancel</v-btn>
                          <v-btn flat class="red--text" @click.native="deleteMaintenances()">Remove</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-card-actions>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  props: ['vehicleKey'],
  data() {
    return {
      maintenanceTable: {
        headers: [
          {
            text: 'Date',
            value: 'date',
            align: 'left'
          }, {
            text: 'Description',
            value: 'description',
            align: 'left'
          }, {
            text: 'Kilometers',
            value: 'kilometers',
            align: 'right'
          }, {
            text: 'Cost',
            value: 'cost',
            align: 'right'
          },]
      },
      selected: [],
      editMaintenance: {
        description: '',
        date: '',
        kilometers: '',
        cost: ''
      },
      maintenancesExpanded: true
    }
  },
  components: {
    addMaintenanceDialog: require('@/components/dialogs/addMaintenanceDialog.vue')
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    vehicle () {
      return this.$store.getters.getVehicle(this.$props.vehicleKey)
    },
    maintenances () {
      return this.vehicle.maintenances
    },
    loading () {
      return this.$store.getters.getLoading
    },
    totalCost () {
      let total = 0
      this.selected.forEach(vehicle =>{
        total += parseFloat(vehicle.cost)
      })
      return total
    }
  },
  methods: {
    addMaintenance(newMaintenance) {
        this.$store.dispatch('addMaintenance', {vehicleKey: this.$props.vehicleKey,maintenance: newMaintenance })
    },
    deleteMaintenances: function() {
      let maintenanceKeys = []
      this.selected.forEach(vehicle => {
        maintenanceKeys.push(vehicle.key)
      })
      if(maintenanceKeys.length){
        this.$store.dispatch('removeMaintenances', {vehicleKey: this.$props.vehicleKey, maintenanceKeys})
        this.selected = []
      }
    },
  }

}
</script>
