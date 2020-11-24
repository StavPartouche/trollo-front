import Vue from 'vue'
import Vuex from 'vuex'

import userStore from '../modules/user-store.js'
import boardStore from '../modules/board-store.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    userStore,
    boardStore
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
})
