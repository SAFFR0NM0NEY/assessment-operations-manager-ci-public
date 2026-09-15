import {
  AuthApiError,
  type AuthChangeEvent,
  type AuthError,
  type Session,
  type User,
} from '@supabase/supabase-js';
import { vi } from 'vitest';

import type { AuthClient } from '../features/auth';

interface CreateMockAuthClientOptions {
  getSessionError?: AuthError | null;
  session?: Session | null;
  signInError?: AuthError | null;
  signInSession?: Session;
  signOutError?: AuthError | null;
}

export function createMockAuthError(message = 'Invalid login credentials'): AuthError {
  return new AuthApiError(message, 400, 'invalid_credentials');
}

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2026-09-01T00:00:00.000Z',
    email: 'reference-auth-smoke@example.invalid',
    id: '00000000-0000-4000-8000-000000000041',
    user_metadata: {},
    ...overrides,
  };
}

export function createMockSession(overrides: Partial<Session> = {}): Session {
  const user = overrides.user ?? createMockUser();

  return {
    access_token: 'test-access-token',
    expires_at: 1788210000,
    expires_in: 3600,
    refresh_token: 'test-refresh-token',
    token_type: 'bearer',
    user,
    ...overrides,
  };
}

export function createMockAuthClient({
  getSessionError = null,
  session = createMockSession(),
  signInError = null,
  signInSession = createMockSession(),
  signOutError = null,
}: CreateMockAuthClientOptions = {}) {
  let authStateCallback: ((event: AuthChangeEvent, session: Session | null) => void) | undefined;

  const authClient: AuthClient = {
    getSession: vi.fn(() =>
      Promise.resolve({
        data: {
          session,
        },
        error: getSessionError,
      }),
    ),
    onAuthStateChange: vi.fn(
      (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        authStateCallback = callback;

        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      },
    ),
    signInWithPassword: vi.fn(() => {
      if (signInError) {
        return Promise.resolve({
          data: {
            session: null,
            user: null,
          },
          error: signInError,
        });
      }

      return Promise.resolve({
        data: {
          session: signInSession,
          user: signInSession.user,
        },
        error: null,
      });
    }),
    signOut: vi.fn(() =>
      Promise.resolve({
        error: signOutError,
      }),
    ),
  };

  return {
    authClient,
    emitAuthStateChange: (event: AuthChangeEvent, nextSession: Session | null) => {
      authStateCallback?.(event, nextSession);
    },
  };
}
