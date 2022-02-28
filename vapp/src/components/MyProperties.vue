<template>
  <section id="my-properties">
    <v-card>
      <v-card-title>
        {{ getUser().role === 'Developer' ? 'My' : 'Open' }} Properties &nbsp;
        <small>(Click on any property to view further details)</small>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items "
        :search="search"
        @click:row="selectProperty"
        :loading="loading"
        loading-text="Loading... Please wait"
      ></v-data-table>
    </v-card>
    <PropertyModal 
      :open="open"
      :property="selectedProperty"
      @close="closeModal"
      :maxInvestment="maxInvestment"
      :investmentDetails="investmentDetails"
      @snack="gotSnack"
    />
  </section>
</template>

<script>
import moment from 'moment'
import PropertyModal from './PropertyModal'
import general from '../mixins/general'

export default {
  name: 'MyProperties',
  mixins: [general],
  components: {
    PropertyModal,
  },
  data () {
    return {
      loading: true,
      search: '',
      headers: [
        {
          text: 'Property Name',
          align: 'start',
          sortable: false,
          value: 'propertyName',
        },
        { text: 'Date Added', value: 'dateAdded' },
        { text: 'Age (Years)', value: 'propertyAge' },
        { text: 'Location', value: 'location' },
      ],
      items: [],
      open: false,
      selectedProperty: {},
      maxInvestment: null,
      investmentDetails: null,
    }
  },
  methods: {
    gotSnack(snack) {
      this.$emit('snack', {
        color: snack.color,
        message: snack.message
      })
    },
    selectProperty(property) {
      this.open = true
      this.selectedProperty = property
      this.maxInvestment = property.propertyInvestPercentage
      this.loadInvestmentTab(property)
    },
    closeModal() {
      this.open = false
      this.selectedProperty = {}
      this.maxInvestment = null
      this.investmentDetails = null
    },
    loadInvestmentTab(property) {
      this.$http.post(this.$url + 'property-investments', {
        investedPropertyName: property.propertyName,
        developerAddress: property.accountAddress
      }).then((res) => {
        if(this.getUser().role === 'Developer') {
          res.data.map(a => {
            a.dateInvested = moment(a.dateInvested).format('LL')
          })
          this.investmentDetails = res.data.length > 0 ? res.data : null
        }
        let sum = 0
        res.data.map(a => {
          sum += a.invested_value
        })
        if(sum !== 0) {
          this.maxInvestment = property.propertyInvestPercentage - sum
        }
      })
    },
    loadData() {
      this.loading = true
      let account = ''
      if(this.getUser().role === 'Developer') {
        account = this.getAccount()
      }
      this.$http.post(this.$url + 'myProperty', {
        accountAddress: account 
      })
      .then(res => {
        res.data.map(a => {
          a.dateAdded = moment(a.dateAdded).format('LL')
          a.location = a.propertyLocality + ', ' + a.propertyCity + ', ' + a.propertyState + ', ' + a.propertyCountry
        })
        this.items = res.data
        this.loading = false
      })
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>