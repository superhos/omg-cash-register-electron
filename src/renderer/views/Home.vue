<template>
  <div class="home">
    <el-container>
      <el-header class="header" style="display:none">
        <span>OMG 收银系统</span>
        <div class="control">
            <ul>
              <li>{{currentTime}}</li>
              <li>操作员: {{user ? (user.get('real_name') || user.get('username')) : ''}}</li>
              <li @click="reload"><i class="el-icon-refresh"></i></li>
            </ul>
        </div>
      </el-header>
    </el-container>
    <el-container>
      <el-aside class="omg_aside">
        <BarCode />
        <CartList />
      </el-aside>
      <el-main style="min-height: 625px; width: 50vw;">
        <Holding />
        <PriceDisplay />
        <Keyboard />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import BarCode from '@/components/barcode.vue';
import CartList from '@/components/cart-list.vue';
import PriceDisplay from '@/components/price-display.vue';
import Keyboard from '@/components/keyboard.vue';
import Login from '@/components/login.vue';
import Holding from '@/components/holding.vue';
import { mapState } from 'vuex';
import moment from 'moment';
// @ is an alias to /src
export default {
  name: 'home',
  components: {
    BarCode,
    CartList,
    PriceDisplay,
    Keyboard,
    Login,
    Holding,
  },
  data() {
    return {
      currentTime: '',
    };
  },
  computed: mapState({
    isLogin: state => state.CashRegister.user && state.CashRegister.useruser.get('level') >= 2,
    user: state => state.CashRegister.user,
  }),
  mounted() {
    this.currentTime = moment(new Date().getTime()).format('MM-DD HH:mm');
    this.updateTime();
  },
  methods: {
    updateTime() {
      setTimeout(() => {
        this.currentTime = moment(new Date().getTime()).format('MM-DD HH:mm');
        this.updateTime();
      }, 60000);
    },
    reload() {
      this.$router.push('/')
      // window.location.reload();
    },
  },
};
</script>

<style lang="scss">
@import "../style/common.scss";

body {
  background: #fbfbfb;
}

.home {
  position: relative;

  .el-main {
    padding: 0 0 0 20px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .omg_aside {
    width: 50vw!important;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .hold_zone {
    width: 100vw;
    height: 40px;
    line-height: 40px;
    padding: 0px 4vw;
    box-sizing: border-box;
    margin-top: -10px;
    margin-bottom: 7px;
  }
}

.header {
  background: $main-color;
  color: #FFF;
  text-align: left;
  font-size: 25px;
  line-height: 55px;
  height: 45px;
  margin-bottom:15px;
  display: flex;
  justify-content: space-between;

  .control {
    font-size: 15px;
    line-height: 30px;

    ul {
      list-style: none;
      display: flex;
      padding: 0;
      margin: 0;
      line-height: 60px;

      li {
        margin: 0 15px;
        cursor: pointer;
        padding: 0 5px;
        min-width: 50px;
        box-sizing: border-box;
        text-align: center;
      }

      li:hover {
        background: #187ac3;
      }
    }
  }
}
</style>

