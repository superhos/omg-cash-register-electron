import {
  app,
  BrowserWindow,
  autoUpdater,
  dialog
} from 'electron' // eslint-disable-line
const isDev = require('electron-is-dev');
// const {ipcMain} = require('electron')

require('../services/socket-server')
const print = require('../services/print')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ?
  'http://localhost:9080' :
  `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 700,
    // useContentSize: true,
    width: 1000,
    // fullscreen: true
    show: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#2e2c29'
  });

  // print.init(mainWindow)
  // print.print("Text sent to printer.\nText sent to printer.\nText sent to printer.\nText sent to printer.")

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (!isDev && false) {
    // 检查更新
    const server = 'https://omg-release.chenhaotaishuaile.com'
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`

    autoUpdater.setFeedURL(feed)

    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, 60000)

    autoUpdater.on('checking-for-update', () => {
      const dialogOpts = {
        type: 'info',
        title: '打擾一下',
        message: '正在檢測是否有新版本'
      }

      dialog.showMessageBox(dialogOpts)
    })

    autoUpdater.on('update-available', () => {
      const dialogOpts = {
        type: 'info',
        title: '打擾一下',
        message: '有一個可用更新'
      }

      dialog.showMessageBox(dialogOpts)
    })

    autoUpdater.on('update-not-available', () => {
      const dialogOpts = {
        type: 'info',
        title: '打擾一下',
        message: '暫時沒有可用更新'
      }

      dialog.showMessageBox(dialogOpts)
    })

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
      }

      dialog.showMessageBox(dialogOpts, (response) => {
        if (response === 0) autoUpdater.quitAndInstall()
      })
    })

    autoUpdater.on('error', message => {
      console.error('There was a problem updating the application')
      console.error(message)
    })
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */