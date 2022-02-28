<template>
  <section id="add-property">
    <v-stepper
      v-model="step"
      vertical
    >
      <v-stepper-step
        :complete="step > 1"
        step="1"
      >
        Property Address
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-container class="form-row" fluid>
          <v-text-field
            v-model="name"
            label="Name"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="address"
            label="Address"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="locality"
            label="Locality"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="city"
            label="City"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="state"
            label="State"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="pincode"
            label="Pincode"
            outlined
            required
          ></v-text-field>
          <v-select
            v-model="selectedCountry"
            :items="countries"
            label="Country"
            outlined
            required
          ></v-select>
          <v-text-field
            v-model="geoLocation"
            label="Geo Location"
            outlined
            required
          ></v-text-field>
        </v-container>
        <v-btn
          color="primary"
          @click="step = 2"
        >
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 2"
        step="2"
      >
        Propert Details
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-container class="form-row" fluid>
          <v-select
            v-model="selectedPropertyType"
            :items="propertyTypes"
            label="Property Type"
            outlined
            required
          ></v-select>
          <v-text-field
            v-if="this.selectedPropertyType !== 'Vacant Land'"
            type="number"
            v-model="numberOfFloors"
            label="Number of Floors"
            outlined
            required
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="propertyAge"
            label="Property Age (Years)"
            outlined
            required
          ></v-text-field>
          <v-select
            v-model="selectedPropertyStatus"
            :items="propertyStatuses"
            label="Property Status"
            outlined
            required
          ></v-select>
          <v-text-field
            type="number"
            v-model="floorPlate"
            label="Floor Plate (Sq. Ft.)"
            outlined
            required
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="carpetArea"
            label="Carpet Area (Sq. Ft.)"
            outlined
            required
          ></v-text-field>
        </v-container>
        <v-container fluid>
          <v-textarea
            outlined
            name="input-7-4"
            label="Property Description"
            v-model="propertyDescription"
          ></v-textarea>
          <!-- <v-file-input
            v-model="image"
            color="green darken-1 accent-4"
            counter
            label="File input"
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            outlined
            :show-size="1000"
            @change="handleImageChange"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                v-if="index < 2"
                color="grey darken-1 accent-4"
                dark
              >
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="text-overline grey--text text--darken-3 mx-2"
              >
                +{{ files.length - 2 }} File(s)
              </span>
            </template>
          </v-file-input> -->
        </v-container>
        <v-btn
          color="primary"
          @click="step = 3"
        >
          Continue
        </v-btn>
        <v-btn class="ml-4" @click="step -= 1">
          Back
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 3"
        step="3"
      >
        Sale Terms
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-container class="form-row" fluid>
          <v-text-field
            type="number"
            v-model="totalValuation"
            label="Total Valuation (₹)"
            outlined
            :disbaled="true"
            required
          ></v-text-field>
        </v-container>
        <v-container fluid>
          <v-slider
            v-model="percentForInvestment"
            label="% of property open for investment"
            step="5"
            persistent-hint
            thumb-label="always"
            ticks
          ></v-slider>
          <v-card-text tag="p" class="tokens-earned">
            You will receive <span class="imp">{{ getTokensEarned }} tokens</span> at the rate of <span class="imp">1 token per ₹ 1000</span>!
          </v-card-text>
        </v-container>
        <v-container class="form-row" fluid>
          <v-text-field
            type="number"
            v-model="minInvestment"
            label="Minimum Investment (%)"
            outlined
            required
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="lockInPeriod"
            label="Lock-in Period (Months)"
            outlined
            required
          ></v-text-field>
        </v-container>
        <v-btn
          color="primary"
          @click="registerProperty"
          :loading="loading"
          :disabled="loading"
        >
          Register property
        </v-btn>
        <v-btn class="ml-4" @click="step -= 1">
          Back
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </section>
</template>

<script>
import general from '../mixins/general'

export default {
  name: 'AddProperty',
  mixins: [general],
  data: () => ({
    loading: false,
    step: 3,
    name: 'Shiv Shakti Heights',
    address: '403, Shiv Shakti Heights, Behind Popular Hotel, Hingwala Lane, Ghatkopar East',
    locality: 'Ghatkopar',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400077',
    selectedCountry: 'India',
    countries: [
      'India', 'USA', 'Canada', 'Germany', 'UK'
    ],
    geoLocation: '19.079023, 72.908012',
    selectedPropertyType: 'Residential',
    propertyTypes: [
      'Vacant Land', 'Residential', 'Commercial'
    ],
    numberOfFloors: 15,
    propertyAge: 11,
    selectedPropertyStatus: 'Completed',
    propertyStatuses: [
      'Completed', 'Under Contruction'
    ],
    floorPlate: 150000,
    carpetArea: 125000,
    propertyDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis commodo sem ut vestibulum. Sed laoreet ornare ligula et venenatis.',
    totalValuation: 200000000,
    percentForInvestment: 80,
    minInvestment: 10,
    lockInPeriod: 12,
    // image: '',
  }),
  methods: {
    checkDev() {
      if(this.getUser().role === 'Investor') {
        this.$router.push('/u/dashboard')
      }
    },
    registerProperty() {
      if(this.name === '') {
        this.throwSnack('Property Name cannot be empty')
      } else if(this.address === '') {
        this.throwSnack('Property Address cannot be empty')
      } else if(this.locality === '') {
        this.throwSnack('Property Locality cannot be empty')
      } else if(this.city === '') {
        this.throwSnack('City cannot be empty')
      } else if(this.state === '') {
        this.throwSnack('State cannot be empty')
      } else if(this.pincode === '') {
        this.throwSnack('Pincode cannot be empty')
      } else if(this.selectedCountry === '') {
        this.throwSnack('Country cannot be empty')
      } else if(this.geoLocation === '') {
        this.throwSnack('Geo Localtion cannot be empty')
      } else if(this.selectedPropertyType === '') {
        this.throwSnack('Property Type cannot be empty')
      } else if(this.numberOfFloors === '' && this.selectedPropertyType !== 'Vacant Land') {
        this.throwSnack('Number of Floors cannot be empty')
      } else if(this.propertyAge === '') {
        this.throwSnack('Property Age cannot be empty')
      } else if(this.selectedPropertyStatus === '') {
        this.throwSnack('Property Status cannot be empty')
      } else if(this.floorPlate === '') {
        this.throwSnack('Floor PLate cannot be empty')
      } else if(this.carpetArea === '') {
        this.throwSnack('Carpet Area cannot be empty')
      } else if(this.carpetArea >= this.floorPlate) {
        this.throwSnack('Carpet Area cannot be greater than Floor Plate')
      } else if(this.propertyDescription === '') {
        this.throwSnack('Property Description cannot be empty')
      } else if(this.totalValuation === '') {
        this.throwSnack('Total Valuation cannot be empty')
      } else if(this.percentForInvestment === 0) {
        this.throwSnack('Percent of Property up for investment cannot be zero')
      } else if(this.minInvestment === '') {
        this.throwSnack('Minimum Investment in property cannot be empty')
      } else if(this.lockInPeriod === '') {
        this.throwSnack('Lock-in Period cannot be empty')
      } else {
        this.loading = true
        this.getContract().addProperty(this.getTokensEarned)
        .send({
          from: this.getAccount()
        })
        .then(() => {
          this.$http.post(this.$url + 'addProperty', {
            accountAddress: this.getAccount(),
            previousOwner: this.getAccount(),
            tokensEarned: this.getTokensEarned,
            developerEmail: this.getUser().email,
            previousDeveloperEmail: this.getUser().email,
            propertyName: this.name,
            propertyAddress: this.address,
            propertyLocality: this.locality,
            propertyCity: this.city,
            propertyState: this.state,
            propertyPincode: this.pincode,
            propertyCountry: this.selectedCountry,
            geoLocation: this.geoLocation,
            propertyType: this.selectedPropertyType,
            propertyFloors: this.numberOfFloors,
            propertyAge: this.propertyAge,
            propertyStatus: this.selectedPropertyStatus,
            propertyFloorPlate: this.floorPlate,
            propertyCarpetArea: this.carpetArea,
            propertyDescription: this.propertyDescription,
            propertyValuation: this.totalValuation,
            propertyInvestPercentage: this.percentForInvestment,
            propertyMinInvestment: this.minInvestment,
            propertyLockInPeriod: this.lockInPeriod,
            dateAdded: new Date(),
            sold: false,
          }).then(() => {
            this.loading = false
            this.$emit('snack', {
              color: 'success',
              message: 'Property registered Successfully!' 
            })
          })
        })
        .catch(() => {
          this.loading = false
        })
      }
    },
    throwSnack(message) {
      this.$emit('snack', {
        color: '#E53935',
        show: true,
        message: message 
      })
    }
  },
  computed: {
    getTokensEarned() {
      return Math.ceil(this.totalValuation/this.$tokenRatio)
    }
  },
  mounted() {
    this.checkDev()
  }
}
</script>

<style>
.form-row {
  display: grid;
  grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
  grid-gap: 1rem;
}

.tokens-earned {
  margin: 0 !important;
  padding-left: 0 !important;
  color: rgba(0,0,0,.6);
  font-size: 1.2rem !important;
}

.imp {
  font-weight: 600;
  color: #23696c;
}
</style>