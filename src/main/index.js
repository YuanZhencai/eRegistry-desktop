import { app, BrowserWindow, ipcMain, session } from 'electron'
import { download } from 'electron-dl'
import checkVersion from './updater'
const path = require('path')
const unusedFilename = require('unused-filename')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, meetingWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
     * Initial window options
     */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1440,
    height: 760,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  // 装载应用的index.html页面
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function onDownload() {
  ipcMain.on('download-item', async(event, { url, directory, filename }) => {
    const win = BrowserWindow.getFocusedWindow()
    const dir = app.getPath(directory)
    const filePath = unusedFilename.sync(path.join(dir, filename))
    const basename = path.basename(filePath)
    const options = {
      directory: dir,
      filename: basename
    }
    const file = {
      name: basename,
      url: url,
      path: null,
      state: null
    }
    download(win, url, options)
      .then(dl => {
        file.state = 'success'
        file.path = dl.getSavePath()
        event.sender.send('download-finish', file)
      })
      .catch((e) => {
        file.state = 'error'
        event.sender.send('download-finish', file)
        console.error(e)
      })
  })
}

function onLogin() {
  ipcMain.on('login', async(event, args) => {
    const token = args.token
    const referrer = args.baseApi

    const filter = {
      urls: ['*']
    }

    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
      if (token) {
        details.requestHeaders.Authorization = `Bearer ${token}`
      }
      if (referrer) {
        details.requestHeaders.Referer = referrer
      }
      callback({ requestHeaders: details.requestHeaders })
    })
  })
}

function onUpdater() {
  checkVersion(mainWindow)
}

function onOpenVideoWindow() {
  ipcMain.on('open-video', async(event, { path }) => {
    if (meetingWindow) {
      meetingWindow.show()
      meetingWindow.focus()
      return meetingWindow
    }
    meetingWindow = new BrowserWindow({
      title: '视频随访',
      width: 980,
      height: 640,
      minWidth: 720,
      minHeight: 450,
      useContentSize: true,
      resizable: true,
      menu: false,
      parent: mainWindow,
      modal: process.platform !== 'darwin',
      show: false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    })

    meetingWindow.on('ready-to-show', () => {
      meetingWindow.show()
      meetingWindow.focus()
    })

    // 窗口关闭后手动让$window为null
    meetingWindow.on('closed', () => {
      meetingWindow = null
    })

    await meetingWindow.loadURL(path ? winURL + path : winURL)
    return meetingWindow
  })
}

function onReady() {
  createWindow()
  onDownload()
  onLogin()
  onUpdater()
  onOpenVideoWindow()
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
