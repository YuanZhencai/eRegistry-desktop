import { app, BrowserWindow, ipcMain, session } from 'electron'
const path = require('path')
// import { download } from 'electron-dl'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
     * Initial window options
     */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  // 装载应用的index.html页面
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function download(win, url) {
  win.webContents.session.on('will-download', (event, item, webContents) => {
    // 设置文件存放位置
    console.info('download', item.getFilename())
    const dir = app.getPath('downloads')
    const filePath = path.join(dir, 'sample.zip')
    item.setSavePath(filePath)
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
  win.webContents.downloadURL(url)
}

function onDownload() {
  ipcMain.on('download-item', async(event, { url }) => {
    console.log('download-item', url)
    const win = BrowserWindow.getFocusedWindow()
    download(win, url)
  })
}

function onLogin() {
  ipcMain.on('login', async(event, args) => {
    console.log('login', args.token)
    const token = args.token

    const filter = {
      urls: ['*']
    }

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      const authorization = details.requestHeaders['authorization']
      if (!authorization) {
        details.requestHeaders['authorization'] = `Bearer ${token}`
      }
      callback({ requestHeaders: details.requestHeaders })
    })
  })
}

function onReady() {
  createWindow()
  onDownload()
  onLogin()
}

app.on('ready', onReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
