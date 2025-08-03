const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent('<h1>✅ Electron works!</h1>'));
});
