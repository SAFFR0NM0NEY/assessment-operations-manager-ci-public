import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { createMockAuthClient, createMockAuthError, createMockSession } from '../../test/auth';
import { GENERIC_SIGN_OUT_ERROR_MESSAGE } from './authService';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

function AuthProbe() {
  const { sessionKey, sessionNotice, signOut, status, user } = useAuth();
  const [signOutError, setSignOutError] = useState('');

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'unknown');
    }
  }

  return (
    <div>
      <output aria-label="auth state">{`${status}:${user?.email ?? 'none'}`}</output>
      <output aria-label="auth session key">{sessionKey}</output>
      <output aria-label="auth notice">{sessionNotice ?? 'none'}</output>
      <output aria-label="sign out error">{signOutError || 'none'}</output>
      <button
        onClick={() => {
          void handleSignOut();
        }}
        type="button"
      >
        Sign out probe
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  it('restores an existing Supabase session on startup', async () => {
    const session = createMockSession({
      user: createMockSession().user,
    });
    const { authClient } = createMockAuthClient({ session });

    render(
      <AuthProvider authClient={authClient}>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(await screen.findByLabelText(/auth state/i)).toHaveTextContent(
      'authenticated:reference-auth-smoke@example.invalid',
    );
  });

  it('updates auth state when Supabase emits session changes', () => {
    const signInSession = createMockSession();
    const { authClient, emitAuthStateChange } = createMockAuthClient({ session: null });

    render(
      <AuthProvider authClient={authClient} initialSession={null}>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByLabelText(/auth state/i)).toHaveTextContent('unauthenticated:none');

    act(() => {
      emitAuthStateChange('SIGNED_IN', signInSession);
    });

    expect(screen.getByLabelText(/auth state/i)).toHaveTextContent(
      'authenticated:reference-auth-smoke@example.invalid',
    );

    act(() => {
      emitAuthStateChange('SIGNED_OUT', null);
    });

    expect(screen.getByLabelText(/auth state/i)).toHaveTextContent('unauthenticated:none');
    expect(screen.getByLabelText(/auth notice/i)).toHaveTextContent('session-ended');
  });

  it('keeps normal token refresh authenticated without a session-ended notice', () => {
    const startingSession = createMockSession();
    const refreshedSession = createMockSession({
      access_token: 'refreshed-test-access-token',
      expires_at: startingSession.expires_at ? startingSession.expires_at + 3600 : undefined,
      user: startingSession.user,
    });
    const { authClient, emitAuthStateChange } = createMockAuthClient({
      session: startingSession,
    });

    render(
      <AuthProvider authClient={authClient} initialSession={startingSession}>
        <AuthProbe />
      </AuthProvider>,
    );

    const sessionKeyBeforeRefresh = screen.getByLabelText(/auth session key/i).textContent;

    act(() => {
      emitAuthStateChange('TOKEN_REFRESHED', refreshedSession);
    });

    expect(screen.getByLabelText(/auth state/i)).toHaveTextContent(
      'authenticated:reference-auth-smoke@example.invalid',
    );
    expect(screen.getByLabelText(/auth notice/i)).toHaveTextContent('none');
    expect(screen.getByLabelText(/auth session key/i)).toHaveTextContent(sessionKeyBeforeRefresh);
  });

  it('records a manual sign-out notice when the user signs out', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient();

    render(
      <AuthProvider authClient={authClient} initialSession={createMockSession()}>
        <AuthProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: /sign out probe/i }));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/auth state/i)).toHaveTextContent('unauthenticated:none');
    expect(screen.getByLabelText(/auth notice/i)).toHaveTextContent('manual-sign-out');
  });

  it('keeps the authenticated snapshot when Supabase sign-out fails', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient({
      signOutError: createMockAuthError('Internal sign-out failure'),
    });

    render(
      <AuthProvider authClient={authClient} initialSession={createMockSession()}>
        <AuthProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: /sign out probe/i }));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/auth state/i)).toHaveTextContent(
      'authenticated:reference-auth-smoke@example.invalid',
    );
    expect(screen.getByLabelText(/auth notice/i)).toHaveTextContent('none');
    expect(screen.getByLabelText(/sign out error/i)).toHaveTextContent(
      GENERIC_SIGN_OUT_ERROR_MESSAGE,
    );
  });
});
