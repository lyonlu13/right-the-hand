const {
    app,
    contextBridge,
    ipcRenderer,
    globalShortcut
} = require("electron");

const { clipboard } = require('electron')


window.addEventListener('DOMContentLoaded', () => {
    contextBridge.exposeInMainWorld(
        "api", {
    }
    );
})
console.log(document.getElementsByName("body"));
ipcRenderer.on('show', (event, arg) => {
    console.log("show")
    document.querySelector(".main").classList.add("display")
    document.querySelector("#command-input").focus()
})

ipcRenderer.on('hide', (event, arg) => {
    console.log("hide")
    document.querySelector(".main").classList.remove("display")
    document.querySelector("#command-input").blur()
})

