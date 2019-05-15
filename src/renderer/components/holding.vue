<template>
    <div class="holding">
        <el-tag @click="changeOrder(i)" v-for="(item, i) in cartList" :key="i" :type="currentOrder === i ? 'success': 'info'">單時間：{{item.time}}</el-tag>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Holding',
  computed: mapState({
    cartList: state => state.CashRegister.cartList,
    currentOrder: state => state.CashRegister.currentOrder
  }),
  methods: {
    changeOrder(key) {
      if (key === this.currentOrder) return;
      this.$store.commit('updateCurrentOrder', key);
    },
  },
};
</script>

<style lang="scss">
.holding {
    text-align: left;

  .el-tag {
    cursor: pointer;
    width: 20%;
    min-width: 20%;
    max-width: 20%;
  }

  .el-tag--success {
    background-color: #1c9aa0;
    border: 0;
    border-radius: 0;
    color: #FFF;
  }

  .el-tag--info {
    background-color: rgba(144, 147, 153, 0.1);
    border: 0;
    color: #1c9aa0;
    border-radius: 0;
  }
}
</style>