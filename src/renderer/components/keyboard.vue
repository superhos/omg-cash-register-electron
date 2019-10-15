<template>
  <div class="keyboard_omg">
    <!-- <div class="small-mask" @click="nextStep" v-show="currentMode === 0">
      掃完商品后點擊
    </div> -->
    <div class="main">
      <table @click="keyClick">
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td style="font-size: 15px;">50</td>
          <td @click="cancelOrder">銷單</td>
        </tr>
        <tr>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td style="font-size: 15px;">100</td>
          <td @click="addOrder">掛單</td>
        </tr>
        <tr>
          <td>7</td>
          <td>8</td>
          <td>9</td>
          <td style="font-size: 15px;">500</td>
          <td>足數</td>
        </tr>
        <tr>
          <td>0</td>
          <td>00</td>
          <td>.</td>
          <td style="font-size: 15px;">1000</td>
          <td></td>
        </tr>
        <tr>
          <td>刪除</td>
          <td>清空</td>
          <td>結算</td>
        </tr>
      </table>
    </div>
    <PayNotify/>
  </div>
</template>

<script>
import PayNotify from '@/components/pay-notify.vue';
import { mapState } from 'vuex';
import { ipcRenderer } from 'electron';
export default {
  name: 'Keyboard',
  components: {
    PayNotify,
  },
  computed: mapState({
    income: state => state.CashRegister.income,
    showNotify: state => state.CashRegister.showNotify,
    currentMode: state => state.CashRegister.currentMode,
    amountProduct: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list.length,
    isLogin: state => state.CashRegister.user && state.CashRegister.user.attributes.sessionToken,
    amount: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list.reduce((red, cur) => red + (cur.count * cur.price), 0),
  }),
  data() {
    return {};
  },
  mounted() {
    // window.addEventListener("keyup", this.foo);
  },
  beforeDestroy() {
    // window.removeEventListener("keyup", this.foo);
  },
  methods: {
    foo(evt) {
      this.handleKeyDown(evt);
    },
    keyClick(evt) {
      if (evt.target && evt.target.tagName === 'TD') {
        if (evt.target.textContent !== '結算') {
          if (evt.target.textContent === '足數') {
            // ipcRenderer.send('printContent', {content:'hahhahahahahahah'})
            this.$store.dispatch('incomeSet', this.amount)
          } else {
            this.$store.dispatch('incomeGet', evt.target.textContent);
          }
        } else {
          if (+this.amountProduct === 0) {
            this.$toasted.show('沒有需要結賬的商品', {
              theme: 'outline',
              icon: 'close',
              className: 'toast',
              position: 'top-center',
              duration: 3000,
            });
            return
          }
          if (+this.income === 0) {
            this.$toasted.show('請錄入實收金額！', {
              theme: 'outline',
              icon: 'close',
              className: 'toast',
              position: 'top-center',
              duration: 5000,
            })
            return
          }
          if (+this.income < +this.amount) {
            this.$toasted.show('支付金額不足', {
              theme: 'outline',
              icon: 'close',
              className: 'toast',
              position: 'top-center',
              duration: 3000,
            })
            return
          }
          this.$store.dispatch('triggerNotify', true)
        }
      }
    },
    cancelOrder() {
      this.$store.commit('cancelOrder');
      this.$store.dispatch('triggerMode', 0);
      this.$toasted.show('訂單取消', {
        theme: 'outline',
        icon: 'close',
        className: 'toast',
        position: 'top-center',
        duration: 3000,
      });
    },
    addOrder() {
      this.$store.commit('addOrder');
      this.$toasted.show('操作成功', {
        theme: 'outline',
        icon: 'check',
        className: 'toast',
        position: 'top-center',
        duration: 3000,
      });
    },
    nextStep() {
      if (this.currentMode === 0) {
        this.$store.dispatch('triggerMode', 1);
      }
    },
    handleKeyDown(evt) {
      return;
      if (!this.isLogin) return;
      if (!isNaN(evt.key)) {
        this.$store.dispatch('incomeGet', +evt.key);
      } else if (evt.key === 'Escape') {
        if (this.showNotify) {
          this.$store.dispatch('triggerNotify', false);
          this.$store.dispatch('triggerMode', 1);
        } else {
          this.$store.dispatch('incomeGet', '清空');
        }
      } else if (evt.key === 'Enter') {
        if (this.currentMode === 0) {
          this.$store.dispatch('triggerMode', 1);
        }
        if (+this.amountProduct === 0) {
          this.$toasted.show('沒有需要結賬的商品', {
            theme: 'outline',
            icon: 'close',
            className: 'toast',
            position: 'top-center',
            duration: 3000,
          });
        }
        if (+this.income === 0) {
          this.$toasted.show('請錄入實收金額！', {
            theme: 'outline',
            icon: 'close',
            className: 'toast',
            position: 'top-center',
            duration: 3000,
          });
        }
        if (+this.income < +this.amount) {
          this.$toasted.show('支付金額不足', {
            theme: 'outline',
            icon: 'close',
            className: 'toast',
            position: 'top-center',
            duration: 3000,
          });
        }
        this.$store.dispatch('triggerNotify', true);
        this.$store.dispatch('triggerMode', 2);
      } else if (evt.key === 'Backspace') {
        this.$store.dispatch('incomeGet', '刪除');
      }
    },
  },
};
</script>

<style lang="scss">
.keyboard_omg {
    background: #fff;
    width: 100%;
    height: calc(100%-140px);
    border: 1px solid #ddd;
    border-top: 0;
    display: flex;
    position: relative;
    flex: 2;

  .order-action {
    width: 27%;
    box-sizing: border-box;
    padding: 15px 0;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        border: 1px solid #ddd;
        background: rgb(102, 102, 102);
        color: #fff;
        border-radius: 50px;
        height: 40px;
        line-height: 40px;
        i {
          margin-right: 5px;
        }
      }
    }
  }

  .main {
    min-width: 450px;
    width: 100%;
  }

  .main table {
    table-layout: fixed;
    width: 100%;
    tr {
      display: flex;
    
      td {
        height: 60px;
        flex: 1;
        font-size: 30px;
        font-weight: 700;
        border: 1px solid #ccc;
        margin: 5px;
        display: inline-block;
        text-align: center;
        line-height: 60px;
        border-radius: 5px;
        box-shadow: 1px 1px 7px #ddd;
        cursor: pointer;
      }

      td:hover {
        background: #eee;
      }

      td:last-child {
        width: 60px;
        font-size: 20px;
        flex:2;
      }
    }

    tr:last-child {
      td {
        width: 80px;
        font-size: 25px;
      }

      td:last-child {
        width: 154px;
      }
    }
  }
}
</style>


