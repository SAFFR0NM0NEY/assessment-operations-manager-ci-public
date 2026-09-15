import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import electronPath from 'electron';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const childEnv = {
  ...process.env,
  AOM_DESKTOP_DEV_SERVER_URL: process.env.AOM_DESKTOP_DEV_SERVER_URL ?? 'http://127.0.0.1:5174',
};

delete childEnv.ELECTRON_RUN_AS_NODE;

const electronProcess = spawn(electronPath, [repoRoot], {
  cwd: repoRoot,
  env: childEnv,
  stdio: 'inherit',
  windowsHide: false,
});

electronProcess.on('error', (error) => {
  console.error('Failed to launch Electron:', error);
  process.exit(1);
});

electronProcess.on('exit', (code, signal) => {
  if (signal) {
    console.error(`Electron exited after receiving ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 0);
});
