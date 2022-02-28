<template>
  <v-container fluid>
    <v-card elevation="2" :loading="loading" shaped class="card">
      <h1 class="heading">Register</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-select
          v-model="entity"
          :items="entities"
          :rules="[(v) => !!v || 'Role is required']"
          label="Role"
          outlined
          required
        ></v-select>

        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Name"
          outlined
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          outlined
          required
        ></v-text-field>

        <v-text-field
          :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPass = !showPass"
          v-model="password"
          :rules="passwordRules"
          label="Password"
          outlined
          required
        ></v-text-field>

        <v-text-field
          type="password"
          v-model="confirmPassword"
          :rules="confirmPasswordRules()"
          label="Confirm Password"
          outlined
          required
        ></v-text-field>

        <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree with the terms & conditions?"
          required
        ></v-checkbox>

        <v-row class="form-footer-row" no-gutters>
          <div>
            Already have an account?
            <router-link to="/login">Login</router-link>
          </div>
          <v-btn
            color="primary"
            class="submit-btn"
            shaped
            x-large
            :disabled="
              loading ||
              name === '' ||
              email === '' ||
              password === '' ||
              confirmPassword === '' ||
              entity === '' ||
              checkbox === false ||
              password !== confirmPassword
            "
            @click="register"
            :loading="loading"
          >
            Register
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Register",
  data: () => ({
    showPass: false,
    loading: false,
    valid: true,
    name: "",
    nameRules: [(v) => !!v || "Name is required"],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
    confirmPassword: "",
    entity: "Developer",
    entities: ["Developer", "Investor"],
    checkbox: false,
  }),
  methods: {
    confirmPasswordRules() {
      return [
        (v) => !!v || "Please re-enter your password",
        (v) => v === this.password || "Password & Confirm Password must match",
      ];
    },
    async register() {
      this.loading = true;
      this.$http
        .post(this.$url + "register", {
          role: this.entity,
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          if (res.data.status === 209) {
            this.$emit("snack", {
              color: "#E53935",
              message: "This user already exists!",
            });
          } else {
            this.$emit("snack", {
              color: "success",
              message: "Registered successfully, please login!",
            });
            this.$router.push("/login");
          }
          this.loading = false;
        });
    },
  },
};
</script>
