import moment from 'moment'
import { getConfig } from '../../../config/config'
import Vue from 'vue'

let config
getConfig().then((conf) => config = conf)

String.prototype.change = function (index, target) {
  if (index >= this.length) return this.toString() + target
  let pre = this.substring(0, index)
  let back = this.substring(index + 1)
  return pre + target + back
}

const state = {
  currentMode: 0, // 0 为扫货物模式 1为结账模式 2為最後模式
  currentOrder: 0, // 實現掛單
  cartList: [{
    id: +new Date(),
    time: moment(new Date()).format('HH:mm'),
    list: [],
  }],
  income: 0,
  redemption: (0).toFixed(2),
  mopMode: false,
  showNotify: false,
  user: null,
};

const mutations = {
  updateUser(state, user) {
    state.user = user;
  },
  updateCurrentOrder(state, key) {
    state.currentOrder = key;
  },
  addProduct(state, product) {
    let prod = state.cartList[state.currentOrder].list.find(e => e.bar_code === product.bar_code);
    if (!prod) {
      prod = {
        id: product.id || product.ObjectId,
        bar_code: product.bar_code || product.get('bar_code'),
        title: product.title || product.get('title'),
        size: product.size || product.get('size'),
        unit: product.unit || product.get('unit'),
        price: +product.price || +product.get('price'),
        count: 1,
      };
      state.cartList[state.currentOrder].list = [
        prod,
        ...state.cartList[state.currentOrder].list
      ]
    } else {
      prod.count++;
    }
    // state.cartList[state.currentOrder] = [
    //   ...state.cartList[state.currentOrder],

    // ]
  },
  removeProduct(state, id) {
    const idx = state.cartList[state.currentOrder].list.findIndex(e => e.id === id);
    state.cartList[state.currentOrder].list.splice(idx, 1);
  },
  incomeGet(state, payload) {
    console.log(payload)
    state.income = payload.income;
    state.mopMode = payload.mopMode;
    const amount = state.cartList[state.currentOrder].list.reduce((red, cur) => red + (cur.count * cur.price), 0);
    state.redemption = (payload.income - amount).toFixed(2) < 0 ? (0).toFixed(2) : (payload.income - amount).toFixed(2);
  },
  triggerNotify(state, isShow) {
    state.showNotify = isShow;
  },
  triggerMode(state, mode) {
    state.currentMode = mode;
    if (mode === 0) {
      state.income = 0;
      state.redemption = (0).toFixed(2);
      state.mopMode = 0;
    }
  },
  addOrder(state) {
    state.income = 0;
    state.redemption = (0).toFixed(2);
    state.mopMode = 0;
    state.cartList.push({
      id: +new Date(),
      time: moment(new Date()).format('HH:mm'),
      list: [],
    });
    state.currentOrder = state.cartList.length - 1;
  },
  cancelOrder(state) {
    const id = state.cartList[state.currentOrder].id;
    const ind = state.cartList.findIndex(e => e.id === id);
    const list = state.cartList;
    list.splice(ind, 1);
    state.cartList = list;
    if (state.cartList.length === 0) {
      state.income = 0;
      state.redemption = (0).toFixed(2);
      state.mopMode = 0;
      state.cartList.push({
        id: +new Date(),
        time: moment(new Date()).format('HH:mm'),
        list: [],
      });
    }
    state.currentOrder = state.cartList.length - 1;
  },
};

const actions = {
  updateUser({ commit }, user) {
    commit('updateUser', user);
  },
  addProduct(context, product) {
    context.commit('addProduct', product);
  },
  removeProduct(context, code) {
    context.commit('removeProduct', code);
  },
  triggerNotify({ commit }, isShow) {
    commit('triggerNotify', isShow);
  },
  triggerMode({ commit }, mode) {
    commit('triggerMode', mode);
  },
  checkout({ dispatch, commit, state }, payload) {
    // 發送相應訂單信息到服務端
    fetch(config.ORDER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'x-session-token': state.user.get('sessionToken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products: state.cartList[state.currentOrder].list.map(e => ({
          id: e.id,
          count: e.count,
        })),
        pay_type: payload.pay_type || 'cash',
        chain: payload.chain,
      }),
    }).then(res => res.json())
      .then((res) => {
        Vue.toasted.show('完成結算', {
          theme: 'outline',
          icon: 'check',
          className: 'toast',
          position: 'top-center',
          duration: 3000,
        });
        commit('cancelOrder');
        dispatch('triggerNotify', false);
        dispatch('triggerMode', 0);
        if (payload.callback) payload.callback()
      });
    // 調用打印機打印單
  },
  incomeGet({ commit, state }, income) {
    // 逐個數輸入
    let cur = state.income;
    
    let mopMode = state.mopMode;
    if (mopMode < 0) {
      mopMode = 0;
    }
    if (!isNaN(income) && income !== '00') {
      if (+income > 10) {
        cur = income.toString();
        mopMode = income.toString().split('0').length - 1; // +income //income.toString().split('0').length - 1
      } else {
        cur = cur.toString().change(((cur.length || 1) - mopMode), income);
        mopMode--;
      }
    } else {
      switch (income) {
        case '00': cur += `${income}`; mopMode -= 2; break;
        case '.': cur += `${income}`; mopMode--; break;
        case '刪除': cur = cur.toString().substring(0, cur.toString().length - 1); mopMode--; break;
        case '清空': cur = 0; mopMode = 0; break;
        default: cur = 0; break;
      }
    }

    if (+cur > 99999) {
      cur = '99999';
    }
    commit('incomeGet', {
      income: cur,
      mopMode,
    });
  },
  incomeSet({ commit }, income) {
    const mopMode = 0
    console.log(income)
    console.log({
      income,
      mopMode,
    })
    commit('incomeGet', {
      income,
      mopMode,
    });
    
  }
};

export default {
  state,
  mutations,
  actions,
};
