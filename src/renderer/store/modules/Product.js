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
    productCount: 0,
    localProductList: []
}

const mutations = {
    updateCount (state, count) { 
        state.productCount = count
    },
    updateLocalProductList (state, list) {
        state.localProductList = list
    }
}

const actions = {
    updateCount ({commit}, count) {
        console.log('try me')
        commit('updateCount', count)
    },
    async updateProductList({ commit }, res) {
        // const Product = Parse.Object.extend('Product');
        // const query = new Parse.Query(Product);
        // const res = await query.find();
        // await storageSet('PRODUCT_LIST', res)
        commit('updateLocalProductList', res)
    },
}

export default {
    state,
    mutations,
    actions,
  };