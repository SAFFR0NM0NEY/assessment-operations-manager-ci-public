import { describe, expect, it } from 'vitest';

import { createMockAuthClient, createMockAuthError, createMockSession } from '../../test/auth';
import {
  GENERIC_SIGN_IN_ERROR_MESSAGE,
  GENERIC_SIGN_OUT_ERROR_MESSAGE,
  getCurrentSession,
  signInWithEmailAndPassword,
  signOutOfPrivateSession,
} from './authService';

describe('auth service boundary', () => {
  it('restores the current Supabase session without loading profile or role data', async () => {
    const session = createMockSession();
    const { authClient } = createMockAuthClient({ session });

    await expect(getCurrentSession(authClient)).resolves.toBe(session);
  });

  it('returns the authenticated session from email/password sign-in', async () => {
    const signInSession = createMockSession();
    const { authClient } = createMockAuthClient({ signInSession });

    await expect(
      signInWithEmailAndPassword(
        authClient,
        'reference-auth-smoke@example.invalid',
        'test-password',
      ),
    ).resolves.toEqual({
      session: signInSession,
      user: signInSession.user,
    });

    expect(authClient.signInWithPassword).toHaveBeenCalledWith({
      email: 'reference-auth-smoke@example.invalid',
      password: 'test-password',
    });
  });

  it('masks raw Supabase sign-in errors behind the generic login message', async () => {
    const { authClient } = createMockAuthClient({
      signInError: createMockAuthError('Raw provider message that must stay hidden'),
    });

    try {
      await signInWithEmailAndPassword(authClient, 'unknown@example.invalid', 'bad-password');
      throw new Error('Expected sign-in to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(GENERIC_SIGN_IN_ERROR_MESSAGE);
      expect((error as Error).message).not.toMatch(/raw provider message/i);
    }
  });

  it('ends the current private Supabase session through the auth boundary', async () => {
    const { authClient } = createMockAuthClient();

    await expect(signOutOfPrivateSession(authClient)).resolves.toBeUndefined();

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
  });

  it('masks raw Supabase sign-out errors behind the generic sign-out message', async () => {
    const { authClient } = createMockAuthClient({
      signOutError: createMockAuthError('Raw sign-out provider detail'),
    });

    try {
      await signOutOfPrivateSession(authClient);
      throw new Error('Expected sign-out to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(GENERIC_SIGN_OUT_ERROR_MESSAGE);
      expect((error as Error).message).not.toMatch(/raw sign-out provider detail/i);
    }
  });
});
