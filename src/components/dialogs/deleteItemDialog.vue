<template>
  <v-dialog v-model="dialogComputed" lazy>
    <v-card class="elevation-1">
      <v-card-title class="title">Confirmation</v-card-title>
      <v-card-text>
        <slot name="text"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat class="blue--text" @click.native="cancelled">Cancel</v-btn>
        <v-btn flat class="red--text" @click.native="confirmed">Remove</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['dialog'],
  data () {
    return {
    }
  },
  computed: {
    dialogComputed: {
      get() {
        return this.dialog
      },
      set(value) {
        if(value==false){
          this.$emit('cancelled')
        }
      }
    }
  },
  methods: {
    confirmed() {
      this.$emit('confirmed')
    },
    cancelled() {
      this.$emit('cancelled')
    }
  }
}
</script>

