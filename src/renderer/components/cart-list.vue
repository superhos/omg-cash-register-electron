<template>
    <div class="cart-list">
        <div class="small-mask" v-show="currentMode === 1">
            結算后或取消后進入下一單
        </div>
          <el-table
            :data="cartList"
            border
            cell-class-name="cell"
            style="width: 100%; height: 100%; overflow: auto;">
            <el-table-column
            prop="id"
            label="商品名"
            min-width="150">
            <template slot-scope="scope">
                <strong class="item">{{ scope.row.title }}</strong>
                <p class="item">淨含量: {{ scope.row.size }}{{ scope.row.unit }}</p>
                <p class="item">{{ scope.row.bar_code }}</p>
            </template>
            </el-table-column>
            <el-table-column
            prop="count"
            min-width="100"
            label="数量">
                <template slot-scope="scope">
                    <el-input-number @focus="show($event, scope.row.id)" data-layout="numeric" size="mini" v-model="scope.row.count" :min="1" label="数量"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column
            prop="price"
            label="单价">
            <template slot-scope="scope">
                <span>{{scope.row.price.toFixed(2)}}</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="count"
            label="合计">
            <template slot-scope="scope">
                <span>{{(scope.row.count * scope.row.price).toFixed(2)}}</span>
            </template>
            </el-table-column>
            <el-table-column
            width="60"
            label="操作">
            <template slot-scope="scope">
                <el-button type="danger" @click.native.prevent="deleteRow(scope.$index)" icon="el-icon-delete" size="mini"></el-button>
            </template>
            </el-table-column>
        </el-table>
        <vue-touch-keyboard :style="keyboard_style" :options="options" v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" />
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CartList',
  data() {
    return {
      visible: false,
      layout: {
          _meta: {
            "backspace": { func: "backspace", classes: "control"},
            "accept": { func: "accept", text: "確認", classes: "control featured"},
            "next": { func: "next", text: "Next", classes: "control featured"},
            "zero": { key: "0"}
          },

          default: [
            "1 2 3",
            "4 5 6",
            "7 8 9",
            "{zero} {backspace} {accept}"
          ]
      },
      input: null,
      inputId: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
      keyboard_style: {
        position: 'fixed',
        top: '130px',
        left: '270px',
        zIndex: 9,
        width: '220px',
        height: '280px',
      },
    };
  },
  computed: mapState({
    cartList: state => state.CashRegister.cartList[state.CashRegister.currentOrder].list,
    currentMode: state => state.CashRegister.currentMode,
  }),
  methods: {
    accept(count) {
      const prod = this.cartList.find(e => e.id === this.inputId);
      prod.count = +count;
      this.input = null;
      this.inputId = null;
      this.hide();
    },
    show(e, id) {
      this.input = e.target;
      this.inputId = id;
      const rect = e.target.getBoundingClientRect();
      this.keyboard_style = {
        ...this.keyboard_style,
        left: `${rect.x + rect.width + 10}px`,
        top: `${rect.y - 80}px`,
      };
      if (!this.visible) { this.visible = true; }
    },
    hide() {
      this.visible = false;
    },
    deleteRow(indx) {
      console.log('bar_code', indx);
      this.$store.dispatch('removeProduct', this.cartList[indx].id);
    },
  },
};
</script>

<style lang="scss">
.el-table--enable-row-transition .el-table__body td {border:0;}
.el-input-number--mini {width:98px;}
.cart-list {
    background: #FFF;
    border-radius: 5px;
    height:100%;
    overflow: scroll;
    position: relative;

    strong.item {
        font-size: 15px;
    }

    p.item {
        padding: 0;
        margin: 0;
    }

    .count {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background: #FFF;
        border-top: 1px solid #F3F3F3;
    }

    .el-input-number--mini {
        width: 80px!important;
    }

    .el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase {
        width: 17px!important;
    }
    
    .el-input-number--mini .el-input__inner {
        padding-left: 20px;
        padding-right: 20px;
    }


  .el-table--enable-row-transition .el-table__body td {
    border-bottom: 1px solid #dedede!important;
  }

  .el-table tbody td:last-child {
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    border-radius: 0;
    text-align: center;

    button {
      width: 50px;
      height: 50px;
      border-radius: 0;
    }
  }
}
</style>

