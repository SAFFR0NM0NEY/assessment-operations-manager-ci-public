import { z } from 'zod';

import { APP_ENVIRONMENTS, PROJECT_STATUS_LABEL } from '../types/appConfig';

export const appEnvironmentSchema = z.preprocess((value) => {
  if (value === 'local-demo') {
    return 'local-development';
  }

  if (value === 'demo') {
    return 'reference';
  }

  return value;
}, z.enum(APP_ENVIRONMENTS));

const supabaseUrlSchema = z
  .string({
    error: 'Supabase URL must not be empty.',
  })
  .trim()
  .min(1, 'Supabase URL must not be empty.')
  .refine(
    (value) => {
      try {
        return new URL(value).protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      message: 'Supabase URL must be a valid HTTPS URL.',
    },
  )
  .default('https://example.supabase.co');

const supabasePublishableKeySchema = z
  .string()
  .trim()
  .min(1, 'Supabase publishable key must not be empty.')
  .refine((value) => !/^sb_secret_/i.test(value), {
    message: 'Supabase publishable key must not be a secret key.',
  })
  .refine((value) => !/service[_-]?role/i.test(value), {
    message: 'Supabase publishable key must not be a service-role key.',
  })
  .default('sb_publishable_local_reference_placeholder');

export const browserAppConfigSchema = z.object({
  appEnvironment: appEnvironmentSchema.default('local-development'),
  appVersion: z
    .string()
    .trim()
    .min(1, 'Application version must not be empty.')
    .default('0.0.0-foundation'),
  statusLabel: z.literal(PROJECT_STATUS_LABEL).default(PROJECT_STATUS_LABEL),
  supabasePublishableKey: supabasePublishableKeySchema,
  supabaseUrl: supabaseUrlSchema,
});
