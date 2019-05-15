<template>
    <div class="mask" v-show="showNotify">
        <div class="notify">
            <div class="info">
                <i class="el-icon-printer"></i>
                <h2>應收</h2>
                <h1><span>MOP</span> {{amount.toFixed(2)}}</h1>
                <h2>實收</h2>
                <h1><span>MOP</span> {{(+income).toFixed(2)}}</h1>
                <h2>找贖</h2>
                <h1><span>MOP</span> {{(+redemption).toFixed(2)}}</h1>
                <el-button type="success" @click="handleCheckOut">完成結算</el-button>
                <el-button type="danger" @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PayNotify',
  computed: mapState({
    showNotify: state => state.CashRegister.showNotify,
    income: state => state.CashRegister.income,
    redemption: state => state.CashRegister.redemption,
    amount: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list.reduce((red, cur) => red + (cur.count * cur.price), 0),
  }),
  methods: {
    cancel() {
      this.$store.dispatch('triggerNotify', false);
      // this.$store.dispatch('triggerMode', 1)
      // this.$toasted.show("訂單取消", {
      //     theme: "outline",
      //     icon: "check",
      //     className: "toast",
      //     position: "top-center",
      //     duration : 5000
      // })
    },
    handleCheckOut() {
      this.$store.dispatch('checkout');
    },
  },
};
</script>

<style lang="scss">
@import "../style/common.scss";

.mask {
    background: rgba(0,0,0,.7);
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 98;
}

.notify {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #FFF;
    width: 300px;
    border: 1px solid #ddd;
    padding: 15px;
    z-index: 99;

    h1, h2 {
        padding: 0;
        margin: 0;
    }

    h2 {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 100;
        color: #242424;
    }

    h1 {
        margin-bottom: 10px;

        span {
            font-weight: 100;
        }
    }

    .info {
        button {
            display: block;
            width: 100%;
            margin-left: 0;
            margin-top: 10px;
        }

        i {
            font-size: 80px;
            color: #FFF;
            background: rgb(56, 197, 56);
            border-radius: 80px;
            padding: 30px;
        }
    }
}
</style>

