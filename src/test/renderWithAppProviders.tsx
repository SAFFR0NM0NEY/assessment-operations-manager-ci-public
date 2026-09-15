import { QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { Session } from '@supabase/supabase-js';
import { type ReactElement, type ReactNode } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router';

import { AuthProvider, type AuthClient } from '../features/auth';
import { AuthorizationProvider, type AuthorizationClient } from '../features/authorization';
import { CampusContextProvider } from '../features/campus-context';
import { createQueryClient } from '../lib/queryClient';
import { createMockAuthClient, createMockSession } from './auth';
import { createMockAuthorizationClient } from './authorization';

type RenderWithAppProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  authClient?: AuthClient;
  authorizationClient?: AuthorizationClient;
  initialEntries?: MemoryRouterProps['initialEntries'];
  initialSession?: Session | null;
  route?: string;
};

export function renderWithAppProviders(
  ui: ReactElement,
  {
    authClient,
    authorizationClient,
    initialEntries,
    initialSession,
    route = '/',
    ...renderOptions
  }: RenderWithAppProvidersOptions = {},
) {
  const queryClient = createQueryClient();
  const startingSession = initialSession === undefined ? createMockSession() : initialSession;
  const authHarness = authClient ?? createMockAuthClient({ session: startingSession }).authClient;
  const authorizationHarness =
    authorizationClient ?? createMockAuthorizationClient().authorizationClient;

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider authClient={authHarness} initialSession={startingSession}>
          <AuthorizationProvider authorizationClient={authorizationHarness}>
            <CampusContextProvider>
              <MemoryRouter initialEntries={initialEntries ?? [route]}>{children}</MemoryRouter>
            </CampusContextProvider>
          </AuthorizationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
