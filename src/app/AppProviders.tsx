import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

import { AuthProvider, type AuthClient } from '../features/auth';
import { AuthorizationProvider, type AuthorizationClient } from '../features/authorization';
import { CampusContextProvider } from '../features/campus-context';
import { createQueryClient } from '../lib/queryClient';

interface AppProvidersProps {
  authClient?: AuthClient;
  authorizationClient?: AuthorizationClient;
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AppProviders({
  authClient,
  authorizationClient,
  children,
  queryClient,
}: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthProvider authClient={authClient}>
        <AuthorizationProvider authorizationClient={authorizationClient}>
          <CampusContextProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </CampusContextProvider>
        </AuthorizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
