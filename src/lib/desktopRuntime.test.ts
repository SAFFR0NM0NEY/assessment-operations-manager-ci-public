import { describe, expect, it } from 'vitest';

import {
  getAomDesktopRuntime,
  getPreferredRouterMode,
  isAomDesktopRuntime,
  type AomDesktopRuntime,
} from './desktopRuntime';

describe('desktop runtime detection', () => {
  it('uses browser routing when the Electron preload marker is absent', () => {
    expect(getAomDesktopRuntime({})).toBeNull();
    expect(isAomDesktopRuntime({})).toBe(false);
    expect(getPreferredRouterMode({})).toBe('browser');
  });

  it('uses hash routing when the controlled Electron preload marker is present', () => {
    const runtime: AomDesktopRuntime = {
      isDesktop: true,
      platform: 'win32',
    };

    expect(getAomDesktopRuntime({ aomDesktop: runtime })).toEqual(runtime);
    expect(isAomDesktopRuntime({ aomDesktop: runtime })).toBe(true);
    expect(getPreferredRouterMode({ aomDesktop: runtime })).toBe('hash');
  });

  it('normalizes unexpected platform strings without trusting user-agent parsing', () => {
    const runtime = {
      isDesktop: true,
      platform: 'unexpected-os',
    } as const;

    expect(getAomDesktopRuntime({ aomDesktop: runtime })).toEqual({
      isDesktop: true,
      platform: 'unknown',
    });
    expect(getPreferredRouterMode({ aomDesktop: runtime })).toBe('hash');
  });
});
