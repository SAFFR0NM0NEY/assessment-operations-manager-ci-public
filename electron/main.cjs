const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PRODUCT_NAME = 'Assessment Operations Manager';
const DEVELOPMENT_RENDERER_URL = process.env.AOM_DESKTOP_DEV_SERVER_URL ?? 'http://127.0.0.1:5174';

let mainWindow = null;
let packagedIndexUrl = null;

function getPackagedIndexPath() {
  return path.join(__dirname, '..', 'dist', 'index.html');
}

function getAllowedDevOrigin() {
  return new URL(DEVELOPMENT_RENDERER_URL).origin;
}

function isSafeExternalUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
  } catch {
    return false;
  }
}

function isAllowedAppNavigation(url) {
  try {
    const parsedUrl = new URL(url);

    if (!app.isPackaged) {
      return parsedUrl.origin === getAllowedDevOrigin();
    }

    return packagedIndexUrl !== null && parsedUrl.href.startsWith(packagedIndexUrl);
  } catch {
    return false;
  }
}

async function openExternalUrl(url) {
  if (!isSafeExternalUrl(url)) {
    return;
  }

  await shell.openExternal(url);
}

function configureNavigationSecurity(window) {
  window.webContents.setWindowOpenHandler(({ url }) => {
    void openExternalUrl(url);
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    if (isAllowedAppNavigation(url)) {
      return;
    }

    event.preventDefault();
    void openExternalUrl(url);
  });
}

async function loadRenderer(window) {
  if (!app.isPackaged) {
    await window.loadURL(DEVELOPMENT_RENDERER_URL);
    return;
  }

  const indexPath = getPackagedIndexPath();
  packagedIndexUrl = pathToFileURL(indexPath).href;
  await window.loadFile(indexPath);
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: PRODUCT_NAME,
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#f7f8fb',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  configureNavigationSecurity(mainWindow);
  await loadRenderer(mainWindow);
}

app.setName(PRODUCT_NAME);

app.whenReady().then(async () => {
  await createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
