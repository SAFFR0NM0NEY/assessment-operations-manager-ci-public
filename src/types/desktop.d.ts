import type { AomDesktopRuntime } from '../lib/desktopRuntime';

declare global {
  interface Window {
    readonly aomDesktop?: AomDesktopRuntime;
  }
}

export {};
