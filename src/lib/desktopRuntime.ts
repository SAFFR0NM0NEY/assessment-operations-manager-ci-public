export type AomDesktopPlatform =
  | 'aix'
  | 'cygwin'
  | 'darwin'
  | 'freebsd'
  | 'linux'
  | 'netbsd'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'unknown';

export interface AomDesktopRuntime {
  readonly isDesktop: true;
  readonly platform: AomDesktopPlatform;
}

export type AppRouterMode = 'browser' | 'hash';

interface DesktopRuntimeSource {
  readonly aomDesktop?: {
    readonly isDesktop?: boolean;
    readonly platform?: string;
  };
}

const knownPlatforms = new Set<AomDesktopPlatform>([
  'aix',
  'cygwin',
  'darwin',
  'freebsd',
  'linux',
  'netbsd',
  'openbsd',
  'sunos',
  'win32',
]);

function getWindowRuntimeSource(): DesktopRuntimeSource | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window;
}

function normalizePlatform(platform: string): AomDesktopPlatform {
  return knownPlatforms.has(platform as AomDesktopPlatform)
    ? (platform as AomDesktopPlatform)
    : 'unknown';
}

export function getAomDesktopRuntime(
  source: DesktopRuntimeSource | undefined = getWindowRuntimeSource(),
): AomDesktopRuntime | null {
  const runtime = source?.aomDesktop;

  if (runtime?.isDesktop !== true) {
    return null;
  }

  return {
    isDesktop: true,
    platform: normalizePlatform(runtime.platform ?? 'unknown'),
  };
}

export function isAomDesktopRuntime(source?: DesktopRuntimeSource) {
  return getAomDesktopRuntime(source) !== null;
}

export function getPreferredRouterMode(source?: DesktopRuntimeSource): AppRouterMode {
  return isAomDesktopRuntime(source) ? 'hash' : 'browser';
}
