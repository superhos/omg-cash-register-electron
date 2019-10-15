<template>
  <div id="content">
    <div class="login">
      <div class="head">
        <h1>O M G</h1>
      </div>
      <div class="center">
        <!-- <div class="desp">
      歡迎使用OMG收銀系統，請先登錄
        </div>-->
        <el-form label-position="right" label-width="0">
          <el-form-item>
            <input
              ref="username"
              style="width: 330px"
              @focus="show($event, 'username')"
              data-layout="compact"
              v-model="username"
              placeholder="員工編號"
            >
          </el-form-item>
          <el-form-item>
            <input
              ref="password"
              style="width: 330px"
              type="password"
              @focus="show($event, 'password')"
              v-model="password"
              placeholder="密碼"
            >
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
    <div class="footer">
      <div class="content">
        Copyright ©️ 2019
        <a href="https://www.chenhaotaishuaile.com">OMG技術部</a> 出品
      </div>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script>
import Parse from "parse/node";
import { to } from "../../utils/parseHelper";

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
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
        left: "calc(50vw - 300px)",
        zIndex: 9,
        width: "600px"
      }
    };
  },
  methods: {
    accept(text) {
      this.hide();
    },

    show(e, type) {
      this.input =
        type === "username" ? this.$refs.username : this.$refs.password; // e.target;
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

        this.$store.dispatch("updateUser", currentUser);
        if (currentUser) {
          this.$toasted.show("登錄成功", {
            theme: "outline",
            icon: "check",
            className: "toast",
            position: "top-center",
            duration: 3000
          });
          setTimeout(() => {
            this.$router.push("/home");
          }, 0);
        }
      } catch (err) {
        this.$toasted.show(err, {
          theme: "outline",
          icon: "close",
          className: "toast",
          position: "top-center",
          duration: 3000
        });
        if (err.code === 100) {
          this.$router.push("/");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/common.scss";

// .bg {
//   position: relative;
//   width: 100vw;
//   height: 100vh;
//   background: $main-color;
// }

// .login {

//   form input {
//     color: $text-color;
//     border: 0;
//     padding: 5px 10px;
//     outline: 0;
//     height: 30px;
//     line-height: 30px;
//     border-bottom: 1px solid #ccc;
//     font-size: 18px;
//   }

//   form .el-form-item__content {
//     margin-left: 0!important;
//   }

//   form button {
//     border-radius: 50px;
//     width: 100%;
//     transition: all 1s;
//     height: 40px;
//     font-size: 15px;
//     cursor: pointer;
//     margin-top: 24px;
//     outline: 0;
//     box-sizing: border-box;
//     background-color: #FFF;
//     border: 1px solid $main-color;
//     color: $main-color;
//   }

//   form button:hover {
//     color: #FFF;
//     background-color: $main-color;
//     border: 1px solid $main-color;
//   }
// }

.login_mask {
  background: $main-color;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 98;
}

.head {
  margin-top: 100px;
  //   background-color:#000;
  width: 100%;
  color: #fff;
  text-align: center;
  height: 150px;
  line-height: 220px;
  box-sizing: border-box;
  h1 {
    margin: 0;
    padding: 0;
    text-align: center;
    width: 100%;
  }
}

.center {
  padding: 15px 0 0;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}

.center input {
  border: 0 !important;
  // border-bottom:1px solid rgb(218, 218, 218)!important;
  // border-radius: 0;
  background: #fff;
  opacity: 0.6;
  width: 330px;
  height: 40px;
  border-radius: 5px;
  outline: 0;
  padding: 0 10px;
  font-size: 18px;
}

.center button {
  width: 330px;
  background: transparent;
  margin-top: 10px;
  color: #fff;
  border: 0;
  border-bottom: 1px solid #fff;
  border-radius: 0;
  font-size: 18px;
  padding: 10px 0;
  opacity: 0.6;
  cursor: pointer;
}

.center button:focus,
.center button:hover {
  background: $main-color;
  color: #fff;
  outline: 0;
}

.center input:-webkit-autofill {
  box-shadow: 0 0 0 1000px #fff inset;
  opacity: 0.6;
}

#content {
  -webkit-app-region: drag;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid #000;
  background: url(../../../static/bg.png) 100% 100%;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  .bg {
    width: 100%;
    height: 100%;
    background: -webkit-linear-gradient(top, #1d1d1d, #000);
    filter: blur(20px);
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .login {
    width: 100%;
    text-align: center;
    height: auto;
    margin: 0 auto;
    position: absolute;
    z-index: 2;
  }

  .footer {
    position: absolute;
    bottom: 0;
    color: #fff;
    width: 100%;
    padding-bottom: 5px;
    text-align: center;
    .content {
      margin: 0 auto;
      width: 100%;
      font-size: 13px;
      text-align: center;
      a {
        color: #fff;
      }
    }
  }
}
</style>
