<template>
  <div class="barcode clearfix">
    <div class="vcenter code-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="25"
        height="25"
        viewBox="0 0 512 512"
      >
        <path
          d="M160 32h-128v128h128v-128zM192 0v0 192h-192v-192h192zM64 64h64v64h-64zM480 32h-128v128h128v-128zM512 0v0 192h-192v-192h192zM384 64h64v64h-64zM160 352h-128v128h128v-128zM192 320v0 192h-192v-192h192zM64 384h64v64h-64zM224 0h32v32h-32zM256 32h32v32h-32zM224 64h32v32h-32zM256 96h32v32h-32zM224 128h32v32h-32zM256 160h32v32h-32zM224 192h32v32h-32zM224 256h32v32h-32zM256 288h32v32h-32zM224 320h32v32h-32zM256 352h32v32h-32zM224 384h32v32h-32zM256 416h32v32h-32zM224 448h32v32h-32zM256 480h32v32h-32zM480 256h32v32h-32zM32 256h32v32h-32zM64 224h32v32h-32zM0 224h32v32h-32zM128 224h32v32h-32zM160 256h32v32h-32zM192 224h32v32h-32zM288 256h32v32h-32zM320 224h32v32h-32zM352 256h32v32h-32zM384 224h32v32h-32zM416 256h32v32h-32zM448 224h32v32h-32zM480 320h32v32h-32zM288 320h32v32h-32zM320 288h32v32h-32zM352 320h32v32h-32zM416 320h32v32h-32zM448 288h32v32h-32zM480 384h32v32h-32zM288 384h32v32h-32zM320 352h32v32h-32zM384 352h32v32h-32zM416 384h32v32h-32zM448 352h32v32h-32zM480 448h32v32h-32zM320 416h32v32h-32zM352 448h32v32h-32zM384 416h32v32h-32zM416 448h32v32h-32zM320 480h32v32h-32zM384 480h32v32h-32zM448 480h32v32h-32z"
          fill="#FFF"
        ></path>
      </svg>
    </div>
    <div class="show-code">
      <input ref="code" readonly type="text" clearable v-model="cur_code" v-focus>
    </div>
    <div class="vcenter">
      <el-button type="default" @click="clear" data-layout="numeric">清空</el-button>
      <el-button type="primary" @click="show" data-layout="numeric">鍵盤</el-button>
    </div>
    <vue-touch-keyboard
      :style="keyboard_style"
      :options="options"
      v-if="visible"
      :layout="layout"
      :cancel="hide"
      :accept="accept"
      :input="input"
    />
  </div>
</template>

<script>
import { storageGet } from "../../utils/storageHelper";
const { ipcRenderer } = require('electron')

export default {
  name: "barcode",
  directives: {
    focus: {
      // 指令的定义
      inserted(el) {
        el.focus();
      }
    }
  },
  data() {
    return {
      cur_code: "",
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
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      keyboard_style: {
        position: "fixed",
        top: "130px",
        left: "270px",
        zIndex: 9,
        width: "220px",
        height: "280px"
      },
      localProductList: []
    };
  },
  created () {
    window.removeEventListener("keyup", this.foo, false);
    window.addEventListener("keyup", this.foo, false);
  },
  async mounted () {
    this.localProductList = await storageGet("PRODUCT_LIST")
    // APP掃碼槍
    ipcRenderer.on('SCAN_CODE', (event, data) => {
      console.log('recevie:', data)
        this.cur_code = data.code
        setTimeout(() => {
          this.handleKeyDown({key: 'Enter'})
        })
    })
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.foo, false);
  },
  destroyed(){
    window.removeEventListener('keyup',this.foo,false)
  },
  methods: {
    clear () {
      this.cur_code = ''
    },

    accept(text) {
      // alert("Input text: " + text);
      if (text.length > 0) {
        this.handleKeyDown({
          key: "Enter"
        });
      }
      this.hide();
    },

    show(e) {
      this.input = this.$refs.code; // e.target;
      const rect = e.target.getBoundingClientRect();
      this.keyboard_style = {
        ...this.keyboard_style,
        left: `${rect.x - 50}px`,
        top: `${rect.y + rect.height + 20}px`
      };
      if (!this.visible) {
        this.visible = true;
      }
    },

    hide() {
      this.visible = false;
    },
    foo(evt) {
      this.handleKeyDown(evt);
    },
    async handleKeyDown(evt) {
      if (evt.key === "Enter") {
        // 查找Bar code
        if (this.cur_code.length === 0) return;
        const prod = await this.findProduct();
        if (!prod) {
          this.$toasted.show("商品不存在，請先登記商品", {
            theme: "outline",
            icon: "close",
            className: "toast",
            position: "top-center",
            duration: 2000
          });
          this.cur_code = ''
        } else {
          this.$store.dispatch("addProduct", prod);
          this.cur_code = "";
          this.$refs.code.focus();
        }
      } else {
        this.cur_code += evt.key
      }
    },
    async findProduct() {
      // local check
      if (this.localProductList && this.localProductList.length > 0) {
        return this.findFromLocal();
      }

      const Product = this.$api.Object.extend("Product");
      const query = new this.$api.Query(Product);
      query.equalTo("bar_code", this.cur_code.trim());
      const res = await query.find();
      return res && res[0];
    },
    findFromLocal() {
      console.log(this.localProductList);
        console.log('this.cur_code: ', this.cur_code);
      const res = this.localProductList.find(
        e => {
          console.log(e.bar_code)
          return e.bar_code === this.cur_code.trim()
        }
      );
      console.log(res);
      return res;
    }
  }
};
</script>

<style lang="scss">
.barcode {
    background-color: #424242;
    color: #FFF;
    line-height: 50px;
    height: 50px;
    // padding: 0 0 0 8px;
    display: flex;
    justify-content: space-between;

  .code-icon {
    height: 47px!important;
    width: 40px;
    text-align: center;
    display: flex;
    justify-content: center;
    background-color: #1c9aa0;
  }

  .show-code {
    flex: 2;
    input {
        border: 0;
        font-size: 15px;
        width: 100%;
        text-align: left;
        outline: none;
        background-color: transparent;
        color: #FFF;
        padding-left: 8px;
    }
  }

  .code-icon {
    height: inherit;
  }

  .vcenter button.el-button {
      height: 100%;
      border-radius: 0;
      margin-left: 0;
  }

}

.keyboard {
  min-height: 220px !important;
  height: 220px !important;
  flex-direction: column;
  border: 1px solid #ddd !important;
  border-radius: 5px;
  background: #fff;
  padding: 10px;
  /* border-top: 0; */
}

.vue-touch-keyboard .keyboard .line {
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;
}

.vue-touch-keyboard .keyboard .line:first-child {
  margin-top: 0;
}
.vue-touch-keyboard .keyboard .key {
  width: 40px;
  min-width: 40px;
}

.vue-touch-keyboard .keyboard .key:nth-child(4) {
  margin-right: 0 !important;
}

// .vue-touch-keyboard .keyboard .key.control {
//   margin-top: 15px;
// }
</style>