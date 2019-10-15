<template>
    <!-- <div class="login">
        <el-form label-position="right" label-width="80px">
            <el-form-item label="員工編號">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="登錄密碼">
                <el-input type="password" v-model="password"></el-input>
            </el-form-item>
            <el-button @click="login">登錄</el-button>
        </el-form>
    </div> -->
  <div id="content">
      <div class="login">
        <div class="head">
        <h1>O M G</h1>
        </div>
        <div class="center">
            <el-form :model="form" status-icon ref="form" label-width="10%" class="demo-ruleForm">
                <el-form-item label="" prop="pass">
                    <el-input type="text" style="width:88%;" placeholder="用戶名" v-model="username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="" prop="pass" style="margin-top:-10px;">
                    <el-input type="password" style="width:88%" placeholder="密碼" v-model="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="padding:0;margin:0;margin-top:-15px;color:red;font-size:13px;">
                    <span style="font-size:13px">{{msg}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button style="" type="primary" @click="login">LOGIN</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    <div class="footer">
        <div class="content">
            Copyright ©️ 2019 <a href="https://www.chenhaotaishuaile.com">OMG技術部</a> 出品
        </div>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const user = await this.$api.User.logIn(this.username, this.password);
        const currentUser = await this.$api.User.current();
        this.$store.dispatch('updateUser', currentUser);
        this.$toasted.show('登錄成功', {
          theme: 'outline',
          icon: 'check',
          className: 'toast',
          position: 'top-center',
          duration: 5000,
        });
      } catch (e) {
        this.$toasted.show(e.messages, {
          theme: 'outline',
          icon: 'check',
          className: 'toast',
          position: 'top-center',
          duration: 5000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// .login {
//     position: absolute;
//     top: 50%;
//     left:50%;
//     transform: translate(-50%,-50%);
//     z-index: 999;
//     background: #FFF;
//     padding: 30px;
//     border-radius: 15px;
// }
* {
  box-sizing: border-box;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  background-color:#FFF;
}

.head{
  margin-top:150px;
//   background-color:#000;
  width:100%;
  color:#FFF;
  text-align: center;
  height: 150px;
  line-height:220px;
  box-sizing: border-box;
    h1 {
        margin:0;
        padding:0;
        text-align: center;
        width:100%;
    }
}

.center{
    padding:15px 0 0;
    box-sizing: border-box;
    text-align: center;
    width:100%;
    .el-form-item__content{
        margin-left:0!important;
    }
}

.center input{
    border:0 !important;
    // border-bottom:1px solid rgb(218, 218, 218)!important;
    // border-radius: 0;
    background: #FFF;
    opacity: .6;
    width: 330px;
}

.center button {
    width: 330px;
    background:transparent;margin-top:10px;color:#FFF;border:0;
    border-bottom:1px solid #FFF;
    border-radius: 0;
    opacity: .6;
}

.center button:focus,.center button:hover{
    outline: 0;
}

.center input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #FFF inset;
    opacity: .6;
}

#content {
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
      width:100%;
      height:100%;
      background: -webkit-linear-gradient(top,#1d1d1d,#000);
      filter: blur(20px);
      opacity: .6;
      position: absolute;
      top:0;
      left:0;
      z-index: 1;
  }
  .login{
      width:100%;
      text-align: center;
      height:auto;
      margin:0 auto;
      position: absolute;
      z-index: 2;
  }

  .footer{
      position: absolute;
      bottom:0;
      color:#FFF;
      width:100%;
      padding-bottom:5px;
      text-align: center;
      .content{
          margin:0 auto;
          width:100%;
          font-size:13px;
          text-align: center;
          a{
              color:#FFF;
          }
      }
  }
}
</style>
