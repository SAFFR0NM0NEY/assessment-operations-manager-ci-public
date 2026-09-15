import { describe, expect, it } from 'vitest';

import { parseBrowserAppConfig } from './appConfig';

const VALID_BROWSER_CONFIG = {
  appEnvironment: 'reference',
  appVersion: '0.0.0-foundation',
  statusLabel: 'Personal Skills Development / Reference Build',
  supabasePublishableKey: 'sb_publishable_test_key',
  supabaseUrl: 'https://example.supabase.co',
} as const;
const SECRET_LIKE_TEST_KEY = `sb_${'secret'}_not_for_browser`;
const SERVICE_ROLE_TEST_KEY = `service_${'role'}_not_for_browser`;

describe('browser application configuration', () => {
  it('exposes safe configured project identity values with display metadata', () => {
    const config = parseBrowserAppConfig(VALID_BROWSER_CONFIG);

    expect(config).toMatchObject({
      appEnvironment: 'reference',
      appEnvironmentLabel: 'Reference Build',
      appVersion: '0.0.0-foundation',
      statusLabel: 'Personal Skills Development / Reference Build',
      supabasePublishableKey: 'sb_publishable_test_key',
      supabaseUrl: 'https://example.supabase.co',
    });
  });

  it('uses local-development defaults without requiring secret configuration', () => {
    const config = parseBrowserAppConfig({
      appEnvironment: undefined,
      appVersion: undefined,
      statusLabel: undefined,
      supabasePublishableKey: undefined,
      supabaseUrl: undefined,
    });

    expect(config.appEnvironment).toBe('local-development');
    expect(config.appEnvironmentLabel).toBe('Local Development');
    expect(config.appVersion).toBe('0.0.0-foundation');
    expect(config.statusLabel).toBe('Personal Skills Development / Reference Build');
    expect(config.supabasePublishableKey).toBe('sb_publishable_local_reference_placeholder');
    expect(config.supabaseUrl).toBe('https://example.supabase.co');
  });

  it('fails clearly for unsupported or production-like browser environment values', () => {
    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        appEnvironment: 'production',
      }),
    ).toThrow(/invalid browser application configuration/i);
  });

  it('maps legacy local demo environment values to the new reference labels', () => {
    const config = parseBrowserAppConfig({
      ...VALID_BROWSER_CONFIG,
      appEnvironment: 'local-demo',
    });

    expect(config.appEnvironment).toBe('local-development');
    expect(config.appEnvironmentLabel).toBe('Local Development');
  });

  it('fails clearly when the status label is changed from the required wording', () => {
    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        appEnvironment: 'local-development',
        statusLabel: 'Live system',
      }),
    ).toThrow(/invalid browser application configuration/i);
  });

  it('fails clearly when Supabase browser configuration is empty or not HTTPS', () => {
    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        supabaseUrl: '',
      }),
    ).toThrow(/supabase url must not be empty/i);

    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        supabaseUrl: 'http://example.supabase.co',
      }),
    ).toThrow(/supabase url must be a valid https url/i);

    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        supabasePublishableKey: '',
      }),
    ).toThrow(/supabase publishable key must not be empty/i);
  });

  it('rejects secret-like Supabase keys from browser configuration', () => {
    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        supabasePublishableKey: SECRET_LIKE_TEST_KEY,
      }),
    ).toThrow(/secret key/i);

    expect(() =>
      parseBrowserAppConfig({
        ...VALID_BROWSER_CONFIG,
        supabasePublishableKey: SERVICE_ROLE_TEST_KEY,
      }),
    ).toThrow(/service-role key/i);
  });
});
