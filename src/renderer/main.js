import Vue from 'vue';

import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import config from '../config/config'
// import 'element-ui/lib/theme-chalk/index.css';
import './style/common.scss'
import Toasted from 'vue-toasted';
import Parse from 'parse/node';
import VueTouchKeyboard from 'vue-touch-keyboard';
import 'vue-touch-keyboard/dist/vue-touch-keyboard.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Vue.use(VueTouchKeyboard);
Vue.use(ElementUI);

Vue.use(Toasted);
Parse.initialize(config.PARSE_KEY);
// Parse.initialize('OMG_SERVER');
// Parse.initialize(constant.APP_ID, constant.MASTER_KEY)
// javascriptKey is required only if you have it on server.
// Parse.serverURL = constant.SERVER_URI
// Parse.serverURL = 'http://localhost:1337/parse'
Parse.serverURL = config.PARSE_SERVER //'http://192.168.8.150:1337/parse';
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
