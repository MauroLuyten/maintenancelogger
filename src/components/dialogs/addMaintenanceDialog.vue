<template>
  <v-dialog v-model="dialog" width="350">
    <v-btn 
      medium 
      fab  
      slot="activator" 
      class="accent overlayed_fab" 
      v-tooltip:top="{html:'Add a Maintenance'}">
      <v-icon>add</v-icon>
    </v-btn>
    <v-card>
      <v-progress-linear indeterminate :active="loading"></v-progress-linear>
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
          v-model="newMaintenance.description" 
          multi-line 
          required>
        </v-text-field>
        <v-text-field 
          label="Kilometers"
          suffix="km" 
          type="number" 
          v-model="newMaintenance.kilometers" 
          required>
        </v-text-field>
        <v-text-field 
        label="Cost" 
        prefix="€"
        type="number" 
        v-model="newMaintenance.cost" 
        required>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-layout row justify-space-between>
          <v-spacer></v-spacer>
          <v-btn 
            class="primary--text accent" 
            flat 
            @click.native="cancel()">
            Cancel
          </v-btn>
          <v-btn 
            class="accent" 
            raised 
            @click.native="confirm()" 
            :disabled="!validForm">
            Save
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    data() {
      return {
        newMaintenance: {
          description: '',
          date: '',
          kilometers: '',
          cost: ''
        },
        dialog: false
      }
    },
    computed: {
      validForm() {
        return this.newMaintenance.description !== '' 
        && this.newMaintenance.date !== ''
        && this.newMaintenance.kilometers !== ''
        && this.newMaintenance.cost !== ''
      },
      loading () {
        return this.$store.getters.getLoading
      }
    },
    methods: {
      cancel() {
        this.dialog = false
        this.newMaintenance = {
          description: '',
          date: '',
          kilometers: '',
          cost: ''
        }
      },
      confirm() {
        this.dialog = false
        this.$emit('confirmed', this.newMaintenance)
      }
    }
  }
</script>