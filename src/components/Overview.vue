<template>
  <v-container fluid class="pl-2 pr-2 pt-2">
    <v-layout justify-center>
      <v-flex xs12 lg10 xl8>
        <v-layout row>
          <h1 class="display-1 ma-1">Your Vehicles</h1>
          <v-spacer class="hidden-sm-and-up"></v-spacer>
          <v-dialog v-model="addvehicledialog" width="900" class="ma-0 pa-0">
            <v-btn 
              fab 
              medium  
              fixed 
              bottom 
              right 
              class="accent fixed_fab" 
              slot="activator" 
              v-tooltip:top="{html:'Add a Vehicle'}" >
              <v-icon>add</v-icon>
            </v-btn>
            <v-stepper v-model="addvehiclecurrentstep" vertical class="elevation-1 white">
              <v-stepper-step step="1" :complete="addvehiclecurrentstep>1">
                Add a vehicle
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-progress-linear indeterminate :active="addvehicleloading"></v-progress-linear>
                <v-card class="elevation-0 ma-0">
                  <v-card-title>
                    <h2 class="headline">Add vehicle</h2>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field 
                      @keyup.enter="showSuggestedImages()" 
                      label="Vehicle Model" 
                      required 
                      v-model="newVehicle.model">
                    </v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn class="blue--text darken-1" flat 
                      @click.native="closeDialogs()">
                      Close
                    </v-btn>
                    <v-btn class="white--text blue darken-1" raised 
                      @click.native="showSuggestedImages()">
                      Continue
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-stepper-content>
              <v-stepper-step step="2">
                Select your image
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-card class="elevation-0 ma-1">
                  <v-card-title>
                    <h2 class="headline">Suggested Images</h2>
                  </v-card-title>
                  <v-card-text>
                    <p>Please
                      <b>click</b> on the image you would like to be used:</p>
                    <v-carousel dark cycle ref="suggestedcarousel" v-if="!addvehicleloading">
                      <v-carousel-item 
                        v-for="(item,index) 
                        in suggestedimages" 
                        :src="item.link" 
                        :key="item.link" 
                        v-badge="isSelectedImage(item.link)" 
                        @click.native="selectImage(item.link, index)" 
                        style="cursor:pointer;">
                      </v-carousel-item>
                    </v-carousel>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn class="blue--text darken-1" flat @click.native="closeDialogs()">Cancel</v-btn>
                    <v-btn class="white--text blue darken-1" raised @click.native="addVehicle()" >Confirm</v-btn>
                  </v-card-actions>
                </v-card>
              </v-stepper-content>
            </v-stepper>
          </v-dialog>
        </v-layout>
        <v-layout v-if="vehicles.length" row justify-start wrap>
          <template v-for="(vehicle,key) in vehicles">
            <v-flex lg4 xs12 sm6 md4  :key="vehicle.key">
              <v-card class="white elevation-1 ma-1">
                <v-card-media height="250" :src="vehicle.imgurl" cover>
                </v-card-media>
                <v-card-title class="grey lighten-3">
                  <h2 class="title">{{vehicle.model}}</h2>
                </v-card-title>
                <v-card-actions class="accent pa-0">
                  <v-spacer></v-spacer>
                  <v-btn 
                    raised 
                    small
                    icon
                    class="accent elevation-0" 
                    v-tooltip:top="{html:'Show Maintenances'}" 
                    @click.native="selectVehicle(vehicle.key)">
                    <v-icon>build</v-icon>
                    
                  </v-btn>
                  <v-dialog>
                    <v-btn 
                      icon 
                      slot="activator" 
                      v-tooltip:top="{html:'Remove Vehicle'}">
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <v-card class="elevation-1">
                      <v-card-title class="title">Confirmation</v-card-title>
                      <v-card-text>Are you sure you want to remove <b>{{vehicle.model}}</b> and its maintenances?
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat class="blue--text">Cancel</v-btn>
                        <v-btn flat class="red--text" @click.native="deleteVehicle(vehicle.key)">Remove</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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
      </v-flex>
    </v-layout>
    </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Axios from 'axios'

export default {
  data() {
    return {
      newVehicle: {
        model: '',
        maintenances: '0',
        imgurl: ''
      },
      suggestedimages: [

      ],
      selectedimage: '',
      addvehiclecurrentstep: 1,
      addvehicledialog: false,
      deleteVehicleDialog: false,
      imageselectiondialog: false,
      addvehicleloading: false,
      loginloading: false,

    }
  },
  computed: {
    vehicles() {
      return this.$store.getters.getVehicles
    },
    user() {
      return this.$store.getters.getUser
    }
  },
  methods: {
    selectVehicle: function(key) {
      this.$router.push({
        path: 'vehicle/' + key,

      })
    },
    showSuggestedImages: function() {
      if (this.newVehicle.model) {
        this.addvehicleloading = true
        Axios.get('https://www.googleapis.com/customsearch/v1?q=' + this.newVehicle.model +
          '&imgDominantColor=white&cx=000944192720465307300:qbm11spsnzw&searchType=image&key=AIzaSyBv9rRn3Zbjn0wYbdM6M6PXgrvnfHwvrm0&num=3&fields=items/link')
          .then(response => {
            this.suggestedimages = response.data.items
            this.addvehicleloading = false
            this.addvehiclecurrentstep = 2
          })
      }
    },
    selectImage: function(key, index) {
      this.selectedimage = key
      var carouselcontrols = this.$refs.suggestedcarousel.$el.childNodes[2].childNodes
      //sets carousel control of selected image to a checkmark and makes sure other controls are back to default
      for (var i = 0; i < carouselcontrols.length; i++) {
        i == index ? carouselcontrols[i].childNodes[0].childNodes[0].textContent = 'check' : carouselcontrols[i].childNodes[0].childNodes[0].textContent = 'fiber_manual_record'

      }



    },
    resetCarouselControls: function() {
      var carouselcontrols = this.$refs.suggestedcarousel.$el.childNodes[2].childNodes
      //sets carousel controls back to default
      for (var i = 0; i < carouselcontrols.length; i++) {
        carouselcontrols[i].childNodes[0].childNodes[0].textContent = 'fiber_manual_record'

      }
    },
    isSelectedImage: function(key) {
      return this.selectedimage == key ? {
        value: 'check',
        icon: true,
        left: true,
        overlap: true,
        visible: true
      } : {
          value: 'check',
          icon: true,
          left: true,
          overlap: true,
          visible: false
        }
    },
    addVehicle: function() {

      if (this.newVehicle.model) {
        this.addvehicleloading = true
        this.newVehicle.imgurl = this.selectedimage
        this.$store.dispatch('addVehicle', this.newVehicle)
        this.clearForms()
        this.addvehicleloading = false
        this.closeDialogs()

      }

    },
    deleteVehicle: function(vehicleKey) {
      this.$store.dispatch('removeVehicle', {vehicleKey: vehicleKey})

    },

    clearForms: function() {

      this.newVehicle.model = ''
      this.newVehicle.maintenances = 0
      this.resetCarouselControls()

    },
    closeDialogs: function() {
      this.loginloading = false
      this.addvehicledialog = false
      this.addvehicleloading = false
      this.imageselectiondialog = false
      this.addvehiclecurrentstep = 1
      this.selectedimage=''
    },
    resetSelectedVehicle: function() {
      this.selectedVehicle.model = ''
      this.selectedVehicle.maintenances = 0
    }
  }
}
</script>