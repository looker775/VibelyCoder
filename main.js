// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const buildMobile = require('./build-mobile.js'); // ✅ Add mobile build function

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ✅ IPC to trigger mobile build when called from renderer
ipcMain.handle('mobile:build', async () => {
  try {
    console.log("📱 Mobile build requested by renderer...");
    await buildMobile();
    return { success: true, message: "✅ Mobile app pushed to GitHub." };
  } catch (err) {
    console.error("❌ Mobile build failed:", err);
    return { success: false, error: err.message };
  }
});
