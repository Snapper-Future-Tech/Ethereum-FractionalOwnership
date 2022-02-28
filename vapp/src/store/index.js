import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ encodingType: 'rc4', isCompression: false });
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      },
      reducer(val) {
        if(val.user.email === undefined) {
          return {
            user: {},
            account: '',
            contract: {},
          }
        }
        return val
      } 
    })
  ],
  state: {
    user: {},
    account: '',
    contract: {},
  },
  mutations: {
    'UPDATE_USER' (state, user) {
      state.user = user
    },
    'UPDATE_CURRENCY_BALANCE' (state, currencyBalance) {
      state.user.currencyBalance = currencyBalance
    },
    'UPDATE_ACCOUNT' (state, account) {
      state.account = account
    },
    'UPDATE_CONTRACT' (state, contract) {
      state.contract = contract
    },
  },
  actions: {
    updateUser({ commit }, user) {
      commit('UPDATE_USER', user)
    },
    updateCurrencyBalance({ commit }, currencyBalance) {
      commit('UPDATE_CURRENCY_BALANCE', currencyBalance)
    },
    updateAccount({ commit }, account) {
      commit('UPDATE_ACCOUNT', account)
    },
    updateContract({ commit }, contract) {
      commit('UPDATE_CONTRACT', contract)
    }
  },
  getters: {
    getUser: (state) => {
      return state.user
    },
    getAccount: (state) => {
      return state.account
    },
    getContract: (state) => {
      return state.contract
    }
  },
  modules: {},
});
