const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  console.log('Electron app is ready');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,  // Do not allow Node.js integration in the renderer process
      contextIsolation: true,  // Enable context isolation for security
      preload: path.join(__dirname, 'preload.js'),  // Optional: Preload script for additional setup
    },
  });

  const startURL = `file://${path.join(__dirname, 'build', 'index.html')}`;
  console.log('Electron is loading:', startURL);
  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Electron window finished loading');
  });
});
