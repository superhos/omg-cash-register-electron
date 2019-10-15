<template>
    <div class="check">
        <div class="center">
          <el-progress :text-inside="true" :stroke-width="18" 
            :percentage="progress" color="#1c9aa0" 
            status="success"></el-progress>
          <span style="margin-top: 10px;">{{msg}}</span>
          <ul class="SERVER_LIST_PROD">
            <li class="head">服務器列表</li>
            <li :key="item.title" v-for="(item, key) in serverList" :class="item.used ?'selected': ''" @click="changeServer(key)">
              <i v-show="item.used" class="el-icon-check"></i>
              <i v-show="!item.used" class="el-icon-thumb"></i> {{item.title}}
            </li>
            <li @click="showForm = true" >
              <i class="el-icon-plus"></i>
              添加服務器
            </li>
          </ul>
        </div>
        <el-dialog title="新增服務器" :visible.sync="showForm">
          <el-form :model="form">
            <el-form-item label="服務器名稱" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="中心服務器地址" :label-width="formLabelWidth">
              <el-input v-model="form.ORDER_SERVICE_URL" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="數據服務器地址" :label-width="formLabelWidth">
              <el-input v-model="form.PARSE_SERVER" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="數據KEY" :label-width="formLabelWidth">
              <el-input v-model="form.PARSE_KEY" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showForm = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
// import config from '../../config/config'
import { storageGet, storageSet } from '../../utils/storageHelper'
import Parse from 'parse'
import { setTimeout } from 'timers';
import {
  mapState
} from 'vuex'

export default {
  name: 'Check',
  data() {
    return {
      msg: '正在連接數據服務器...',
      progress: 0,
      serverList: [],
      showForm: false,
      form: {},
      formLabelWidth: '120px'
    };
  },
  computed: mapState({
    productCount: state => state.Product.productCount
  }),
  async mounted() {
    // 获取服务器列表
    this.serverList = await storageGet('SERVER_LIST_PROD')
    this.checkNetwork();
  },
  methods: {
    async changeServer (key) {
      this.serverList.forEach(e => {
        e.used = false
      })

      this.serverList[key].used = true
      await storageSet('SERVER_LIST_PROD', this.serverList)
      setTimeout(() => {
        window.location.reload()
      }, 0)
    },
    async save () {
      this.serverList.push(this.form)
      await storageSet('SERVER_LIST_PROD', this.serverList)
      this.showForm = false
    },
    async checkNetwork() {
      const config = this.serverList.find(e => e.used)
      // init Parse
      Parse.initialize(config.PARSE_KEY)
      Parse.serverURL = config.PARSE_SERVER 

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
      let newCount
      try {
        this.progress = 40
        const Product = Parse.Object.extend('Product');
        const query = new Parse.Query(Product);
        newCount = await query.count();
        this.$store.dispatch('updateCount', newCount)
        // oldCount = await storageGet('PRODUCT_COUNT')
        this.progress = 60
      } catch (err) {
        this.msg = '數據服務器連接錯誤(504)';
        return;
      }
      
      this.msg = `服務器連接成功, 如後台商品數據有更新，請進入系統后同步數據`
      // await storageSet('PRODUCT_LIST', res)
      // this.$store.dispatch('updateProductList', res)
      // commit('updateLocalProductList', res)

      // const res = await storageGet('PRODUCT_LIST')
      this.progress = 80
      this.$nextTick(() => {
        this.msg = `系統初始化完畢...`
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
      min-width: 180px;

      .el-progress-bar__outer {
        background-color: $sub-color;
      }

      .SERVER_LIST_PROD {
        display: flex;
        flex-direction: column;
        list-style: none;
        background: #FFF;
        color: $main-color;
        padding: 0;
        margin: 0;
        border: 1px solid $main-color;
        margin-top: 15px;
        text-align: left;

        li.head {
          color: #FFF;
          background: $main-color;
        }

        li {
          border-bottom: 1px solid #fdfdfd;
          cursor: pointer;
          padding-left: 10px;
        }

        li:hover {
          background-color: $main-color;
          color: #FFF;
        }
      }

    }
}
</style>


