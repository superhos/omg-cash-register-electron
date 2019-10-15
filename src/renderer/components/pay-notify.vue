<template>
    <div class="mask" v-show="showNotify">
        <webview :src="print_file" style="display:inline-flex; width:48mm;visibility:hidden;"></webview>
        <div class="notify">
            <div class="pay_type">
                <ul @click="changePayType">
                    <li :class="pay_type === 'cash' ? 'current': ''" data-id="cash">現金支付</li>
                    <li :class="pay_type === 'wechatpay' ? 'current': ''" data-id="wechatpay">
                        <img style="height: 28px;" src="../../../static/wechatpay.jpeg" />
                    </li>
                    <li :class="pay_type === 'alipay' ? 'current': ''" data-id="alipay">
                        <img src="../../../static/alipay.jpeg" />
                    </li>
                    <li :class="pay_type === 'mpay' ? 'current': ''" data-id="mpay">
                        <img src="../../../static/mpay.png" />
                    </li>
                    <li :class="pay_type === 'macaupass' ? 'current': ''" data-id="macaupass">
                        <img src="../../../static/macaupass.png" />
                    </li>
                </ul>
            </div>
            <div class="info">
                <i class="el-icon-printer"></i>
                <h2>應收</h2>
                <h1><span>MOP</span> {{amount.toFixed(2)}}</h1>
                <h2>實收</h2>
                <h1><span>MOP</span> {{(+income).toFixed(2)}}</h1>
                <h2>找贖</h2>
                <h1><span>MOP</span> {{(+redemption).toFixed(2)}}</h1>
                <div class="button_group">
                    <el-button :disabled="is_paying" type="success" @click="handleCheckOut">完成結算</el-button>
                    <el-button type="danger" @click="cancel">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { ipcRenderer } from 'electron';
import template from 'lodash/template'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'
const fs = require('fs')

const payMap = {
    'cash': '現金支付',
    'alipay': '支付寶',
    'mpay': 'Mpay',
    'macaupass': '澳門通',
    'wechatpay': '微信支付'
}

export default {
  name: 'PayNotify',
  data () {
      return {
          pay_type: 'cash',
          is_paying: false,
          print_file: __dirname + '/../print.html',
          template_file:  __dirname + '/../template.html',
          template: '',
          amountTemp: 0,
          listTemp: 0
      }
  },
  computed: mapState({
    showNotify: state => state.CashRegister.showNotify,
    income: state => state.CashRegister.income,
    redemption: state => state.CashRegister.redemption,
    chain: state => state.Chain.chainList[state.Chain.currentChainKey].id,
    list: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list,
    amount: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list.reduce((red, cur) => red + (cur.count * cur.price), 0),
    user: state => state.CashRegister.user
  }),
  mounted () {
      const templateFile = fs.readFileSync(this.template_file)
      this.template = templateFile.toString()
  },
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
    print () {
        console.log('i am astart to print')
        const webview = document.querySelector('webview')
        const temp = this.template
        const res = {
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            actioner: this.user.id,
            data: this.listTemp.map(e => {
                e.amount = (e.count * e.price).toFixed(2)
                return e
            }),
            amount: this.amountTemp,
            pay_type: payMap[this.pay_type]
        }
        const comp = template(temp)
        const result = comp(res)
        fs.writeFileSync(this.print_file, result)
        webview.reload()
        webview.addEventListener('dom-ready', () => {
            webview.print({
                silent: true,
                printBackground: false
            })
            this.listTemp = []
            this.amountTemp = 0
        })
    },
    handleCheckOut () {
      this.is_paying = true
      this.amountTemp = this.amount
      this.listTemp = cloneDeep(this.list)
      this.$store.dispatch('checkout', {
          pay_type: this.pay_type,
          chain: this.chain,
          callback: () => {
            this.is_paying = false
            this.print()
          }
      });
    },
    changePayType (evt) {
        if (evt.target.nodeName.toLowerCase() === 'li') {
            const pay_type =  evt.target.getAttribute("data-id")
            this.pay_type = pay_type
        }
    }
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
    width: 500px;
    z-index: 99;
    display: flex;

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

    .pay_type {
        background-color: $text-color;
        padding:15px;
        padding-right: 0;
    }

    .pay_type ul {
        flex: 1;
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        margin-right: 15px;

        li {
            background-color: #FFF;
            border: 5px solid transparent;
            border-radius:5px;
            width: 100px;
            height: 40px;
            padding:15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 100px;
                height: inherit;
                pointer-events: none;
            }
        }

        li.current {
            border: 5px solid $main-color;
        }
    }

    .info {
        padding: 15px;
        flex: 2;

        .button_group {
            display: flex;
            flex-direction: row-reverse;

            button {
                display: block;
                width: 48%;
                max-width: 48%;
                min-width: 48%;
                margin-left: 0;
                margin-top: 10px;
            }

            button:last-child {
                margin-right: 2%;
            }
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

