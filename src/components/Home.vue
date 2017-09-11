<template>
    <v-container fluid class="pl-2 pr-2 pt-2">
       <v-layout justify-center>
           <v-flex xs12 sm10 md7 lg6 xl4 class="mt-3">
                <v-card>
                    <v-card-media 
                      :src="require('@/assets/homecardmedia-min.jpg')" 
                      height="200px">
                    </v-card-media>
                    <v-card-title><div class="headline">Welcome</div></v-card-title>
                    <v-card-text>
                        Maintenance logger allows you to easily keep track of your maintenances.
                        <br>
                        We allow you to add and keep track of as many vehicles and maintenances you desire.
                        <br>
                        Register or log into an account to get started!

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                          class="accent black--text" 
                          to="/overview"> 
                            Continue
                          </v-btn>
                    </v-card-actions>
                </v-card>
           </v-flex>
       </v-layout>
    </v-container>
</template>

<script>
export default {
  data() {
      return {

      }
  }
}
</script>
