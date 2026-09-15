import type { AuthChangeEvent, AuthError, Session, User } from '@supabase/supabase-js';

export const GENERIC_SIGN_IN_ERROR_MESSAGE =
  'Sign in could not be completed. Check your email and password and try again.';
export const GENERIC_SIGN_OUT_ERROR_MESSAGE = 'Sign out could not be completed. Try again.';

export interface AuthClient {
  getSession: () => Promise<{
    data: {
      session: Session | null;
    };
    error: AuthError | null;
  }>;
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    data: {
      subscription: {
        unsubscribe: () => void;
      };
    };
  };
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<{
    data: {
      session: Session | null;
      user: User | null;
    };
    error: AuthError | null;
  }>;
  signOut: () => Promise<{
    error: AuthError | null;
  }>;
}

export interface AuthenticatedSession {
  session: Session;
  user: User;
}

export class SignInFailedError extends Error {
  constructor() {
    super(GENERIC_SIGN_IN_ERROR_MESSAGE);
    this.name = 'SignInFailedError';
  }
}

export class SignOutFailedError extends Error {
  constructor() {
    super(GENERIC_SIGN_OUT_ERROR_MESSAGE);
    this.name = 'SignOutFailedError';
  }
}

export async function getCurrentSession(authClient: AuthClient): Promise<Session | null> {
  try {
    const { data, error } = await authClient.getSession();

    if (error) {
      return null;
    }

    return data.session;
  } catch {
    return null;
  }
}

export async function signInWithEmailAndPassword(
  authClient: AuthClient,
  email: string,
  password: string,
): Promise<AuthenticatedSession> {
  const { data, error } = await authClient.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    throw new SignInFailedError();
  }

  return {
    session: data.session,
    user: data.user,
  };
}

export async function signOutOfPrivateSession(authClient: AuthClient): Promise<void> {
  const { error } = await authClient.signOut();

  if (error) {
    throw new SignOutFailedError();
  }
}
