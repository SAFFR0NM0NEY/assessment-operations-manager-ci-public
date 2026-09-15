import { browserAppConfigSchema } from '../schemas/appConfig';
import { APP_ENVIRONMENT_LABELS, type BrowserAppConfig } from '../types/appConfig';

const rawBrowserAppConfig = {
  appEnvironment: import.meta.env.VITE_APP_ENV,
  appVersion: import.meta.env.VITE_APP_VERSION,
  statusLabel: import.meta.env.VITE_APP_STATUS_LABEL,
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
};

type RawBrowserAppConfig = typeof rawBrowserAppConfig;

export function parseBrowserAppConfig(rawConfig: RawBrowserAppConfig): BrowserAppConfig {
  const parsed = browserAppConfigSchema.safeParse(rawConfig);

  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Invalid browser application configuration: ${messages}`);
  }

  return {
    ...parsed.data,
    appEnvironmentLabel: APP_ENVIRONMENT_LABELS[parsed.data.appEnvironment],
  };
}

export function getBrowserAppConfig(): BrowserAppConfig {
  return parseBrowserAppConfig(rawBrowserAppConfig);
}

export const browserAppConfig = getBrowserAppConfig();
