import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { checkPrinter, printOrder, printOrderWithHtmlString } from './services/PrintService'
// import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
// import { electron } from 'process'
// import { type PosPrintData, PosPrinter, type PosPrintOptions } from 'electron-pos-printer'
// import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
// import { electron } from 'process'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
      // partition: 'persist:mySession'
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && import.meta.env['MAIN_VITE_ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(import.meta.env['MAIN_VITE_ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  // }
  ipcMain.handle('FuncOn', async (_event, arg) => {
    console.log('Nhận từ React: ', arg)
    // Xử lý logic và trả về kết quả
    return 'Kết quả từ Electron'
  })

  ipcMain.handle('getPrinters', async () => {
    const printers = await mainWindow.webContents.getPrintersAsync()
    console.log('printers', printers)
    return printers
  })

  ipcMain.handle('printOrder', async (_event, printer_name, data, isIp, printer_ip) => {
    printOrder(printer_name, data, isIp, printer_ip)
  })

  ipcMain.handle('printOrderWithHtmlString', async (_event, htmlString, printer_name) => {
    printOrderWithHtmlString(printer_name, htmlString)
  })

  ipcMain.handle('checkPrinter', async (_event, printer_name, isIp, printer_ip) => {
    return checkPrinter(printer_name, isIp, printer_ip)
  })
}

// let printWindow // Biến để lưu trữ cửa sổ in

// function createPrintWindow(): void {
//   printWindow = new BrowserWindow({
//     show: true, // Ẩn cửa sổ
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   })
// }

// async function printContent(printWindow, printerName): Promise<boolean> {
//   return new Promise((resolve, reject) => {
//     printWindow.webContents.print(
//       {
//         silent: false,
//         deviceName: printerName,
//         printBackground: true,
//         // pageSize: {
//         //   width: 72 * 3.78, // 72mm -> chuyển đổi sang điểm (pixels) (1mm ≈ 3.78px)
//         //   height: 0 // Để height bằng 0 để cho phép chiều dài tự động, hoặc đặt giá trị cụ thể
//         // },
//         margins: {
//           // Có thể tùy chọn cấu hình lề
//           marginType: 'none' // Bỏ lề nếu không cần
//         }
//       },
//       (success) => {
//         if (!success) {
//           // reject(new Error(`In thất bại: ${errorType}`));
//           reject(false)
//         } else {
//           resolve(true)
//         }
//       }
//     )
//   })
// }

// async function printHTML(htmlContent, printerName = '_192_168_50_100'): void {
//   if (!printWindow) {
//     createPrintWindow() // Tạo cửa sổ nếu chưa tồn tại
//   }

//   // Chèn HTML vào cửa sổ
//   printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`)

//   printWindow.webContents.on('did-finish-load', async () => {
//     // In nội dung
//     try {
//       const result: boolean = await printContent(printWindow, printerName)
//       if (result) {
//         const printer: ThermalPrinter = new ThermalPrinter({
//           type: PrinterTypes.EPSON,
//           interface: `printer:${printerName}`,
//           driver: require(electron ? 'electron-printer' : 'printer')
//         })
//         console.log('cut')
//         printer.cut()
//         await printer.execute()
//       }
//     } catch (error) {}
//   })
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // const htmlContent: string = `
  //       <h1>111Hóa đơn của bạn 11111</h1>
  //       <p>Sản phẩm 1: $10</p>
  //       <p>Sản phẩm 2: $15</p>
  //       <p>Tổng cộng: $25</p>
  //        <h1>2222Hóa đơn của bạn22222</h1>
  //       <p>Sản phẩm 1: $10</p>
  //       <p>Sản phẩm 2: $15</p>
  //       <p>Tổng cộng: $25</p>
  //        <h1>333333Hóa đơn của bạn33333</h1>
  //       <p>Sản phẩm 1: $10</p>
  //       <p>Sản phẩm 2: $15</p>
  //       <p>Tổng cộng: $25</p>
  //         <h1>44444Hóa đơn của bạn444444</h1>
  //       <p>Sản phẩm 1: $10</p>
  //       <p>Sản phẩm 2: $15</p>
  //       <p>Tổng cộng: $25</p>
  //         <h1>55555Hóa đơn của bạn555555</h1>
  //       <p>Sản phẩm 1: $10</p>
  //       <p>Sản phẩm 2: $15</p>
  //       <p>Tổng cộng: $25</p>
  //         <h1>66666Hóa đơn của bạn66666</h1>
  //       <p>Sản phẩm 1: $10</p>
  //       <p>Sản phẩm 2: $15</p>
  //       <p>Tổng cộng: $25</p>
  // `

  // const options: PosPrintOptions = {
  //   preview: false,
  //   margin: '0 0 0 0',
  //   copies: 1,
  //   printerName: '_192_168_50_100',
  //   timeOutPerLine: 1000,
  //   pageSize: '80mm',
  //   // pageSize: { width: 80 * 1000, height: 0 } // Kích thước 80mm x vô hạn (chiều dài tự động)
  //   silent: true,
  //   boolean: true,
  //   printBackground: true,
  //   pagesPerSheet:2
  // }

  // const data: PosPrintData[] = [
  //   {
  //     type: 'html',
  //     value: htmlContent, // file path
  //     style: {
  //       width: '100%',
  //       pageBreakAfter: 'avoid',
  //       pageBreakBefore: 'avoid',
  //       pageBreakInside: 'avoid'
  //     }
  //     // position of image: 'left' | 'center' | 'right'
  //     // width: '160px', // width of image in px; default: auto
  //     // height: '60px' // width of image in px; default: 50 or '50px'
  //   }
  // ]

  // PosPrinter.print(data, options).then( async() => {

  //   const printer: ThermalPrinter = new ThermalPrinter({
  //     type: PrinterTypes.EPSON,
  //     interface: `printer:${'_192_168_50_100'}`,
  //     driver: require(electron ? 'electron-printer' : 'printer')
  //   })
  //   console.log('cut')
  //   printer.cut()
  //   await printer.execute()
  // }).catch((error) => {
  //     console.error(error);
  //   });

  // printHTML(htmlContent)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
