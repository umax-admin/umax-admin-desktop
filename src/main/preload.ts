import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('$api', {
    getPlatform: async () => {
        return await ipcRenderer.invoke('getPlatform');
    },
});


export type Channels = 'ipc-umax'

const electronHandler = {
    ipcRenderer:{
        sendMessage(channel: Channels, args: unknown[]) {
            console.log(111)
            const  result =  ipcRenderer.invoke(channel,args)
            ipcRenderer.send(channel, args);

            return result
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
            const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
                func(...args);
            ipcRenderer.on(channel, subscription);
            console.log(222)
            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel: Channels, func: (...args: unknown[]) => void) {
            console.log(3333)
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
}
}

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;