<template>
  <section id="my-properties">
    <v-card>
      <v-card-title>
        My Investments &nbsp;
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
      :investmentDetails="investmentDetails"
      @snack="gotSnack"
      @sold="loadData"
      @claimed="loadData"
    />
  </section>
</template>

<script>
import moment from 'moment'
import PropertyModal from './PropertyModal'
import general from '../mixins/general'

export default {
  name: 'MyInvestments',
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
          value: 'investedPropertyName',
        },
        { text: 'Date Invested', value: 'dateInvested' },
        { text: 'Investment (%)', value: 'invested_value', align: 'center' },
        { text: 'Invested Amount (₹)', value: 'invested_amount', align: 'center' },
        { text: 'Tokens Earned', value: 'tokens_earned', align: 'center' },
      ],
      items: [],
      open: false,
      selectedProperty: {},
      investmentDetails: {},
    }
  },
  methods: {
    checkInv() {
      if(this.getUser().role === 'Developer') {
        this.$router.push('/u/dashboard')
      }
    },
    gotSnack(snack) {
      this.$emit('snack', {
        color: snack.color,
        message: snack.message
      })
      this.closeModal()
      this.loadData()
    },
    selectProperty(property) {
      this.loadPropertyData(property)
    },
    closeModal() {
      this.open = false
      this.selectedProperty = {}
      this.investmentDetails = {}
    },
    loadPropertyData(property) {
      this.$http.post(this.$url + 'property-details', {
        investedPropertyName: property.investedPropertyName,
        developerAddress: property.developer_address
      })
      .then((res) => {
        res.data[0].dateAdded = moment(res.data[0].dateAdded).format('LL')
        this.selectedProperty = res.data[0]
        this.selectedProperty.investedValue = property.invested_value
        this.selectedProperty.userSold = property.sell_flag
        this.investmentDetails = property
        this.open = true
      })
    },
    loadData() {
      this.loading = true
      this.$http.post(this.$url + 'myInvestments', {
        accountAddress: this.getAccount() 
      })
      .then(res => {
        res.data.map(a => {
          a.dateInvested = moment(a.dateInvested).format('LL')
        })
        this.items = res.data
        this.loading = false
      })
    }
  },
  mounted() {
    this.checkInv()
    this.loadData()
  }
}
</script>