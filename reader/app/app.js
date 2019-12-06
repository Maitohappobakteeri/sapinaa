const { ipcMain, shell, app, BrowserWindow } = require("electron");
const storage = require("./storage.js");

let win;
let isDebug = process.env.SAPINAA_DEBUG !== undefined;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    frame: isDebug
  });

  win.loadFile("./dist/main.html");

  if (isDebug) {
    win.webContents.openDevTools();
  }

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on("asynchronous-message", (event, arg) => {
  console.log("async message from render thread: ", arg);
  if (arg.action == "open") {
    shell.openItem(arg.url);
  } else if (arg.action == "load") {
    let data = storage.load(arg.name);
    event.reply("asynchronous-reply", {
      action: "load",
      name: arg.name,
      data: data
    });
  } else if (arg.action == "save") {
    storage.save(arg.name, arg.data);
  }
});
