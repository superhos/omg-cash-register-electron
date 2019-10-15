<template>
  <div id="app">
    <router-view></router-view>
    <div>
      <webview ref="printWebview" :src="fname" nodeintegration/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'app',
  data () {
    return {
      fname: 'file://' + __dirname + '/print.html'
    }
  },
  mounted() {
    const user = this.$api.User.current();
    this.$store.dispatch('updateUser', user);

    //渲染线程主动发送getPrinterList事件到主线程请求打印机列表
    ipcRenderer.send('getPrinterList'); 
    
    //监听主线程获取到打印机列表后的回调
    ipcRenderer.once('getPrinterList', (event, data) => {
      //data就是打印机列表
      // this.printList = data;
      console.log(data)
    });

    //当vue节点渲染完成后，获取<webview>节点
    const webview = this.$refs.printWebview;
    
    //监听<webview>里面的消息，也就是监听print.html里面的ipcRenderer.sendToHost发送的事件，当该事件发送成功后就会进入下面的回调事件中执行打印操作。
    webview.addEventListener('ipc-message', (event) => {
      if (event.channel === 'webview-print-do') {
        //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
        webview.print(
          {
            //是否是静默打印
            silent: true,
            printBackground: true,
            //打印机的名称，就是本文一开始获得的打印机列表其中一个
            deviceName: 'e0_g__f_3e_0',
          },
          (data) => {
            //这个回调是打印后的回调事件，data为true就是打印成功，为false就打印失败
            console.log('webview success', data);
          },
        );
      }
    });
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
