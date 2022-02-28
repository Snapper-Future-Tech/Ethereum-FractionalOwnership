<template>
  <v-container fluid>
    <v-row class="text-center home-row">
      <v-col cols="6">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Snapper Future Tech
        </h1>
      </v-col>

      <v-col
        class="mb-5"
        cols="6"
      >
        <v-btn
          x-large
          color="primary"
          dark
          to="/login"
        >
          Login
        </v-btn>
        <hr>
        <v-btn
          x-large
          color="primary"
          dark
          to="/register"
        >
          Register
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => ({}),
  }
</script>

<style scoped>
.home-row {
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  padding: 3rem;
}
hr {
  background-color: black;
  height: 4px !important;
  margin: 1rem 0;
  border: none;
}
hr {
  background-color: black;
  height: 4px !important;
  margin: 2rem 0;
  padding: 0;
  border: none;
  border-top: medium double #333;
  color: #333;
  text-align: center;
}
hr:after {
  content: "OR";
  display: inline-block;
  position: relative; 
  top: -0.7em;  
  font-size: 1.3em;
  padding: 0 0.25em;
  background: black;
  color: white;
  border-radius: 10px;
}

</style>
