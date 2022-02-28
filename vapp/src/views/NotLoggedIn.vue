<template>
  <div>
    <v-app-bar
        app
        color="white"
        dark
        height="80"
      >
      <div class="d-flex align-center">
        <v-list-item
          to="/">
          <v-img
            alt="Sapper Logo"
            class="shrink mr-2"
            contain
            src="../assets/sft.png"
            transition="scale-transition"
          />
        </v-list-item>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://snapperfuturetech.com/"
        target="_blank"
        text
        color="black"
      >
        <span class="mr-2">More Info</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container class="bg-img" fluid>
      <v-fade-transition name="notLoggedIn" mode="out-in">
        <router-view @snack="gotSnack" />
      </v-fade-transition>

      <v-snackbar
        :timeout="5000"
        :value="snack.show"
        :color="snack.color"
        absolute
        right
        shaped
        top
        width="18rem"
        min-width="0rem"
        
        transition="slide-x-reverse-transition"
      >
        {{ snack.message }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'NotLoggedIn',
  data() {
    return {
      snack: {
        color: 'primary',
        show: false,
        message: '',
      },
    }
  },
  methods: {
    gotSnack(snack) {
      this.snack.color = snack.color
      this.snack.show = true
      this.snack.message = snack.message

      setTimeout(() => {
        this.snack.show = false
      }, this.$notificationTimeout)
    },
  }
}
</script>

<style>
.bg-img {
  background: linear-gradient(to bottom, rgba(245, 246, 252, 0.72), rgba(117, 19, 93, 0.83)), url(../assets/skyscraper.jpg);
  background-size: cover;
  min-height: calc(100vh - 80px);
  padding: 0 !important;
}

.heading {
  text-align: center;
  font-size: 2.6rem;
  font-weight: 600;
  margin-bottom: 2rem;
}
.submit-btn {
  text-align: right
}
.form-footer-row {
  justify-content: space-between;
  align-items: center;
}
.card {
  padding: 0 1rem 1rem;
  max-width: 30rem !important;
  margin: 5rem auto;
}
</style>