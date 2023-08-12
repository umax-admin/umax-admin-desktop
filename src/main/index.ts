


import { app, BrowserWindow, shell, ipcMain } from 'electron';

import MenuBuilder from './menu';

let mainWindow: BrowserWindow | null = null;

mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // icon: getAssetPath('icon.png'),

});

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


const menuBuilder = new MenuBuilder(mainWindow);
menuBuilder.buildMenu();


ipcMain.on("ipc-umax",(event,args)=>{

    shell.openExternal("https://www.baidu.com")

})
ipcMain.handle("ipc-umax",(event,args)=>{
    shell.openExternal("https://www.baidu.com")
    return new Date()
})
getBrowserWindowRuntime().webContents.openDevTools();
