<template>
  <v-dialog v-model="dialog" v-if="dialog" lazy>
    <v-card class="elevation-1">
      <v-card-title class="title">Confirmation</v-card-title>
      <v-card-text>Are you sure you want to remove
        <b>{{vehicle.model}}</b> and its maintenances?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat class="blue--text" @click.native="dialog = false">Cancel</v-btn>
        <v-btn flat class="red--text" @click.native="confirmed">Remove</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['vehicle'],
  data () {
    return {
      
    }
  },
  computed: {
    dialog: {
      get () {
        return this.$props.vehicle !== null 
      },
      set(value) {
        this.$emit('cancelled')
      }
    }
  },
  methods: {
    confirmed() {
      this.$emit('confirmed')
    }
  }
}
</script>

