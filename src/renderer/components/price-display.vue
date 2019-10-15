<template>
  <div class="pricedisplay clearfix">
    <div>
      <h1>MOP</h1>
      <h1>{{amount.toFixed(2)}}</h1>
      <span>合計</span>
    </div>
    <!-- <div>
      <h1>MOP 0.00</h1>
      <span>折扣</span>
    </div> -->
    <!-- <div>
      <h1>MOP {{amount.toFixed(2)}}</h1>
      <span>應收</span>
    </div> -->
    <div>
      <h1>MOP</h1>
      <h1>{{(+income).toFixed(2)}}</h1>
      <span>實收</span>
    </div>
    <div>
      <h1>MOP</h1>
      <h1>{{redemption}}</h1>
      <span>找贖</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// const SerialPort = require("serialport").SerialPort;
// const serialPort = new SerialPort("COM2", {
//   baudrate: 115200
// });

export default {
  name: 'PriceDisplay',
  computed: mapState({
    income: state => state.CashRegister.income,
    redemption: state => state.CashRegister.redemption,
    amount: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list.reduce((red, cur) => red + (cur.count * cur.price), 0),
  }),
  watch: {
    // income (newval) {
      // setInterval(function(){
      //   writeAndDrain(newval,callbackFun)
      // },1000);
    // }
  },
  data() {
    return {
    };
  },
  methods: {
    // writeAndDrain: (data) => {
    //     serialPort.write(data, function () {
    //       serialPort.drain(callback);
    //     });
    // },
    // callbackFun: () => {
    //   console.log('callback')
    // }
  }
};
</script>

<style lang="scss">
@import "../style/common.scss";

.pricedisplay {
  border: 0;
    width: 100%;
    height: 140px;
    padding: 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: $main-color;
    color: #fff;
    box-sizing: border-box;

  h1 {
    padding: 0;
    margin: 0;
  }

  div {
      width: 25%;
  }
}
</style>
