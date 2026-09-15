const { contextBridge } = require('electron');

const desktopRuntime = Object.freeze({
  isDesktop: true,
  platform: process.platform,
});

contextBridge.exposeInMainWorld('aomDesktop', desktopRuntime);
