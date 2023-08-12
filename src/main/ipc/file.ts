import {ipcMain, shell} from "electron";

ipcMain.on("file",(event,args)=>{

    shell.openExternal("https://www.baidu.com")

})
ipcMain.handle("file",(event,args)=>{
    shell.openExternal("https://www.baidu.com")
    return new Date()
})