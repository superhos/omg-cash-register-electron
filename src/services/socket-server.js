const {
    ipcMain
} = require('electron')
const detect = require('detect-port')
// const io = require('socket.io')()
// io.on('connection', client => { ... });
// io.listen(3000);
const DEFAULT_PORT = 3030

const WebSocket = require('ws');
let wss

ipcMain.on('START_SCAN_SERVER', async (event, arg) => {
    console.log('Start SCAN server')
    const port = await detect(DEFAULT_PORT)
    wss = new WebSocket.Server({ port })
    wss.on('connection', function connection(ws) {
        // 通知页面
        event.sender.send('CLIENT_CONNECT')

        ws.on('message', function incoming(code) {
          console.log('received: %s', code);
          event.sender.send('SCAN_CODE', {code})
        });
       
        ws.send('{"status":"ok"}');
    });

    console.log(getIPAdress() )
    event.sender.send('SERVER_START_SUCCESS', {
        ip: getIPAdress() + ':' + port
    })
})

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}