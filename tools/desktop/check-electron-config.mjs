import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const filesToSyntaxCheck = [
  'electron/main.cjs',
  'electron/preload.cjs',
  'tools/desktop/run-electron-dev.mjs',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readText(path) {
  return readFileSync(path, 'utf8');
}

for (const file of filesToSyntaxCheck) {
  const result = spawnSync(process.execPath, ['--check', file], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  assert(result.status === 0, `${file} failed syntax validation:\n${result.stderr}`);
}

const packageJson = JSON.parse(readText('package.json'));
const mainProcess = readText('electron/main.cjs');
const preload = readText('electron/preload.cjs');
const electronDevLauncher = readText('tools/desktop/run-electron-dev.mjs');
const builderConfig = readText('electron-builder.yml');

assert(
  packageJson.main === 'electron/main.cjs',
  'package.json must point Electron at electron/main.cjs.',
);
assert(
  packageJson.scripts['dev:electron'] === 'node tools/desktop/run-electron-dev.mjs',
  'dev:electron must use the launcher that clears Node-only Electron mode.',
);
assert(
  mainProcess.includes('contextIsolation: true'),
  'BrowserWindow must enable contextIsolation.',
);
assert(
  mainProcess.includes('nodeIntegration: false'),
  'BrowserWindow must disable nodeIntegration.',
);
assert(mainProcess.includes('sandbox: true'), 'BrowserWindow must enable sandbox.');
assert(mainProcess.includes('webSecurity: true'), 'BrowserWindow must keep webSecurity enabled.');
assert(mainProcess.includes('setWindowOpenHandler'), 'External windows must be intercepted.');
assert(mainProcess.includes('will-navigate'), 'Top-level navigation must be guarded.');
assert(
  mainProcess.includes('http://127.0.0.1:5174'),
  'Electron development URL must use the documented AOM renderer port.',
);
assert(preload.includes("require('electron')"), 'Preload must use Electron contextBridge only.');
assert(preload.includes('contextBridge'), 'Preload must expose metadata through contextBridge.');
assert(preload.includes('aomDesktop'), 'Preload must expose the desktop runtime marker.');
assert(
  electronDevLauncher.includes('delete childEnv.ELECTRON_RUN_AS_NODE'),
  'Electron dev launcher must remove ELECTRON_RUN_AS_NODE before spawning Electron.',
);
assert(
  electronDevLauncher.includes('http://127.0.0.1:5174'),
  'Electron dev launcher must default to the documented renderer port.',
);

const forbiddenPreloadPatterns = [
  /\brequire\(['"]node:fs['"]\)/,
  /\brequire\(['"]fs['"]\)/,
  /\brequire\(['"]node:child_process['"]\)/,
  /\brequire\(['"]child_process['"]\)/,
  /process\.env/,
  /ipcRenderer/,
];

for (const pattern of forbiddenPreloadPatterns) {
  assert(!pattern.test(preload), `Preload contains forbidden privileged surface: ${pattern}`);
}

assert(
  builderConfig.includes('productName: Assessment Operations Manager'),
  'electron-builder must use the Assessment Operations Manager product name.',
);
assert(
  builderConfig.includes('appId: com.assessmentoperationsmanager.desktop'),
  'electron-builder must use the approved appId.',
);
assert(builderConfig.includes('output: release'), 'electron-builder output must go to release/.');
assert(
  builderConfig.includes('target: nsis'),
  'electron-builder must configure the Windows NSIS target.',
);

console.log('Electron desktop configuration checks passed.');
