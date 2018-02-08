<template>
  <v-container fluid class="pl-0 pr-0 pt-0">
    <v-layout justify-center>
      <v-flex xs12 md9 lg7 xl4 class="mt-1">
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
            <h2>{{vehicleTitle(vehicle)}}</h2>
          </v-card-title>
          <v-layout row class="pa-2" style="height:64px">
            <transition name="fade-transition" mode="out-in">
              <h3 
                v-if="!selected.length" 
                key="title"
                class="datatable-title">
                Maintenances
              </h3>
              <h3
                v-else
                key="select"
                class="teal--text datatable-title">
                {{selectedText}} selected
              </h3>
            </transition>
            <v-spacer></v-spacer>
            <transition name="fade-transition">
              <v-btn 
                v-if="selected.length"
                icon
                @click.native.stop="deleteItemDialog = true">
                <v-icon>delete</v-icon>
              </v-btn>
            </transition>
            <deleteItemDialog
            :dialog="deleteItemDialog"
            @confirmed="deleteMaintenances"
            @cancelled="deleteItemDialog = false">
              <p slot="text">
                Are you sure you want to remove
                <b>{{selectedText}}</b>?
              </p>
            </deleteItemDialog>
          </v-layout>
          <v-divider></v-divider>
          <v-card-text class="ma-0 pa-0">
            <v-data-table 
              v-model="selected" 
              :headers="maintenanceTable.headers" 
              :items="maintenances" 
              class="elevation-0 white" 
              item-key="key" 
              no-data-text="No maintenances added" 
              hide-actions 
              select-all>
              <template slot="items" slot-scope="props">
                <td>
                  <v-checkbox 
                    primary 
                    hide-details 
                    v-model="props.selected">
                  </v-checkbox>
                </td>
                <td>{{props.item.date}}</td>
                <td>{{props.item.description}}</td>
                <td class="text-xs-right">{{distanceText(props.item.kilometers)}}</td>
                <td class="text-xs-right">{{amountText(props.item.cost)}}</td>
              </template>
            </v-data-table>
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
      selected: [],
      editMaintenance: {
        description: '',
        date: '',
        kilometers: '',
        cost: ''
      },
      deleteItemDialog: false
    }
  },
  components: {
    addMaintenanceDialog: require('@/components/dialogs/addMaintenanceDialog.vue'),
    deleteItemDialog: require('@/components/dialogs/deleteItemDialog.vue')
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    vehicle () {
      return this.$store.getters.getVehicle(this.$props.vehicleKey)
    },
    currencyName() {
        this.$store.getters.getSelectedCurrency
    },
    maintenances () {
      return this.vehicle.maintenances
    },
    loading () {
      return this.$store.getters.getLoading
    },
    maintenanceTable() {
        return {
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
            text: `${this.$store.getters.getDistanceName}` ,
            value: 'kilometers',
            align: 'right'
          }, {
            text: `Cost (${this.$store.getters.getSelectedCurrency})`,
            value: 'cost',
            align: 'right'
          },]
        }
    },
    totalCost () {
      let total = 0
      this.selected.forEach(vehicle =>{
        total += parseFloat(vehicle.cost)
      })
      return total
    },
    selectedText() {
      return this.selected.length===1 
      ? this.selected.length + ' maintenance' 
      : this.selected.length + ' maintenances'
    },
    
  },
  methods: {
    vehicleTitle(vehicle) {
      return vehicle.make === undefined ?
      vehicle.model : 
      vehicle.make + ' ' + vehicle.model
    },
    amountText(amount) {
        return `${this.$store.getters.getSymbolFromCurrency} ${this.$store.getters.getAmountFromCurrency(amount)}`
    },
    distanceText(distance){
        return `${this.$store.getters.getDistanceConverted(distance)} ${this.$store.getters.getSelectedDistance}`
    },
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
        this.maintenanceKeys = []
        this.deleteItemDialog = false
      }
    },
  }

}
</script>
