'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs')
const path = require('path')
const {
    ipcMain
} = require('electron')

module.exports = {
  print,
  init
}

let list
function print(text){
  let win = new BrowserWindow({
      show: false,
      webPreferences: {
        webSecurity: false
      }
    })
//   fs.writeFile(path.join(__dirname,'print.html'), text)
  win.loadURL('file://'+__dirname+'/print.html')
  win.webContents.on('did-finish-load', () => {
      list = win.webContents.getPrinters()
      win.webContents.print({
        silent:true,
        printBackground: true,
        //打印机的名称，就是本文一开始获得的打印机列表其中一个
        deviceName: list[0].name,
    })
  })
}

function init (window) {
    ipcMain.on('getPrinterList', (event) => {
        //主线程获取打印机列表
        list = window.webContents.getPrinters();
        
        //通过webContents发送事件到渲染线程，同时将打印机列表也传过去
        window.webContents.send('getPrinterList', list);
    });

    ipcMain.on('printContent', (event, data) => {
        print(data.content)
    })
}