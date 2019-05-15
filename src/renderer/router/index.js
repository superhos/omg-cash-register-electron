import Vue from 'vue';
import Router from 'vue-router';
import store from '../store'

Vue.use(Router);


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'check',
      component: require('@/views/Check').default,
    },
    {
      path: '/home',
      name: 'home',
      component: require('@/views/Home').default,
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/views/Login').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login') {
    next()
  } else {
    if (!store.state.CashRegister.user || !store.state.CashRegister.user.get || store.state.CashRegister.user.get('level') < 2) {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

export default router