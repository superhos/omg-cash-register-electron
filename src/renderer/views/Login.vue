<template>
<div class="bg">
  <div class="login">
    <div class="logo">
      OMG
    </div>
    <!-- <div class="desp">
      歡迎使用OMG收銀系統，請先登錄
    </div> -->
    <el-form label-position="right" label-width="80px">
      <el-form-item>
        <input ref="username" @focus="show($event, 'username')" data-layout="compact" v-model="username" placeholder="員工編號" />
      </el-form-item>
      <el-form-item>
        <input ref="password" type="password" @focus="show($event, 'password')" v-model="password" placeholder="密碼"/>
      </el-form-item>
      <button @click="login">登錄</button>
    </el-form>
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
</div>
</template>

<script>
import Parse from "parse/node";
import { to } from "../../utils/parseHelper";

export default {
  name: "login",
  data() {
    return {
      username: "staff001",
      password: "123456",
      visible: false,
      layout: "compact",
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      keyboard_style: {
        position: "fixed",
        bottom: "0",
        left: "0",
        transform: 'translate(-25%,70%)',
        zIndex: 9,
        width: "600px",
      }
    };
  },
  methods: {
    accept(text) {
      this.hide();
    },

    show(e, type) {
      this.input = type === 'username' ? 
                  this.$refs.username:
                  this.$refs.password // e.target;
      if (!this.visible) {
        this.visible = true;
      }
    },

    hide() {
      this.visible = false;
    },
    async login() {
      if (this.username.length === 0 || this.password.length === 0) {
        this.$toasted.show("員工號/密碼不能為空", {
          theme: "outline",
          icon: "close",
          className: "toast",
          position: "top-center",
          duration: 3000
        });
      }

      let user;
      try {
        user = await to(Parse.User.logIn(this.username, this.password));
        const currentUser = await Parse.User.current();
        this.$store.dispatch('updateUser', currentUser);
        if (currentUser) {
          this.$toasted.show('登錄成功', {
            theme: 'outline',
            icon: 'check',
            className: 'toast',
            position: 'top-center',
            duration: 3000,
          });
          setTimeout(() => {
            this.$router.push('/home')
          }, 0)
        }
      } catch (err) {
        this.$toasted.show(err, {
          theme: "outline",
          icon: "close",
          className: "toast",
          position: "top-center",
          duration: 3000
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "../style/common.scss";

.bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $main-color;
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  background: #FFF;
  padding: 40px 60px;
  border-radius: 0;
  box-shadow: 1px 1px 24px #dfe0e0;

  .logo {
    font-size: 45px;
    font-weight: 100;
    font-family: unset;
    color: #FFF;
    margin-bottom: 20px;
    background: url('../../../static/bg.jpeg');
    display: none;
  }

  .desp {
    margin: 15px 0;
    font-size: 15px;
    color: $text-color;
  }

  form input {
    color: $text-color;
    border: 0;
    padding: 5px 10px;
    outline: 0;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
    font-size: 18px;
  }

  form .el-form-item__content {
    margin-left: 0!important;
  }

  form button {
    border-radius: 50px;
    width: 100%;
    transition: all 1s;
    height: 40px;
    font-size: 15px;
    cursor: pointer;
    margin-top: 24px;
    outline: 0;
    box-sizing: border-box;
    background-color: #FFF;
    border: 1px solid $main-color;
    color: $main-color;
  }

  form button:hover {
    color: #FFF;
    background-color: $main-color;
    border: 1px solid $main-color;
  }
}

.login_mask {
  background: $main-color;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 98;
}
</style>
