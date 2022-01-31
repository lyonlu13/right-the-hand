const path = require('path');
const builder = require('electron-builder');

builder.build({

    projectDir: path.resolve(__dirname),  // 專案路徑 

    win: ['portable'],  // nsis . portable
    config: {
        "appId": "com.lyonCraft.electron.note-bulks",
        "productName": "Note Bulks",
        "directories": {
            "output": "build/win"
        },
        "win": {
            "icon": path.resolve(__dirname, 'icon.png'),
        }
    },
})
    .then(
        data => console.log(data),
        err => console.error(err)
    );