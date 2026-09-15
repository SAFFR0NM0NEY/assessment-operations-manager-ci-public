import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabaseBrowserClient } from '../../lib/supabase/client';
import {
  getCurrentSession,
  signInWithEmailAndPassword,
  signOutOfPrivateSession,
  type AuthClient,
} from './authService';
import { AuthContext, type AuthSessionNotice, type AuthStatus } from './authContext';

interface AuthSnapshot {
  sessionKey: number;
  sessionNotice: AuthSessionNotice;
  session: Session | null;
  status: AuthStatus;
  user: User | null;
}

interface AuthProviderProps {
  authClient?: AuthClient;
  children: ReactNode;
  initialSession?: Session | null;
}

const INITIAL_AUTH_SNAPSHOT: AuthSnapshot = {
  sessionKey: 0,
  sessionNotice: null,
  session: null,
  status: 'initializing',
  user: null,
};

function createAuthSnapshot(
  session: Session | null,
  sessionKey: number,
  sessionNotice: AuthSessionNotice = null,
): AuthSnapshot {
  return {
    sessionKey,
    sessionNotice,
    session,
    status: session ? 'authenticated' : 'unauthenticated',
    user: session?.user ?? null,
  };
}

function getSignedOutNotice({
  hadAuthenticatedSession,
  isManualSignOut,
}: {
  hadAuthenticatedSession: boolean;
  isManualSignOut: boolean;
}): AuthSessionNotice {
  if (isManualSignOut) {
    return 'manual-sign-out';
  }

  return hadAuthenticatedSession ? 'session-ended' : null;
}

function getSessionKeyForValidSession(currentSnapshot: AuthSnapshot, session: Session) {
  if (currentSnapshot.status === 'authenticated' && currentSnapshot.user?.id === session.user.id) {
    return currentSnapshot.sessionKey;
  }

  return currentSnapshot.sessionKey + 1;
}

export function AuthProvider({
  authClient = supabaseBrowserClient.auth,
  children,
  initialSession,
}: AuthProviderProps) {
  const [authSnapshot, setAuthSnapshot] = useState<AuthSnapshot>(() =>
    initialSession === undefined ? INITIAL_AUTH_SNAPSHOT : createAuthSnapshot(initialSession, 1),
  );
  const manualSignOutInFlightRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    if (initialSession === undefined) {
      void getCurrentSession(authClient).then((session) => {
        if (isMounted) {
          setAuthSnapshot((currentSnapshot) =>
            session
              ? createAuthSnapshot(session, getSessionKeyForValidSession(currentSnapshot, session))
              : createAuthSnapshot(null, currentSnapshot.sessionKey + 1),
          );
        }
      });
    }

    const {
      data: { subscription },
    } = authClient.onAuthStateChange((event, session) => {
      if (isMounted) {
        setAuthSnapshot((currentSnapshot) => {
          if (session) {
            return createAuthSnapshot(
              session,
              getSessionKeyForValidSession(currentSnapshot, session),
            );
          }

          if (event === 'SIGNED_OUT') {
            if (currentSnapshot.sessionNotice === 'manual-sign-out') {
              return createAuthSnapshot(null, currentSnapshot.sessionKey + 1, 'manual-sign-out');
            }

            return createAuthSnapshot(
              null,
              currentSnapshot.sessionKey + 1,
              getSignedOutNotice({
                hadAuthenticatedSession: currentSnapshot.status === 'authenticated',
                isManualSignOut: manualSignOutInFlightRef.current,
              }),
            );
          }

          return createAuthSnapshot(null, currentSnapshot.sessionKey + 1);
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [authClient, initialSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const authenticatedSession = await signInWithEmailAndPassword(authClient, email, password);
      setAuthSnapshot((currentSnapshot) =>
        createAuthSnapshot(
          authenticatedSession.session,
          getSessionKeyForValidSession(currentSnapshot, authenticatedSession.session),
        ),
      );
    },
    [authClient],
  );

  const signOut = useCallback(async () => {
    manualSignOutInFlightRef.current = true;

    try {
      await signOutOfPrivateSession(authClient);
      setAuthSnapshot((currentSnapshot) =>
        createAuthSnapshot(null, currentSnapshot.sessionKey + 1, 'manual-sign-out'),
      );
    } catch (error) {
      manualSignOutInFlightRef.current = false;
      throw error;
    }

    manualSignOutInFlightRef.current = false;
  }, [authClient]);

  const contextValue = useMemo(
    () => ({
      ...authSnapshot,
      signIn,
      signOut,
    }),
    [authSnapshot, signIn, signOut],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
