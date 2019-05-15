<template>
    <div class="login">
        <el-form label-position="right" label-width="80px">
            <el-form-item label="員工編號">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="登錄密碼">
                <el-input type="password" v-model="password"></el-input>
            </el-form-item>
            <el-button @click="login">登錄</el-button>
        </el-form>
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

<style lang="scss">
.login {
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    z-index: 999;
    background: #FFF;
    padding: 30px;
    border-radius: 15px;
}
</style>
