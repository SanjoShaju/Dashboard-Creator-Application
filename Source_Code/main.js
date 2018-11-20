// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, win2


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, frame: false})

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // to make the window appear only when it is fully loaded
  mainWindow.once("ready-to-show",()=>{mainWindow.show()})
  mainWindow.setMenu(null)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Listen for async message from renderer process
// This creates a call to create chart dialog box is called
ipcMain.on('createChartDialog', (event, arg) => {  
  if(arg==1){
  
    win = new BrowserWindow({width: 600, height: 600, frame: false})
    win.loadFile('src/tools_tab.html')
    win.on('closed', () => {
      win = null
    })
    win.setMenu(null);
    win.show();
    win.setResizable(false)
  }
});

// This creates a call to create open_new dialog box is called
ipcMain.on('createOpenNewDialog', (event, arg) => {  
  if(arg==1){
  
    win2 = new BrowserWindow({width: 600, height: 400, frame: false})
    win2.loadFile('src/open_new.html')
    win2.on('closed', () => {
      win2 = null
    })
    win2.setMenu(null);
    win2.show();
    win2.setResizable(false)
  }
});

ipcMain.on('sentData', (event, arg) => {
  mainWindow.webContents.send('gotData', arg );
});

ipcMain.on('open_dashboard', (event, arg) => {  
  mainWindow.webContents.send('open_dashboard', arg );
});
