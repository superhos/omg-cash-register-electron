import Parse from 'parse/node'
import { storageSet } from '../../../utils/storageHelper'
import { getConfig } from '../../../config/config'

let config
getConfig().then((conf) => {
    config = conf
    Parse.initialize(config.PARSE_KEY);
    Parse.serverURL = config.PARSE_SERVER
})


const state = {
    chainList: [],
    currentChainKey: 0,
}

const mutations = {
    updateChainList (state, list) { 
        state.chainList = list
    },
    updateCurrentChainKey (state, key) {
        state.currentChainKey = key
    }
}

const actions = {
    async updateChainList({ commit }) {
        const Chain = Parse.Object.extend('Chain');
        const query = new Parse.Query(Chain);
        const res = await query.find();
        await storageSet('CHAIN_LIST', res)
        commit('updateChainList', res)
    },
}

export default {
    state,
    mutations,
    actions,
  };