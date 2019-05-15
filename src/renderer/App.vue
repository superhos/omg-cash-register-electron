<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  mounted() {
    const user = this.$api.User.current();
    this.$store.dispatch('updateUser', user);
  },
};
</script>

<style lang="scss">
@import "./style/common.scss";

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fl {
  float:left;
}

.fr {
  float:right;
}

.clearfix:after {
  content: ' ';
  visibility: hidden;
  height: 1;
  clear: both;
  display: table;
}

.vcenter {
  display: flex;
  align-items: center;
}

.primary {
  background: $main-color;
  border: 0;
  color: #fFF;
  padding: 8px 10px;
  border-radius: 50px;
}

.small-mask {
  background: rgba(0,0,0,.5);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-weight: 700;
  font-size: 30px;
  z-index:95;
}

.toast {
  width: auto!important;
  height: 50px!important;
  background: rgba(0,0,0,.8)!important;
  color: #FFF!important;
  font-size: 20px!important;

  i {
    font-size: 30px!important;
    display:block!important;
  }
}

.toast.outline {
  border-radius: 100px!important;
  border: 0!important;
}
</style>
