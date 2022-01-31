const { app, BrowserWindow, globalShortcut, Tray, Menu, screen } = require('electron')
const path = require('path')

const WebSocket = require('ws');

const wss = new WebSocket.WebSocketServer({ port: 4141 });

wss.on('connection', function connection(ws) {
    //console.log(ws);
});

var tray = null
function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    console.log(width);
    const win = new BrowserWindow({
        width: 350,
        height: 1024,
        x: width - 350,
        y: 0,
        skipTaskbar: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        alwaysOnTop: true,
        frame: false,
        icon: "./icon.png",
        transparent: true
    })

    var displayStatus = false

    win.setIgnoreMouseEvents(true)
    const ret_open = globalShortcut.register('CommandOrControl+F12', () => {
        win.setIgnoreMouseEvents(false)
        if (displayStatus) return
        //win.webContents.send('show', 1);
        console.log(wss.clients);
        wss.clients.forEach(function each(client) {
            client.send("show");
        });
        displayStatus = true
    })
    const ret_close = globalShortcut.register('CommandOrControl+F11', () => {
        if (!displayStatus) return
        //win.webContents.send('hide', 0);
        wss.clients.forEach(function each(client) {

            client.send("hidden");

        });
        displayStatus = false
        win.setIgnoreMouseEvents(true)
    })

    win.loadFile('index.html')
    tray = new Tray('./icon.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '開發工具', type: "checkbox", click(e) {
                if (e.checked)
                    win.webContents.openDevTools()
                else win.webContents.closeDevTools()

            }
        },
        { type: "separator" },
        {
            label: '結束', click() {
                app.quit();
            }
        }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    createWindow()
})

// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit()
// })