const { app, BrowserWindow } = require('electron')

let win
let isDebug = process.env.SAPINAA_DEBUG !== undefined

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: isDebug
  })

  win.loadFile('ui/main.html')

  if (isDebug) {
    win.webContents.openDevTools()
  }

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
