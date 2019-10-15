<template>
  <div class="tool_bar">
    <el-dialog
      title="請使用員工APP掃描二維碼"
      :visible.sync="scanCodeShow"
      width="30%"
      :before-close="handleClose"
    >
      <vue-qrcode :value="scanCode" :options="{ width: 200 }"></vue-qrcode>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <ul>
      <li>員工: {{user.get('real_name') || user.get('username')}}</li>
      <li>
        <el-dropdown trigger="click" @command="changeChain">
          <span class="el-dropdown-link">
            門店：{{currentChain && currentChain.get && currentChain.get('title')}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="key"
              v-for="(item, key) in chainList"
              :key="key"
            >{{item && item.get && item.get('title')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-dropdown trigger="click" @command="changeServer">
          <span class="el-dropdown-link">
            更換服務器
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="key"
              v-for="(item, key) in serverList"
              :key="key"
              :icon="item.used ? 'el-icon-check' : ''"
            >{{item.title}}</el-dropdown-item>
            <el-dropdown-item command="add" key="add" icon="el-icon-plus">增加服務器</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li>
        <el-dropdown trigger="click" @command="action">
          <span class="el-dropdown-link">
            更多
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, key) in tools"
              :command="key"
              :key="key"
              :icon="item.icon ? 'el-icon-' + item.icon : ''"
            >{{item.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
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
const electron = require("electron");
import Parse from 'parse'
import { storageGet, storageSet } from "../../utils/storageHelper";
import { getConfig } from '../../config/config'
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { mapState } from "vuex";
const { ipcRenderer } = require("electron");
import { Loading } from 'element-ui'

export default {
  name: "ToolBar",
  components: {
    VueQrcode
  },
  computed: mapState({
    chainList: state => state.Chain.chainList,
    currentChain: state => state.Chain.chainList[state.Chain.currentChainKey],
    user: state => state.CashRegister.user
  }),
  data() {
    return {
      serverList: [],
      showForm: false,
      scanCodeShow: false,
      scanCode: "",
      isFullScreen: false,
      form: {},
      formLabelWidth: "120px",
      tools: []
    };
  },
  async mounted() {
    this.serverList = await storageGet("SERVER_LIST_PROD");
    this.$store.dispatch("updateChainList");

    let config
    getConfig().then((conf) => {
        config = conf
        Parse.initialize(config.PARSE_KEY);
        Parse.serverURL = config.PARSE_SERVER
    })

    this.tools = [
      {
        title: "同步數據",
        icon: "s-data",
        only_icon: false,
        action: () => this.syncData()
      },
      {
        title: this.isFullScreen ? "退出全屏" : "全屏",
        icon: "full-screen",
        only_icon: false,
        action: () => this.fullscreen()
      },
      {
        title: "使用APP掃碼槍",
        icon: "mobile",
        only_icon: false,
        action: () => this.openScanServer()
      },
      {
        title: "登出",
        icon: "toilet-paper",
        only_icon: false,
        action: () => this.logout()
      }
    ];
  },
  beforeDestroy() {
    ipcRenderer.send("CLOSE_SCAN_SERVER");
  },
  methods: {
    action(key) {
      this.tools[key].action();
    },
    fullscreen() {
      const window = electron.remote.getCurrentWindow();
      if (!this.isFullScreen) {
        window.setFullScreen(true);
      } else {
        window.setFullScreen(false);
        window.setSize(1000, 700, true)
      }
      this.isFullScreen = !this.isFullScreen;
      this.tools.find(e => e.icon === "full-screen").title = this.isFullScreen ? "退出全屏" : "全屏"
    },
    async syncData () {
      console.log('syncData =======》 ');
      let loadingInstance = Loading.service({
        text: '數據同步中，請稍後'
      })
      const Product = Parse.Object.extend('Product');
      const query = new Parse.Query(Product);
      const res = await query.find();
      await storageSet('PRODUCT_LIST', res)
      this.$store.dispatch('updateProductList', res)
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close();
      });
    },
    logout() {
      this.$router.push("/");
    },
    changeChain(key) {
      this.$store.commit("updateCurrentChainKey", key);
    },
    async changeServer(key) {
      if (key === "add") {
        this.showForm = true;
        return;
      }
      this.serverList.forEach(e => {
        e.used = false;
      });

      this.serverList[key].used = true;
      this.$set(this.serverList[key], "used", true);
      await storageSet("SERVER_LIST_PROD", this.serverList);
      setTimeout(() => {
        window.location.reload();
      }, 0);
    },
    async save() {
      this.serverList.push(this.form);
      await storageSet("SERVER_LIST_PROD", this.serverList);
      this.showForm = false;
    },
    openScanServer() {
      if (this.scanCode.length > 0) {
        this.scanCodeShow = true;
        return;
      }

      ipcRenderer.send("START_SCAN_SERVER");
      ipcRenderer.on("SERVER_START_SUCCESS", (event, data) => {
        this.scanCode = data.ip;
        this.scanCodeShow = true;
        this.$toasted.show("SCAN服務開啟成功", {
          theme: "outline",
          icon: "check",
          className: "toast",
          position: "top-center",
          duration: 2000
        });
      });

      ipcRenderer.on("CLIENT_CONNECT", event => {
        // 成功连接
        this.scanCodeShow = false;
        this.$toasted.show("APP端掃碼槍連接成功", {
          theme: "outline",
          icon: "check",
          className: "toast",
          position: "top-center",
          duration: 2000
        });
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style lang="scss">
.tool_bar {
  background: #313131;
  color: #fff;
  width: calc(50vw - 2px);
  height: 40px;
  line-height: 40px;

  ul {
    margin: 0;
    display: flex;
    list-style: none;
    font-size: 15px;
    justify-content: space-between;
    padding: 0;

    li {
      padding: 0 15px;
      cursor: pointer;
      border-left: 1px solid #404040;

      i {
        margin-right: 5px;
      }

      .el-dropdown-link {
        color: #fff;
      }
    }

    li:hover {
      background: #262626;
    }
  }
}
</style>


