import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

contextBridge.exposeInMainWorld('electronAPI', {
  callElectronFunction: (data) => ipcRenderer.invoke('FuncOn', data),
  getPrinters: (data) => ipcRenderer.invoke('getPrinters', data),
  printOrder: (printer_name, data, isIp, printer_ip) =>
    ipcRenderer.invoke('printOrder', printer_name, data, isIp, printer_ip),
  checkPrinter: (printer_name, isIp, printer_ip) =>
    ipcRenderer.invoke('checkPrinter', printer_name, isIp, printer_ip),
  printOrderWithHtmlString: (printer_name, data) =>
    ipcRenderer.invoke('printOrderWithHtmlString', data, printer_name)
})

// contextBridge.exposeInMainWorld('ipcRenderer', {
//   send: (channel, data) => {
//     ipcRenderer.send(channel, data);
//   },
//   on: (channel, func) => {
//     ipcRenderer.on(channel, (event, ...args) => func(...args));
//   },
//   removeAllListeners: (channel) => {
//     ipcRenderer.removeAllListeners(channel);
//   },
// })

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
