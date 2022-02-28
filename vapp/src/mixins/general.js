import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import store from "../store";

const general = {
  methods: {
    ...mapActions([
      'updateUser', 'updateCurrencyBalance', 'updateAccount', 'updateContract'
    ]),
    ...mapGetters([
      'getUser', 'getAccount', 'getContract'
    ]),
    updateUser(user) {
      store.dispatch('updateUser', user)
    },
    updateCurrencyBalance(currencyBalance) {
      store.dispatch('updateCurrencyBalance', currencyBalance)
    },
    updateAccount(account) {
      store.dispatch('updateAccount', account)
    },
    updateContract(contract) {
      store.dispatch('updateContract', contract)
    },
    getUser() {
      return store.getters.getUser
    },
    getAccount() {
      return store.getters.getAccount
    },
    getContract() {
      return store.getters.getContract
    }
  }
}

export default general

Vue.mixin(general)