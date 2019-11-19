const { ipcMain, shell, app, BrowserWindow } = require('electron');

let win;
let isDebug = process.env.SAPINAA_DEBUG !== undefined;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    frame: isDebug
  });

  win.loadFile('reader/dist/main.html');

  if (isDebug) {
    win.webContents.openDevTools();
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);
  shell.openItem(arg);
});
