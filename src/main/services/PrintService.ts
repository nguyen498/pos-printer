/* eslint-disable @typescript-eslint/no-explicit-any */
// import { BrowserWindow } from 'electron'
import { PosPrintData, PosPrinter, PosPrintOptions } from 'electron-pos-printer'
import { PrinterTypes, ThermalPrinter } from 'node-thermal-printer'
import { electron } from 'process'

// let printWindow

export const printOrder = async (
  printer_name: string,
  data: any,
  isIp: boolean = false,
  printer_ip: string = ''
): Promise<void> => {
  let printer: ThermalPrinter
  if (isIp) {
    printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${printer_ip}`,
      driver: require(electron ? 'electron-printer' : 'printer')
    })
  } else {
    printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `printer:${printer_name}`,
      driver: require(electron ? 'electron-printer' : 'printer')
    })
  }
  const isConnected = await printer.isPrinterConnected()
  if (isConnected) {
    console.time('total time')
    console.time('generate print')
    printer.add(Buffer.from(data))
    printer.cut()
    printer.openCashDrawer()
    console.timeEnd('generate print')

    try {
      await printer.execute()
      console.timeEnd('total time')
      console.log('Print success.')
    } catch (error) {
      console.error('Print error:', error)
    }
  } else {
    console.log('Kết nối máy in thất bại')
  }
}

export const printOrderWithHtmlString = async (
  printer_name: string,
  htmlString: string
  // isIp: boolean = false,
  // printer_ip: string = ''
): Promise<void> => {
  // let printer: ThermalPrinter
  // if (isIp) {
  //   printer = new ThermalPrinter({
  //     type: PrinterTypes.EPSON,
  //     interface: `tcp://${printer_ip}`,
  //     driver: require(electron ? 'electron-printer' : 'printer')
  //   })
  // } else {
  //   printer = new ThermalPrinter({
  //     type: PrinterTypes.EPSON,
  //     interface: `printer:${printer_name}`,
  //     driver: require(electron ? 'electron-printer' : 'printer')
  //   })
  // }
  // const isConnected = await printer.isPrinterConnected()
  // if (isConnected) {
  //   // printer.add(Buffer.from(htmlString))
  //   // printer.cut()
  //   // printer.openCashDrawer()
  //   console.log("htmlString", htmlString)

  //   try {
  //     await printer.execute()
  //     console.log('Print success.')
  //   } catch (error) {
  //     console.error('Print error:', error)
  //   }
  // } else {
  //   console.log("Kết nối máy in thất bại")
  // }
  console.log('htmlString', htmlString)
  //   const htmlString1: string = `
  //         <h1>111Hóa đơn của bạn 11111</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //          <h1>2222Hóa đơn của bạn22222</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //          <h1>333333Hóa đơn của bạn33333</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //           <h1>44444Hóa đơn của bạn444444</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //           <h1>55555Hóa đơn của bạn555555</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //           <h1>66666Hóa đơn của bạn66666</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $22222</p>
  // <h1>77777Hóa đơn của bạn77777</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //         <h1>88888Hóa đơn của bạn88888</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //         <h1>9999Hóa đơn của bạn9999</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $25</p>
  //         <h1>101010Hóa đơn của bạn111111111</h1>
  //         <p>Sản phẩm 1: $10</p>
  //         <p>Sản phẩm 2: $15</p>
  //         <p>Tổng cộng: $333333</p>
  //   `

  const options: PosPrintOptions = {
    preview: true,
    margin: '0 0 0 0',
    copies: 1,
    printerName: printer_name,
    timeOutPerLine: 10000,
    pageSize: '80mm',
    // pageSize: { width: 80 * 1000, height: 0 }, // Kích thước 80mm x vô hạn (chiều dài tự động)
    silent: true,
    boolean: false
    // pathTemplate: './src/main/print_preview_renderer/index.html'
    // printBackground: true
    // pagesPerSheet: 2
  }

  const data: PosPrintData[] = [
    {
      type: 'html',
      value: htmlString, // file path
      style: {
        width: '100%',
        pageBreakAfter: 'avoid',
        pageBreakBefore: 'avoid',
        pageBreakInside: 'avoid'
      }
      // position of image: 'left' | 'center' | 'right'
      // width: '160px', // width of image in px; default: auto
      // height: '60px' // width of image in px; default: 50 or '50px'
    }
  ]

  // const _data: PosPrintData[] = [
  //   {
  //     type: 'table',
  //     // style the table
  //     style: { border: '1px solid #ddd' },
  //     // list of the columns to be rendered in the table header
  //     tableHeader: ['Animal33333', 'Age33333'],
  //     // multi dimensional array depicting the rows and columns of the table body
  //     tableBody: [
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '4'],
  //       ['Cat', '2'],
  //       ['Dog', '4'],
  //       ['Horse', '12'],
  //       ['Pig', '9999999']
  //     ],
  //     // list of columns to be rendered in the table footer
  //     tableFooter: ['Animal44444', 'Age44444'],
  //     // custom style for the table header
  //     tableHeaderStyle: { color: 'black' },
  //     // custom style for the table body
  //     tableBodyStyle: { border: '0.5px solid #ddd' },
  //     // custom style for the table footer
  //     tableFooterStyle: { color: 'black' }
  //   }
  // ]

  PosPrinter.print(data, options)
    .then(async () => {
      const printer: ThermalPrinter = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: `printer:${printer_name}`,
        driver: require(electron ? 'electron-printer' : 'printer')
      })
      console.log('cut')
      printer.cut()
      await printer.execute()
    })
    .catch((error) => {
      console.error(error)
    })
  // printHTML(htmlString, printer_name)
}

export const checkPrinter = async (
  printer_name: string,
  isIp: boolean = false,
  printer_ip: string = ''
): Promise<boolean> => {
  let printer: ThermalPrinter
  if (isIp) {
    printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${printer_ip}`,
      driver: require(electron ? 'electron-printer' : 'printer')
    })
  } else {
    printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `printer:${printer_name}`,
      driver: require(electron ? 'electron-printer' : 'printer')
    })
  }

  const isConnected = await printer.isPrinterConnected()
  console.log('isConnected', isConnected)
  return isConnected
}

// function createPrintWindow(): void {
//   printWindow = new BrowserWindow({
//     show: false, // Ẩn cửa sổ
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
//         silent: true,
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

// async function printHTML(htmlContent, printerName = '_192_168_50_100'): Promise<void> {
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
//     } catch (error) {
//       console.error('Printing error:', error)
//     }
//   })
// }
