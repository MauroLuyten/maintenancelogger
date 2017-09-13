<template>
  <v-dialog v-model="dialog" lazy>
    <v-card class="elevation-1">
      <v-card-title class="title">Confirmation</v-card-title>
      <v-card-text>
        <slot name="text"></slot>
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
    },
    model () {
      return this.dialog ? this.$props.vehicle.model : ''
    }
  },
  methods: {
    confirmed() {
      this.$emit('confirmed')
    }
  }
}
</script>

