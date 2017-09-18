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
          <v-layout row class="pa-2" style="height:64px">
            <transition name="fade-transition" mode="out-in">
              <h5 
                v-if="!selected.length" 
                key="title"
                class="datatable-title">
                Maintenances
              </h5>
              <h6
                v-else
                key="select"
                class="teal--text datatable-title">
                {{selectedText}} selected
              </h6>
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
    },
    selectedText() {
      return this.selected.length===1 
      ? this.selected.length + ' maintenance' 
      : this.selected.length + ' maintenances'
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
        this.maintenanceKeys = []
        this.deleteItemDialog = false
      }
    },
  }

}
</script>
