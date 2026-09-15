import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '../auth';
import { AuthorizationContext } from './authorizationContext';
import {
  AccountAccessStateLoadError,
  AuthorizationContextLoadError,
  loadAccountAccessState,
  loadAuthorizationContext,
  type AuthorizationClient,
} from './authorizationService';
import {
  EMPTY_ACCOUNT_ACCESS_STATE,
  EMPTY_AUTHORIZATION_CONTEXT,
  authorizationHasPermission,
  type AccountAccessState,
  type AuthorizationContextData,
  type AuthorizationStatus,
  type PermissionKey,
} from './types';

interface AuthorizationSnapshot extends AuthorizationContextData {
  accountAccessState: AccountAccessState;
  authSessionKey: number;
  error: string | null;
  status: AuthorizationStatus;
  userId: string | null;
}

interface AuthorizationProviderProps {
  authorizationClient?: AuthorizationClient;
  children: ReactNode;
}

const INITIAL_AUTHORIZATION_SNAPSHOT: AuthorizationSnapshot = {
  accountAccessState: EMPTY_ACCOUNT_ACCESS_STATE,
  authSessionKey: 0,
  ...EMPTY_AUTHORIZATION_CONTEXT,
  error: null,
  status: 'initializing',
  userId: null,
};

function createAuthorizationSnapshot(
  context: AuthorizationContextData,
  accountAccessState: AccountAccessState,
  authSessionKey: number,
  userId: string,
): AuthorizationSnapshot {
  return {
    accountAccessState,
    authSessionKey,
    ...context,
    error: null,
    status: context.profile ? 'ready' : 'unprovisioned',
    userId,
  };
}

function createAccountAccessSnapshot(
  accountAccessState: AccountAccessState,
  authSessionKey: number,
  status: AuthorizationStatus,
  userId: string,
): AuthorizationSnapshot {
  return {
    accountAccessState,
    authSessionKey,
    ...EMPTY_AUTHORIZATION_CONTEXT,
    error: null,
    status,
    userId,
  };
}

function createFailedClosedSnapshot(
  error: unknown,
  authSessionKey: number,
  userId: string,
): AuthorizationSnapshot {
  const errorMessage =
    error instanceof AccountAccessStateLoadError || error instanceof AuthorizationContextLoadError
      ? error.message
      : 'Authorization context could not be loaded.';

  return {
    accountAccessState: EMPTY_ACCOUNT_ACCESS_STATE,
    authSessionKey,
    ...EMPTY_AUTHORIZATION_CONTEXT,
    error: errorMessage,
    status: 'error',
    userId,
  };
}

export function AuthorizationProvider({
  authorizationClient,
  children,
}: AuthorizationProviderProps) {
  const { sessionKey: authSessionKey, status: authStatus, user } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);
  const [authorizationSnapshot, setAuthorizationSnapshot] = useState<AuthorizationSnapshot>(
    INITIAL_AUTHORIZATION_SNAPSHOT,
  );

  const refreshAuthorization = useCallback(() => {
    setRefreshCount((currentCount) => currentCount + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (authStatus !== 'authenticated' || !user) {
      return () => {
        isMounted = false;
      };
    }

    void loadAccountAccessState(authorizationClient)
      .then(async (accountAccessState) => {
        if (!accountAccessState.profileExists) {
          return createAccountAccessSnapshot(
            accountAccessState,
            authSessionKey,
            'unprovisioned',
            user.id,
          );
        }

        if (accountAccessState.accountStatus !== 'active') {
          return createAccountAccessSnapshot(
            accountAccessState,
            authSessionKey,
            'inactive',
            user.id,
          );
        }

        const context = await loadAuthorizationContext(authorizationClient);

        if (!context.profile) {
          throw new AuthorizationContextLoadError();
        }

        return createAuthorizationSnapshot(context, accountAccessState, authSessionKey, user.id);
      })
      .then((snapshot) => {
        if (isMounted) {
          setAuthorizationSnapshot(snapshot);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setAuthorizationSnapshot(createFailedClosedSnapshot(error, authSessionKey, user.id));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authSessionKey, authStatus, authorizationClient, refreshCount, user]);

  const visibleAuthorizationSnapshot = useMemo<AuthorizationSnapshot>(() => {
    if (authStatus === 'initializing') {
      return INITIAL_AUTHORIZATION_SNAPSHOT;
    }

    if (authStatus !== 'authenticated' || !user) {
      return {
        accountAccessState: EMPTY_ACCOUNT_ACCESS_STATE,
        authSessionKey: 0,
        ...EMPTY_AUTHORIZATION_CONTEXT,
        error: null,
        status: 'unprovisioned',
        userId: null,
      };
    }

    if (
      authorizationSnapshot.userId !== user.id ||
      authorizationSnapshot.authSessionKey !== authSessionKey
    ) {
      return INITIAL_AUTHORIZATION_SNAPSHOT;
    }

    return authorizationSnapshot;
  }, [authSessionKey, authStatus, authorizationSnapshot, user]);

  const hasPermission = useCallback(
    (permissionKey: PermissionKey, campusId?: string | null) =>
      authorizationHasPermission(visibleAuthorizationSnapshot, permissionKey, campusId),
    [visibleAuthorizationSnapshot],
  );

  const contextValue = useMemo(
    () => ({
      ...visibleAuthorizationSnapshot,
      hasPermission,
      refreshAuthorization,
    }),
    [hasPermission, refreshAuthorization, visibleAuthorizationSnapshot],
  );

  return (
    <AuthorizationContext.Provider value={contextValue}>{children}</AuthorizationContext.Provider>
  );
}
