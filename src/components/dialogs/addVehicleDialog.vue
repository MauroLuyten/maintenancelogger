<template>
  <v-dialog v-model="dialog" width="900" class="ma-0 pa-0">
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
    <v-stepper 
      v-model="currentStep" 
      vertical 
      class="elevation-1 white">
      <v-stepper-step step="1" :complete="currentStep>1">
        Add a vehicle
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-progress-linear 
          indeterminate 
          :active="loading"
          color-front="accent"
          color-back="primary"
          class="mb-0">
        </v-progress-linear>
        <v-card class="elevation-0 ma-0">
          <v-card-title>
            <h2 class="headline">Add vehicle</h2>
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="newVehicle.make"
              :items="vehicleMakes"
              label="Make"
              placeholder="eg. Honda" 
              autocomplete
              required 
              >
            </v-select>
            <v-select
              v-model="newVehicle.model"
              :items="makeModels"
              label="Model"
              placeholder="eg. Civic" 
              autocomplete
              required 
              >
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              class="primary--text accent" 
              flat 
              @click.native="dialog=false">
              Close
            </v-btn>
            <v-btn 
              class="accent" 
              raised 
              @click.native="showSuggestedImages()"
              :disabled="newVehicle.model===''">
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
            <v-carousel dark cycle ref="suggestedCarousel" v-if="!loading">
              <v-carousel-item 
                v-for="(item,index) 
                in suggestedImages" 
                :src="item.link" 
                :key="item.link" 
                class="primary--text accent--after"
                v-badge="isSelectedImage(item.link)" 
                @click.native="selectImage(item.link, index)" 
                style="cursor:pointer;">
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              class="primary--text accent" 
              flat 
              @click.native="closeDialog">
              Cancel</v-btn>
            <v-btn 
              class="accent" 
              raised 
              @click.native="addVehicle" 
              :disabled="!validMakeAndModel">
              Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper>
  </v-dialog>
</template>
<script>
import Axios from 'axios'
import * as vehicleCatalog from '../../../vehicles.json'
  export default {
    data() {
      return {
        newVehicle: {
          make: '',
          model: '',
          maintenances: '0',
          imgurl: ''
        },
        suggestedImages: [],
        dialog: false,
        loading: false,
        currentStep: 1,
        vehicleCatalog: vehicleCatalog
      }
    },
    computed: {
      vehicleMakes() {
        return Object.keys(this.vehicleCatalog.makes)
      },
      makeModels() {
        return this.newVehicle.make !== '' ?
        Object.keys(this.vehicleCatalog.makes[this.newVehicle.make]).sort()
        : []
      },
      validMakeAndModel() {
        return this.newVehicle.make !== ''
        && this.newVehicle.model !== ''
      }
    },
    methods: {
      addVehicle() {
        this.$emit('confirmed', this.newVehicle)
        this.closeDialog()
      },
      showSuggestedImages() {
        if (this.newVehicle.model) {
          this.loading = true
          Axios.get('https://www.googleapis.com/customsearch/v1?q=' + this.newVehicle.make + this.newVehicle.model +
            '&imgDominantColor=white&cx=000944192720465307300:qbm11spsnzw&searchType=image&key=AIzaSyBv9rRn3Zbjn0wYbdM6M6PXgrvnfHwvrm0&num=3&fields=items/link')
            .then(response => {
              this.suggestedImages = response.data.items
              this.loading = false
              this.currentStep = 2
            })
        }
      },
      selectImage(key, index) {
        this.newVehicle.imgurl = key
        var carouselcontrols = this.$refs.suggestedCarousel.$el.childNodes[2].childNodes
        //sets carousel control of selected image to a checkmark and makes sure other controls are back to default
        for (var i = 0; i < carouselcontrols.length; i++) {
          i == index 
          ? carouselcontrols[i].childNodes[0].childNodes[0].textContent = 'check' 
          : carouselcontrols[i].childNodes[0].childNodes[0].textContent = 'fiber_manual_record'
        }
      },
      resetCarouselControls() {
        var carouselcontrols = this.$refs.suggestedCarousel.$el.childNodes[2].childNodes
        //sets carousel controls back to default
        for (var i = 0; i < carouselcontrols.length; i++) {
          carouselcontrols[i].childNodes[0].childNodes[0].textContent = 'fiber_manual_record'
        }
      },
      isSelectedImage(key) {
        //returns badge object based on if the image is selected or not
        return this.newVehicle.imgurl == key ? {
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
      closeDialog() {
        this.newVehicle = {
          make: '',
          model: '',
          maintenances: '0',
          imgurl: ''
        }
        this.suggestedImages = []
        this.dialog = false
        this.loading = false
        this.currentStep = 1
      }
    }
  }
</script>
