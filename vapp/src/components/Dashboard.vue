<template>
  <section id="dashboard">
    <!-- <v-container> -->
      <v-card
        max-width="400">
        <v-card-title>
          Token Ratio
        </v-card-title>
        <v-card-text class="icon" tag="p">
          <span>
            <v-icon size="2rem">mdi-database</v-icon>1
          </span>
          <v-icon>mdi-arrow-right-circle</v-icon>
          <span>₹1000</span>
        </v-card-text>
      </v-card>
    <!-- </v-container> -->
  </section>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.icon {
  font-size: 2rem;
  margin: 0;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-evenly;
}
</style>