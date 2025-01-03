const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  console.log('Electron app is ready');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  const startURL = `file://${path.join(__dirname, 'build', 'index.html')}`;
  console.log('Electron is loading:', startURL);
  mainWindow.loadURL(startURL);

  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Electron window finished loading');
  });
});
