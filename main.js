const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
function createWindow() {
  //Create new window
  mainWindow = new BrowserWindow({
    backgroundColor: "#ffffff",
    icon: "assets/logo.png",
  });
  //Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/dist/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
  Menu.setApplicationMenu(null);
}
app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow == null) {
    createWindow();
  }
});
