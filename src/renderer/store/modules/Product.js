import Parse from 'parse/node'
import { storageSet } from '../../../utils/storageHelper'
import config from '../../../config/config'

Parse.initialize(config.PARSE_KEY);
Parse.serverURL = config.PARSE_SERVER

const state = {
    productCount: 0
}

const mutations = {
    updateCount (state, count) { 
        state.productCount = count
    }
}

const actions = {
    updateCount ({commit}, count) {
        console.log('try me')
        commit('updateCount', count)
    },
    async updateProductList({ commit }) {
        const Product = Parse.Object.extend('Product');
        const query = new Parse.Query(Product);
        const res = await query.find();
        await storageSet('PRODUCT_LIST', res)
        console.log(res)
    },
}

export default {
    state,
    mutations,
    actions,
  };