<template>
  <v-dialog
    v-model="open"
    persistent
    max-width="30rem"
  >
    <v-card>
      <v-card-title class="text-h5">
        Property
      </v-card-title>
      <v-icon class="close-icon" @click="$emit('close')">mdi-close</v-icon>
      <v-tabs>
        <v-tab>Details</v-tab>
        <v-tab v-if="(user.role === 'Developer' && !property.sold)">Sell</v-tab>
        <v-tab v-else-if="$router.history.current.path === '/u/my-investments'">Sold?</v-tab>
        <v-tab v-else-if="$router.history.current.path === '/u/open-properties'">Invest</v-tab>
        <v-tab v-if="$router.history.current.path === '/u/my-investments'">Investment</v-tab>
        <v-tab v-else-if="user.role === 'Developer'">Investments</v-tab>

        <v-tab-item key="1">
          <v-container fluid>
            <div id="map"></div>
            <div class="modal-row">
              <v-img
                src="../assets/property.png"
                max-width="120"
              />
              <div class="imp">
                {{ property.propertyName }}
                <small class="location-text">{{ property.location }}</small>
              </div>
            </div>
            <v-chip-group
              class="chips"
              column>
              <v-chip>
                {{ property.dateAdded }}
              </v-chip>
              <v-chip>
                {{ property.propertyType }}
              </v-chip>
              <v-chip>
                {{ property.propertyStatus }}
              </v-chip>
              <v-chip>
                {{ property.propertyAge }} years old
              </v-chip>
              <v-chip>
                {{ property.propertyFloors }} floors
              </v-chip>
              <v-chip>
                {{ property.propertyLockInPeriod }} months lock-in period
              </v-chip>
              <v-chip>
                {{ property.propertyMinInvestment }} % min. investment
              </v-chip>
              <v-chip>
                {{ property.propertyInvestPercentage }}% up for investment
              </v-chip>
            </v-chip-group>
            <v-card-text tag="p" class="description">
              {{ property.propertyDescription }}
            </v-card-text>
            <v-card-text tag="p">
              The property is currently valued at
              <div class="imp">₹ {{ property.propertyValuation }}</div>
            </v-card-text>
            <div class="area-row">
              <div id="built-up-area">
                <v-card-text tag="p" class="area-text">
                  Built-up Area (sq. ft.)
                </v-card-text>
                <v-card-text tag="p" class="imp">
                  {{ property.propertyFloorPlate }}
                </v-card-text>
              </div>
              <div id="carpet-area">
                <v-card-text tag="p" class="area-text">
                  Carpet Area (sq. ft.)
                </v-card-text>
                <v-card-text tag="p" class="imp">
                  {{ property.propertyCarpetArea }}
                </v-card-text>
              </div>
            </div>
            <v-card-text tag="p">
              Property owner
              <div class="imp address">{{ property.accountAddress }}</div>
            </v-card-text>
          </v-container>
        </v-tab-item>

        <!-- Only show sell tab for developer -->
        <v-tab-item key="2" v-if="user.role === 'Developer' && !property.sold">
          <v-container fluid class="sell-tab">
            <v-card-text tag="p" class="sell-text">
              Please enter the property name "<b>{{ property.propertyName }}</b>", <b>Purchaser Address and Email,</b> and click <em>SELL</em> to initiate the selling process.
            </v-card-text>
            <v-text-field
              v-model="name"
              label="Property Name"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="toAddress"
              label="Purchaser Address"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="toEmail"
              label="Purchaser Email"
              outlined
            ></v-text-field>
            <v-btn
              color="error"
              class="submit-btn"
              shaped
              x-large
              :disabled="name !== property.propertyName || loading || toAddress === '' || toEmail === ''"
              :loading="loading"
              @click="sellProperty"
            >
              SELL
            </v-btn>
          </v-container>
        </v-tab-item>

        <!-- Only show when user clicks from my-investments page -->
        <v-tab-item key="2" v-else-if="$router.history.current.path === '/u/my-investments'">
          <v-container fluid>
            <v-card-text tag="p">
              Once the property owner SELLS this property, the below button will become active and you will be able claim back your investment.
            </v-card-text>
            <v-btn
                color="primary"
                class="submit-btn claim-funds"
                shaped
                x-large
                :loading="loading3"
                :disabled="loading3 || !property.sold"
                @click="claimFunds"
              >
                CLAIM FUNDS
              </v-btn>
          </v-container>
        </v-tab-item>

        <!-- Only show invest tab for investor -->
        <v-tab-item key="2" v-else-if="$router.history.current.path === '/u/open-properties'">
          <v-container fluid>
            <v-card-text tag="p" class="invest-text">
              Minimum amount to invest is &nbsp;<span class="imp">{{ property.propertyMinInvestment }}%</span>
            </v-card-text>            
            <v-card-text tag="p" class="invest-text">
              Property available to invest in is &nbsp;<span class="imp">{{ maxInvestment }}%</span>
            </v-card-text>
            <div class="invest-slider">
              <v-subheader class="pl-0 invest-text">
                Investment (%)
              </v-subheader>
              <v-slider
                v-model="investment"
                :min="property.propertyMinInvestment"
                :max="maxInvestment"
                thumb-label="always"
              ></v-slider>
              <v-card-text tag="p" class="invest-text">
                Investment amount: &nbsp;<span class="imp">{{ getInvestmentAmount }}</span>
              </v-card-text>
              <v-card-text tag="p" class="invest-text">
                Tokens earned: &nbsp;<span class="imp">{{ getTokensEarned }}</span>
              </v-card-text>
              <v-btn
                color="primary"
                class="submit-btn"
                shaped
                x-large
                @click="invest"
                :loading="loading2"
                :disabled="loading2 || maxInvestment === 0"
              >
                INVEST
              </v-btn>
            </div>
          </v-container>
        </v-tab-item>

        <!-- Only show investment details tab for developer -->
        <v-tab-item key="3" v-if="user.role === 'Developer'">
          <v-container fluid class="investment-details-tab">
            <v-expansion-panels v-if="investmentDetails">
              <v-expansion-panel
                v-for="(item, index) in investmentDetails"
                :key="index"
              >
                <v-expansion-panel-header>
                  {{ item.dateInvested }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="invested">
                    <v-card-text tag="p" class="imp address">
                      {{ item.account_address }}
                    </v-card-text>
                    <v-card-text tag="p" class="imp">
                      {{ item.invested_value }}%
                    </v-card-text>
                  </div>
                  <div class="invest-row">
                    <div id="built-up-area">
                      <v-card-text tag="p" class="area-text">
                        Token Amount
                      </v-card-text>
                      <v-card-text tag="p" class="imp">
                        {{ item.tokens_earned }} tokens
                      </v-card-text>
                    </div>
                    <div id="carpet-area">
                      <v-card-text tag="p" class="area-text mb-3">
                        Investment Status
                      </v-card-text>
                      <v-chip :color="returnColor(item)">
                        <v-card-text tag="p" v-if="item.approved === 'denied'">
                          Investment Denied
                        </v-card-text>
                        <v-card-text tag="p" v-else-if="item.approved === 'true'">
                          Approved
                        </v-card-text>
                        <v-card-text tag="p" v-else>
                          Pending Approval
                        </v-card-text>
                      </v-chip>
                    </div>
                  </div>
                  <div class="invest-row">
                    <div id="built-up-area">
                      <v-card-text tag="p" class="area-text">
                        Invested Amount
                      </v-card-text>
                      <v-card-text tag="p" class="imp">
                        ₹ {{ item.invested_amount }}
                      </v-card-text>
                    </div>
                    <div id="carpet-area">
                      <v-card-text tag="p" class="area-text">
                        Evaluated Amount
                      </v-card-text>
                      <v-card-text tag="p" class="imp">
                        ₹ {{ Math.ceil(item.invested_value/100*property.propertyValuation) }}
                      </v-card-text>
                    </div>
                  </div>
                  <v-card-actions v-if="item.approved === 'false'">
                    <v-btn
                      color="primary"
                      class="submit-btn"
                      shaped
                      :loading="loadApproval"
                      :disabled="loadApproval"
                      @click="approveInvestment(item)">
                      Approve
                    </v-btn>

                    <v-btn
                      color="red darken-3"
                      class="submit-btn"
                      dark
                      shaped
                      :loading="loadApproval"
                      :disabled="loadApproval"
                      @click="denyInvestment(item)">
                      Deny
                    </v-btn>
                  </v-card-actions>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <p v-else class="text-center mb-0 mt-8">
              There are no investment requests yet :(
            </p>
          </v-container>
        </v-tab-item>
        <v-tab-item key="3" v-else-if="$router.history.current.path === '/u/my-investments'">
          <v-container v-if="investmentDetails" fluid class="investment-details-tab">
            <div class="invested">
              <v-card-text tag="p" class="imp address">
                {{ investmentDetails.account_address }}
              </v-card-text>
              <v-card-text tag="p" class="imp">
                {{ investmentDetails.invested_value }}%
              </v-card-text>
            </div>
            <div class="invest-row">
              <div id="built-up-area">
                <v-card-text tag="p" class="area-text">
                  Token Amount
                </v-card-text>
                <v-card-text tag="p" class="imp">
                  {{ investmentDetails.tokens_earned }} tokens
                </v-card-text>
              </div>
              <div id="carpet-area">
                <v-card-text tag="p" class="area-text mb-3">
                  Investment Status
                </v-card-text>
                <v-chip :color="returnColor(investmentDetails)">
                  <v-card-text tag="p" v-if="investmentDetails.approved === 'denied'">
                    Investment Denied
                  </v-card-text>
                  <v-card-text tag="p" v-else-if="investmentDetails.approved === 'true'">
                    Approved
                  </v-card-text>
                  <v-card-text tag="p" v-else>
                    Pending Approval
                  </v-card-text>
                </v-chip>
              </div>
            </div>
            <div class="invest-row">
              <div id="built-up-area">
                <v-card-text tag="p" class="area-text">
                  Invested Amount
                </v-card-text>
                <v-card-text tag="p" class="imp">
                  ₹ {{ investmentDetails.invested_amount }}
                </v-card-text>
              </div>
              <div id="carpet-area">
                <v-card-text tag="p" class="area-text">
                  Evaluated Amount
                </v-card-text>
                <v-card-text tag="p" class="imp">
                  ₹ {{ Math.ceil(investmentDetails.invested_value/100*property.propertyValuation) }}
                </v-card-text>
              </div>
            </div>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
import general from '../mixins/general'

export default {
  name: 'PropertyModal',
  mixins: [general],
  props: ['open', 'property', 'maxInvestment', 'investmentDetails'],
  data() {
    return {
      user: {},
      name: 'Shiv Shakti Heights',
      toAddress: '0x6064ebeA7ff4deE43df30592A3bd523C8Bd4AF7e',
      toEmail: 'developer2@gmail.com',
      loading: false,
      loading2: false,
      loading3: false,
      loadApproval: false,
      investment: this.property.propertyMinInvestment,
    }
  },
  methods: {
    claimFunds() {
      this.loading3 = true
      let evaluatedAmount = Math.ceil(this.investmentDetails.invested_value/100*this.property.propertyValuation)
      this.$http.post(this.$url + 'get-balance', {
        email: this.property.previousDeveloperEmail
      }).then(res => {
        if(res.data.status === 200 && res.data.currencyBalance < evaluatedAmount) {
          this.loading3 = false
          this.$emit('close')
          this.$emit('snack', {
            color: '#E53935',
            message: 'Failed to claim, insufficient funds in developer account'
          })
        } else {
          this.getContract().transferTokens(this.property.accountAddress, this.investmentDetails.tokens_earned).send({
            from: this.getAccount()
          })
          .then(() => {
            this.$http.post(this.$url + 'claim-funds', {
              propertyName: this.property.propertyName,
              developerAddress: this.property.accountAddress,
              account_address: this.getAccount()
            })
            .then((res2) => {
              if(res2.data.status === 200) {
                this.$http.post(this.$url + 'update-balance', {
                  byerEmail: this.property.previousDeveloperEmail,
                  byerBalance: res.data.currencyBalance - evaluatedAmount,
                  sellerEmail: this.getUser().email,
                  sellerBalance: this.getUser().currencyBalance + evaluatedAmount
                }).then((res3)=> {
                  if(res3.data.status === 200) {
                    this.updateCurrencyBalance(this.getUser().currencyBalance + evaluatedAmount)
                    this.loading3 = false
                    this.$emit('claimed')
                    this.$emit('close')
                    this.$emit('snack', {
                      color: 'success',
                      message: 'Funds claimed successfully!'
                    })
                  }
                })
              }
            })
          })
          .catch(() => {
            this.loading3 = false
            this.$emit('close')
          })
        }
      })
    },
    sellProperty() {
      this.loading = true
      this.$http.post(this.$url + 'account', {
        email: this.toEmail
      }).then((res) => {
        if(res.data.status === 404) {
          this.loading = false
          this.$emit('close')
          this.$emit('snack', {
            color: '#E53935',
            message: 'No user with this email ID'
          })
        } else if(res.data.status === 403) {
          this.loading = false
          this.$emit('close')
          this.$emit('snack', {
            color: '#E53935',
            message: 'Recepient user is not a developer'
          })
        } else {
          this.$http.post(this.$url + 'get-balance', {
            email: this.toEmail
          }).then((res) => {
            if(res.data.status === 200 && res.data.currencyBalance < this.property.propertyValuation) {
              this.$emit('close')
              this.$emit('snack', {
                color: '#E53935',
                message: 'Purchaser has insufficient funds'
              })
            } else {
              this.getContract().sell(this.toAddress, this.tokensToSell()).send({
                from: this.getAccount()
              })
              .then(() => {
                this.$http.post(this.$url + 'update-balance', {
                  byerEmail: this.toEmail,
                  byerBalance: res.data.currencyBalance - this.property.propertyValuation,
                  sellerEmail: this.getUser().email,
                  sellerBalance: this.getUser().currencyBalance + this.property.propertyValuation
                }).then((res2) => {
                  if(res2.data.status === 200) {
                    this.$http.post(this.$url + 'sell-property', {
                      propertyName: this.property.propertyName,
                      developerAddress: this.getAccount(),
                      toAddress: this.toAddress,
                      developerEmail: this.toEmail
                    })
                    .then((res3) => {
                      if(res3.data.status === 200) {
                        this.$http.post(this.$url + 'update-investments', {
                          propertyName: this.property.propertyName,
                          developerAddress: this.getAccount(),
                          toAddress: this.toAddress
                        })
                        .then((res4) => {
                          if(res4.data.status === 200) {
                            this.loading = false
                            this.$emit('close')
                            this.$emit('sold')
                            this.$emit('snack', {
                              color: 'success',
                              message: 'Property has been successfully sold!'
                            })
                          }
                        })
                      }
                    })
                  }
                })
              })
              .catch(() => {
                this.loading = false
                this.$emit('close')
              })
            }
          })
        }
      })
    },
    invest() {
      this.loading2 = true
      if(this.getInvestmentAmount > this.getUser().currencyBalance) {
        this.$emit('snack', {
          color: '#E53935',
          message: 'Insufficient funds for this investment'
        })
        this.loading2 = false
        return
      }
      this.$http.post(this.$url + 'invest', {
        account_address: this.getAccount(),
        investedPropertyName: this.property.propertyName,
        developer_address: this.property.accountAddress,
        investor_email: this.getUser().email,
        invested_value: this.investment,
        tokens_earned: this.getTokensEarned,
        invested_amount: this.getInvestmentAmount,
        dateInvested: new Date()
      }).then((res) => {
        if(res.data.status === 200) {
          this.loading2 = false
          this.$emit('snack', {
            color: 'success',
            message: 'Investment request sent, pending approval from developer'
          })
          this.$emit('close')
        }
      })
      .catch(() => {
        this.loading2 = false
        this.$emit('close')
      })
    },
    approveInvestment(item) {
      this.loadApproval = true
      this.getContract().transferTokens(item.account_address, item.tokens_earned).send({
        from: this.getAccount()
      })
      .then(() => {
        this.$http.post(this.$url + 'get-balance', {
          email: item.investor_email
        }).then((res) => {
          if(res.data.status === 200) {
            this.$http.post(this.$url + 'update-balance', {
              byerEmail: item.investor_email,
              byerBalance: res.data.currencyBalance - item.invested_amount,
              sellerEmail: this.getUser().email,
              sellerBalance: this.getUser().currencyBalance + item.invested_amount
            }).then((res2) => {
              if(res2.data.status === 200) {
                this.$http.post(this.$url + 'update-approved', {
                  propertyName: item.investedPropertyName,
                  developerAddress: item.developer_address,
                  accountAddress: item.account_address,
                  approved: 'true'
                }).then((res) => {
                  if(res.data.status === 200) {
                    this.loadApproval = false
                    this.$emit('close')
                    this.$emit('snack', {
                      color: 'success',
                      message: 'Investment Approved!'
                    })
                  }
                })
              }
            })
          }
        })
      })
      .catch(() => {
        this.loadApproval = false
        this.$emit('close')
      })
    },
    denyInvestment(item) {
      this.$http.post(this.$url + 'update-approved', {
        propertyName: item.investedPropertyName,
        developerAddress: item.developer_address,
        accountAddress: item.account_address,
        approved: 'denied'
      }).then((res) => {
        if(res.data.status === 200) {
          this.loadApproval = false
          this.$emit('close')
          this.$emit('snack', {
            color: 'success',
            message: 'Investment Denied!'
          })
        }
      })
    },
    tokensToSell() {
      let tokens = 0
      this.investmentDetails.map(a => {
        tokens += a.tokens_earned
      })
      return this.property.tokensEarned - tokens
    },
    returnColor(item) {
      return item.approved === 'denied' ?
        'red lighten-3' : item.approved === 'true' ?
          'success' : 'warning' 
    },
    loadData() {
      this.user = this.getUser()
    }
  },
  computed: {
    getInvestmentAmount() {
      return Math.ceil((this.investment/100)*this.property.propertyValuation)
    },
    getTokensEarned() {
      return Math.ceil(((this.investment/100)*this.property.tokensEarned))
    },
    updatedBalanceMinus() {
      return this.getUser().currencyBalance - this.getInvestmentAmount
    },
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style scoped>
.card-title {
  justify-content: center;
}
.modal-row {
  display: flex;
  align-items: center;
}
.imp {
  font-size: 2rem;
  font-weight: 600;
  color: #23696c;
  line-height: 2rem;
}
.imp > .location-text {
  font-size: 1.2rem;
  line-height: 1.4rem;
  display: block;
}
.v-card__text {
  margin: 0;
  padding: 10px 15px;
}
.description {
  font-size: 1rem;
}
.chips {
  padding: 0 15px;
}
.area-row {
  display: grid;
  grid-auto-flow: column;
  margin-top: 1rem;
}
#built-up-area,
#carpet-area {
  text-align: center;
  margin: auto;
}
.area-text {
  padding: 0 !important;
  font-size: 1.2rem;
}
.address {
  font-size: 1rem;
  line-height: 1.3rem;
}

.sell-tab, .investment-details-tab {
  padding: 0 2rem 2rem;
}
.sell-text {
  padding: 0.6rem 0;
  font-size: 1rem;
}
.close-icon {
  position: absolute !important;
  top: 16px;
  right: 14px;
  font-size: 2.2rem !important;
}
.close-icon:hover {
  transform: scale(1.3);
}

.invest-text {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
}
.invest-slider {
  padding: 10px 15px;
}

.invested {
  display: grid;
  grid-auto-flow: column;
  word-break: break-all;
}

.claim-funds {
  margin: 0 0 10px 15px;
}

.invest-row {
  display: grid;
  grid-auto-flow: column;
  margin-top: 1rem;
}
</style>