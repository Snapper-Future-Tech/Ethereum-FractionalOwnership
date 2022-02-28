<template>
  <v-container fluid>
    <v-card elevation="2" :loading="loading" shaped class="card">
      <h1 class="heading">Login</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          outlined
          required
        ></v-text-field>

        <v-text-field
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          v-model="password"
          :rules="passwordRules"
          label="Password"
          @click:append="showPass = !showPass"
          :type="showPass ? 'text' : 'password'"
          outlined
          required
        ></v-text-field>

        <v-row class="form-footer-row" no-gutters>
          <div>
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </div>
          <v-btn
            color="primary"
            class="submit-btn"
            shaped
            x-large
            :disabled="loading || email === '' || password === ''"
            @click="login"
            :loading="loading"
          >
            Login
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import general from "../mixins/general";

export default {
  name: "Login",
  mixins: [general],
  data: () => ({
    showPass: false,
    loading: false,
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
  }),
  methods: {
    async login() {
      this.loading = true;
      this.$http
        .post(this.$url + "login", {
          role: this.entity,
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          if (res.data.status === 403) {
            this.$emit("snack", {
              color: "#E53935",
              message: "Incorrect email or password",
            });
          } else if (res.data.status === 404) {
            this.$emit("snack", {
              color: "#E53935",
              message: "User does not exist",
            });
          } else {
            this.updateUser(res.data.user);
            this.$router.push("/u");
          }
          this.loading = false;
        });
    },
  },
};
</script>
