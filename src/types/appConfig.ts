export const APP_ENVIRONMENTS = ['local-development', 'reference', 'test'] as const;

export const PROJECT_STATUS_LABEL = 'Personal Skills Development / Reference Build';

export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

export const APP_ENVIRONMENT_LABELS: Record<AppEnvironment, string> = {
  'local-development': 'Local Development',
  reference: 'Reference Build',
  test: 'Test Environment',
};

export interface BrowserAppConfig {
  appEnvironment: AppEnvironment;
  appEnvironmentLabel: string;
  appVersion: string;
  statusLabel: typeof PROJECT_STATUS_LABEL;
  supabasePublishableKey: string;
  supabaseUrl: string;
}
