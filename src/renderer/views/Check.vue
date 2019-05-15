<template>
    <div class="check">
        <div class="center">
          <el-progress :text-inside="true" :stroke-width="18" 
            :percentage="progress" color="#2184f6" 
            status="success"></el-progress>
          <span style="margin-top: 10px;">{{msg}}</span>
        </div>
    </div>
</template>

<script>
import config from '../../config/config'
import { storageGet } from '../../utils/storageHelper'
import Parse from 'parse/node'
import { setTimeout } from 'timers';
import {
  mapState
} from 'vuex'

export default {
  name: 'Check',
  data() {
    return {
      msg: '正在連接數據服務器...',
      progress: 0
    };
  },
  computed: mapState({
    productCount: state => state.Product.productCount
  }),
  mounted() {
    this.checkNetwork();
  },
  methods: {
    async checkNetwork() {
      
      this.msg = '正在連接中心服務器...';
      this.progress = 10
      try {
        await this.checkConnection(config.ORDER_SERVICE_URL + '/test');
        this.progress = 30
      } catch (err) {
        this.msg = '中心服務器連接錯誤(504)';
        return;
      }

      // 先测试Parse Server
      try {
        this.progress = 40
        const Product = Parse.Object.extend('Product');
        const query = new Parse.Query(Product);
        const count = await query.count();
        this.$store.dispatch('updateCount', count)
        this.progress = 60
      } catch (err) {
        this.msg = '數據服務器連接錯誤(504)';
        return;
      }

      this.msg = `服務器連接成功,開始同步商品數據...(0 / ${this.productCount})`
      this.$store.dispatch('updateProductList')
      const res = await storageGet('PRODUCT_LIST')
      this.progress = 80
      this.$nextTick(() => {
        this.msg = `數據同步完成...`
        this.progress = 100
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000)
      })
    },
    checkConnection(URL) {
      return new Promise((resolve, reject) => {
        Promise.race([
          fetch(URL),
          new Promise(((resolve, reject) => {
            setTimeout(() => reject(new Error('request timeout')), 3000);
          }))])
          .then((data) => {
            // 请求成功
            resolve();
          }).catch(() => {
            // 请求失败
            reject();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../style/common.scss";

html, body {
   background-color: #FFF; 
}

.check {
    width: 100vw;
    height: 100vh;
    color: $main-color;
    display: flex;
    justify-content: center;
    align-items: center;

    .center {
      display: flex;
      flex-direction: column;

      .el-progress-bar__outer {
        background-color: $sub-color;
      }

    }
}
</style>


