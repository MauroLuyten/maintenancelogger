<template>
  <v-container fluid class="pl-2 pr-2 pt-2">
    <v-layout justify-center>
      <v-flex xs12 md9 lg7 xl4 class="mt-3">
        <v-card id="vehicle_page_card">
          <v-card-media>
            <img :src="vehicle.imgurl" :alt="vehicle.model">
            <v-dialog v-model="addmaintenancedialog" width="350">
              <v-btn 
                medium 
                fab  
                slot="activator" 
                class="accent overlayed_fab" 
                v-tooltip:top="{html:'Add a Maintenance'}">
                <v-icon>add</v-icon>
              </v-btn>
              <v-card>
                <v-progress-linear indeterminate :active="addmaintenanceloading"></v-progress-linear>
                <v-card-title>
                  <h2 class="headline">Add maintenance</h2>
                </v-card-title>
                <v-card-text>
                  <v-menu :nudge-left="15" full-width max-width="290px" lazy>
                    <v-text-field 
                      slot="activator" 
                      label="Date" 
                      v-model="newMaintenance.date" 
                      append-icon="event" 
                      readonly
                      required>
                    </v-text-field>
                    <v-date-picker v-model="newMaintenance.date" scrollable></v-date-picker>
                  </v-menu>
                  <v-text-field 
                    label="Description" 
                    append-icon="description" 
                    v-model="newMaintenance.description" 
                    multi-line 
                    required>
                  </v-text-field>
                  <v-text-field 
                    label="Kilometers (km)" 
                    type="number" 
                    v-model="newMaintenance.kilometers" 
                    required>
                  </v-text-field>
                  <v-text-field 
                  label="Cost (€)" 
                  type="number" 
                  v-model="newMaintenance.cost" 
                  required>
                  </v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-layout row justify-space-between>
                    <v-btn class="blue--text darken-1" flat @click.native="closeDialogs()">Close</v-btn>
                    <v-btn class="blue--text darken-1" flat @click.native="addMaintenance()">Save</v-btn>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-media>
          <v-card-title class="grey lighten-3">
            <h3>{{vehicle.model}}</h3>
          </v-card-title>
          <v-card-text class="ma-0 pa-0">
            <v-expansion-panel class="elevation-0 " expand>
              <v-expansion-panel-content v-model="maintenancesexpanded">
                <div slot="header" class="headline">Maintenances</div>
                <v-data-table 
                  v-model="selected" 
                  :headers="maintenancetable.headers" 
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
      maintenancetable: {
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
      selected: [

      ],
      newMaintenance: {
        description: '',
        date: '',
        kilometers: '',
        cost: ''
      },
      editMaintenance: {
        description: '',
        date: '',
        kilometers: '',
        cost: ''
      },
      addmaintenancedialog: false,
      addmaintenanceloading: false,
      maintenancesexpanded: true
    }
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
    totalCost () {
      let total = 0
      this.selected.forEach(vehicle =>{
        total += parseFloat(vehicle.cost)
      })
      return total
    }
  },
  methods: {
    addMaintenance: function() {
      if (this.newMaintenance.description) {
        this.$store.dispatch('addMaintenance', {vehicleKey: this.$props.vehicleKey,maintenance: this.newMaintenance })
        this.clearForms()
        this.closeDialogs()
      }
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
    clearForms: function() {


      this.newMaintenance.description = ''
      this.newMaintenance.date = ''
      this.newMaintenance.kilometers = ''
      this.newMaintenance.cost = ''

      //this.$validator.clean()

    },
    closeDialogs: function() {

      this.addmaintenancedialog = false
      this.addmaintenanceloading = false

    },


  }

}
</script>
