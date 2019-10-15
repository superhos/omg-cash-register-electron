import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
// import config from '../config/config'

// import 'element-ui/lib/theme-chalk/index.css';
import './style/common.scss'
import Toasted from 'vue-toasted';
import Parse from 'parse/node';
import VueTouchKeyboard from 'vue-touch-keyboard';
import 'vue-touch-keyboard/dist/vue-touch-keyboard.css'
import { storageGet, storageSet } from '../utils/storageHelper'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Vue.use(VueTouchKeyboard);
Vue.use(ElementUI);

Vue.use(Toasted);

// server setting
// 获取服务器列表
storageGet('SERVER_LIST_PROD').then((serverList) => {
  
  if (!serverList || !Array.isArray(serverList)) {
    const list = [
      {
        used: true,
        title: 'omg-prod',
        ORDER_SERVICE_URL: 'https://omg-central.chenhaotaishuaile.com/order',
        PARSE_SERVER: 'https://omg-api.chenhaotaishuaile.com/parse',
        PARSE_KEY: 'OMG_SERVER'
      },
      {
        used: false,
        title: 'local',
        ORDER_SERVICE_URL: 'http://localhost:5000/order',
        PARSE_SERVER: 'http://localhost:1337/parse',
        PARSE_KEY: 'OMG_SERVER'
      },
      {
        used: false,
        title: 'local-dev',
        ORDER_SERVICE_URL: 'http://192.168.8.150:5000/order',
        PARSE_SERVER: 'http://192.168.8.150:1337/parse',
        PARSE_KEY: 'OMG_SERVER'
      },
    ]
    storageSet('SERVER_LIST_PROD', list)
    window.location.reload()
  }

  const config = serverList.find(e => e.used)
  
  Parse.initialize(config.PARSE_KEY)
  Parse.serverURL = config.PARSE_SERVER 
  
  //'http://192.168.8.150:1337/parse';
  Vue.api = Vue.prototype.$api = Parse;
  // Vue.db = Vue.prototype.$db = ParseHelper;

  Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted(el) {
    // 聚焦元素
      el.focus();
    },
  });

  /* eslint-disable no-new */
  new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
  }).$mount('#app');
})