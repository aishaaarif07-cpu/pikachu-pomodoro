const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store').default;
const store = new Store();

let win;
let splash;

function createWindow() {
    // Load last position or default
    let lastBounds = store.get('windowBounds') || { width: 300, height: 300, x: 100, y: 50 };

    // Create the main window (hidden for now)
    win = new BrowserWindow({
        width: lastBounds.width,
        height: lastBounds.height,
        x: lastBounds.x,
        y: lastBounds.y,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        show: false, // hidden until splash finishes
        icon: path.join(__dirname, 'assets', 'pikachu-icon.ico'), // <-- your app icon
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile('index.html');

    // Save window position and size on move/resize
    win.on('move', saveBounds);
    win.on('resize', saveBounds);

    function saveBounds() {
        store.set('windowBounds', win.getBounds());
    }

    // Create splash screen
    splash = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: false,
        icon: path.join(__dirname, 'assets', 'pikachu-icon.ico'), // <-- splash screen icon too
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    splash.loadFile('splash.html');

    // Close splash after 1.5 seconds and show main window
    setTimeout(() => {
        splash.close();
        win.show();
    }, 1500);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});