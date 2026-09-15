import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { browserAppConfig } from '../appConfig';
import type { BrowserAppConfig } from '../../types/appConfig';
import type { Database } from '../../types/database.generated';

type SupabaseBrowserConfig = Pick<BrowserAppConfig, 'supabasePublishableKey' | 'supabaseUrl'>;

export type SupabaseBrowserClient = SupabaseClient<Database>;

export function createSupabaseBrowserClient(
  config: SupabaseBrowserConfig = browserAppConfig,
): SupabaseBrowserClient {
  return createClient<Database>(config.supabaseUrl, config.supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
    },
  });
}

export const supabaseBrowserClient = createSupabaseBrowserClient();
