//const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const path2hash = require("./path2hash");
const product=true;

app.allowRendererProcessReuse = true;
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  if (product) {
    win.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on("require-hash" , (event, index, path) => {
  console.log('Receive require-hash ' + path);
  path2hash.getHash(path, function(hash){
    //event.sender.send('return-hash', index, hash);
    event.sender.send('return-hash', index, hash);
  });
  return;
})
console.log(path2hash.FileStatus.Blank);