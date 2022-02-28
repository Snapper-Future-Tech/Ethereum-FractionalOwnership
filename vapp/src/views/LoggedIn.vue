<template>
  <v-container id="logged-in" fluid>
    <v-navigation-drawer
      permanent
      fixed
      color="rgb(3 91 98)">
      <v-list-item to="/u/dashboard">
        <v-img
          alt="Sapper Logo"
          class="shrink mt-2"
          contain
          color="rgb(3 91 98)"
          src="../assets/sft-white.png"
          transition="scale-transition"
        />          
      </v-list-item>

      <v-divider dark inset></v-divider>

      <v-list
        nav
        class="mt-10"
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          dark
          link
          :to="item.to"
          active-class="sidebar-active-link"
          class="sidebar-link"
          @click="page = item.title"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        absolute
        color="rgb(3 91 98)"
        dark
        flat
        src="https://picsum.photos/1920/1080?random"
        fade-img-on-scroll
        class="top-bar"
      >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-chip
        class="ma-2"
        color="secondary"
        large
      >
        <v-toolbar-title class="ml-4" color="black">{{ balance }} tokens</v-toolbar-title>
        <v-btn
          icon
          color="#fff18a"
          class="ml-2"
          @click="getBalance"
          :loading="loadBalance"
        >
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-chip>

      <v-chip
        class="ma-2"
        color="secondary"
        large
      >
        <v-toolbar-title class="ml-4" color="black">Platform Balance: ₹ {{ currencyBalance }}</v-toolbar-title>
        <v-btn
          icon
          color="#fff18a"
          class="ml-2"
          @click="getCurrencyBalance"
          :loading="currencyLoad"
        >
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-chip>

      <v-spacer></v-spacer>

      <v-btn @click="logout">
        <v-icon>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-app-bar>

    <v-fade-transition name="loggedIn" mode="out-in">
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
</template>

<script>
import general from '../mixins/general'
import Web3 from "web3"
import Token from "../contracts/Token.json"

export default {
  name: 'LoggedIn',
  mixins: [general],
  data () {
    return {
      storeCurrency: 0,
      snack: {
        color: 'primary',
        show: false,
        message: '',
      },
      items: [],
      right: null,
      page: 'Dashboard',
      account: '',
      contract: '',
      balance: 0,
      loadBalance: false,
      currencyBalance: 0,
      currencyLoad: false,
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
    async getBalance() {
      this.loadBalance = true
      await this.getContract().balanceOf(this.getAccount()).call()
      .then((res) => {
        this.balance = res
        this.loadBalance = false
      })
      .catch(() => {
        this.loadBalance = false
      })
    },
    async getCurrencyBalance() {
      this.currencyLoad = true
      await this.$http.post(this.$url + 'get-balance', {
        email: this.getUser().email
      })
      .then((res) => {
        this.currencyBalance = res.data.currencyBalance
        this.currencyLoad = false
        this.updateCurrencyBalance(res.data.currencyBalance)
      })
      .catch(() => {
        this.currencyLoad = false
      })
    },
    loadData() {
      let d = this.getUser()
      if(d.role === 'Developer') {
        this.items = [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/u/dashboard' },
          { title: 'Add Property', icon: 'mdi-bank-plus', to: '/u/add-property' },
          { title: 'My Properties', icon: 'mdi-home-city', to: '/u/my-properties' },
        ]
      } else {
        this.items = [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/u/dashboard' },
          { title: 'Open Properties', icon: 'mdi-bank-plus', to: '/u/open-properties' },
          { title: 'My Investments', icon: 'mdi-home-city', to: '/u/my-investments' },
        ]
      }
    },
    async loadWeb3() {
      //for ethereum browser
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        //for legacy browsers
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        //for invalid response
      } else {
        window.alert("Non-ethereum browser detected");
      }
    },
    async loadBlockchainData() {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts(); //load accounts
      this.account = accounts[0] //setting account => store a/c in state obj. in react

      window.ethereum.on(
        "accountsChanged",
        async function () {
          // Time to reload your interface with accounts[0]!
          const accounts = await web3.eth.getAccounts(); //load accounts
          this.account = accounts[0] //setting account => store a/c in state obj. in react
          this.updateAccount(this.account)
          await this.getBalance()
        }.bind(this)
      );

      this.updateAccount(this.account)
      //loading contracts
      const networkId = await web3.eth.net.getId();
      const networkData = Token.networks[networkId];

      if (networkData) {
        const abi = Token.abi;
        const address = networkData.address;
        const contract = new web3.eth.Contract(abi, address);
        this.contract = contract //this.setState({ contract}) //ES6
        this.updateContract(contract.methods)
        await this.getBalance()
      } else {
        window.alert("Smart contract not deployed to detected network");
      }
    },
    logout() {
      this.updateUser({})
      this.updateAccount('')
      this.updateContract({})
      this.$router.push('/login')
    }
  },
  computed: {
    getCurrency() {
      return this.balance*this.$tokenRatio
    }
  },
  mounted() {
    this.loadData()
    this.loadWeb3()
    this.loadBlockchainData()
    this.getCurrencyBalance()
  }
}
</script>

<style>
#logged-in {
  padding: 0;
}

.top-bar {
  margin-left: 16rem;
}

.sidebar-link {
  font-size: 1.4rem !important;
}
.sidebar-active-link {
  color: #c1e1ff !important;
  background-color: #026276;
}
</style>