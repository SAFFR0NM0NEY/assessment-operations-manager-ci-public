import { render, screen, waitFor } from '@testing-library/react';
import { act, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AuthProvider, type AuthClient } from '../auth';
import { createMockAuthClient, createMockSession, createMockUser } from '../../test/auth';
import {
  createMockAuthorizationClient,
  createMockAuthorizationContext,
  MOCK_ACTIVE_ACCOUNT_ACCESS_STATE,
  MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
  toAccountAccessRpcData,
  toAuthorizationRpcData,
} from '../../test/authorization';
import { AuthorizationProvider } from './AuthorizationProvider';
import type { AuthorizationClient } from './authorizationService';
import { EMPTY_ACCOUNT_ACCESS_STATE } from './types';
import { useAuthorization } from './useAuthorization';
import type {
  AccountAccessState,
  AuthorizationContextData,
  AuthorizationPermission,
  AuthorizationRole,
  PermissionKey,
} from './types';

function AuthorizationProbe({
  campusId,
  permissionKey = 'access.manage',
}: {
  campusId?: string;
  permissionKey?: PermissionKey;
}) {
  const {
    accountAccessState,
    campusGrants,
    error,
    hasPermission,
    permissions,
    profile,
    roles,
    status,
  } = useAuthorization();

  return (
    <div>
      <output aria-label="authorization state">{`${status}:${profile?.displayName ?? 'none'}`}</output>
      <output aria-label="account access state">
        {`${accountAccessState.profileExists ? 'profile' : 'none'}:${accountAccessState.accountStatus ?? 'none'}`}
      </output>
      <output aria-label="authorization roles">
        {roles.map((role) => role.roleName).join(', ') || 'none'}
      </output>
      <output aria-label="authorization scopes">
        {roles
          .map((role) =>
            role.scopeKind === 'organisation' ? 'Organisation scope' : role.campusName,
          )
          .join(', ') || 'none'}
      </output>
      <output aria-label="authorization campus grants">
        {campusGrants.map((grant) => grant.campusName).join(', ') || 'none'}
      </output>
      <output aria-label="authorization permissions">
        {permissions.map((permission) => permission.permissionKey).join(', ') || 'none'}
      </output>
      <output aria-label="authorization permission check">
        {hasPermission(permissionKey, campusId) ? 'allowed' : 'denied'}
      </output>
      <output aria-label="authorization error">{error ?? 'none'}</output>
    </div>
  );
}

function CampusPermissionProbe() {
  const { hasPermission } = useAuthorization();

  return (
    <div>
      <output aria-label="north campus permission">
        {hasPermission('students.view', 'campus-north') ? 'allowed' : 'denied'}
      </output>
      <output aria-label="south campus permission">
        {hasPermission('students.view', 'campus-south') ? 'allowed' : 'denied'}
      </output>
      <output aria-label="missing campus permission">
        {hasPermission('students.view') ? 'allowed' : 'denied'}
      </output>
    </div>
  );
}

function renderWithAuthorization(
  ui: ReactNode,
  {
    authClient,
    authorizationClient,
    initialSession = createMockSession(),
  }: {
    authClient?: AuthClient;
    authorizationClient?: AuthorizationClient;
    initialSession?: ReturnType<typeof createMockSession> | null;
  } = {},
) {
  const startingAuthClient =
    authClient ?? createMockAuthClient({ session: initialSession }).authClient;
  const startingAuthorizationClient =
    authorizationClient ?? createMockAuthorizationClient().authorizationClient;

  return render(
    <AuthProvider authClient={startingAuthClient} initialSession={initialSession}>
      <AuthorizationProvider authorizationClient={startingAuthorizationClient}>
        {ui}
      </AuthorizationProvider>
    </AuthProvider>,
  );
}

describe('AuthorizationProvider', () => {
  it('resets when no Auth session exists', () => {
    const { authorizationClient } = createMockAuthorizationClient();

    renderWithAuthorization(<AuthorizationProbe />, {
      authorizationClient,
      initialSession: null,
    });

    expect(screen.getByLabelText(/authorization state/i)).toHaveTextContent('unprovisioned:none');
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('denied');
    expect(authorizationClient.rpc).not.toHaveBeenCalled();
  });

  it('loads authorization context for an authenticated user', async () => {
    const { authorizationClient } = createMockAuthorizationClient();

    renderWithAuthorization(<AuthorizationProbe />, { authorizationClient });

    expect(await screen.findByText(/ready:reference authorization user/i)).toBeVisible();
    expect(authorizationClient.rpc).toHaveBeenCalledWith('get_my_account_access_state');
    expect(authorizationClient.rpc).toHaveBeenCalledWith('get_my_authorization_context');
  });

  it('renders the Reference Administrator context clearly', async () => {
    renderWithAuthorization(<AuthorizationProbe />);

    expect(await screen.findByText(/ready:reference authorization user/i)).toBeVisible();
    expect(screen.getByLabelText(/authorization roles/i)).toHaveTextContent(
      'Reference Administrator',
    );
    expect(screen.getByLabelText(/authorization scopes/i)).toHaveTextContent('Organisation scope');
    expect(screen.getByLabelText(/authorization campus grants/i)).toHaveTextContent('none');
  });

  it('recognizes an owned permission', async () => {
    renderWithAuthorization(<AuthorizationProbe permissionKey="access.manage" />);

    expect(await screen.findByText(/ready:reference authorization user/i)).toBeVisible();
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('allowed');
  });

  it('recognizes the organisation statistics permission', async () => {
    renderWithAuthorization(<AuthorizationProbe permissionKey="statistics.view_organisation" />);

    expect(await screen.findByText(/ready:reference authorization user/i)).toBeVisible();
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('allowed');
  });

  it('denies a missing permission', async () => {
    renderWithAuthorization(<AuthorizationProbe permissionKey="students.archive" />);

    expect(await screen.findByLabelText(/authorization permission check/i)).toHaveTextContent(
      'denied',
    );
  });

  it('respects campus ID when checking campus-scoped permissions', async () => {
    const trainerRole: AuthorizationRole = {
      campusCode: 'NORTH',
      campusId: 'campus-north',
      campusName: 'North Campus',
      roleKey: 'TRAINER',
      roleName: 'Trainer',
      scopeKind: 'campus',
    };
    const trainerPermission: AuthorizationPermission = {
      campusCode: 'NORTH',
      campusId: 'campus-north',
      campusName: 'North Campus',
      permissionKey: 'students.view',
      permissionName: 'Students - View',
      scopeKind: 'campus',
    };
    const campusContext = createMockAuthorizationContext({
      campusPermissions: [trainerPermission],
      campusRoles: [trainerRole],
      organisationPermissions: [],
      organisationRoles: [],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context: campusContext });

    renderWithAuthorization(<CampusPermissionProbe />, { authorizationClient });

    await waitFor(() => {
      expect(screen.getByLabelText(/north campus permission/i)).toHaveTextContent('allowed');
    });
    expect(screen.getByLabelText(/south campus permission/i)).toHaveTextContent('denied');
    expect(screen.getByLabelText(/missing campus permission/i)).toHaveTextContent('denied');
  });

  it('clears prior authorization context when the Auth user changes', async () => {
    const firstSession = createMockSession({
      user: createMockUser({
        email: 'first-reference-user@example.invalid',
        id: '00000000-0000-4000-8000-000000000201',
      }),
    });
    const secondSession = createMockSession({
      user: createMockUser({
        email: 'second-reference-user@example.invalid',
        id: '00000000-0000-4000-8000-000000000202',
      }),
    });
    const referenceAdminProfile = MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT.profile;

    if (!referenceAdminProfile) {
      throw new Error('Reference administrator test context must include a profile.');
    }

    const firstContext: AuthorizationContextData = {
      ...MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
      profile: {
        ...referenceAdminProfile,
        displayName: 'First Reference User',
      },
    };
    const secondContext: AuthorizationContextData = {
      ...MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
      profile: {
        ...referenceAdminProfile,
        displayName: 'Second Reference User',
      },
    };
    let resolveSecondContext: ((value: { data: unknown; error: null }) => void) | undefined;
    const secondAccountAccessState: AccountAccessState = {
      accountStatus: 'active',
      displayName: 'Second Reference User',
      isDemoAccount: true,
      profileExists: true,
      userProfileId: '00000000-0000-4000-8000-000000000104',
    };
    const authorizationClient: AuthorizationClient = {
      rpc: vi
        .fn()
        .mockResolvedValueOnce({
          data: toAccountAccessRpcData(MOCK_ACTIVE_ACCOUNT_ACCESS_STATE),
          error: null,
        })
        .mockResolvedValueOnce({
          data: toAuthorizationRpcData(firstContext),
          error: null,
        })
        .mockResolvedValueOnce({
          data: toAccountAccessRpcData(secondAccountAccessState),
          error: null,
        })
        .mockImplementationOnce(
          () =>
            new Promise<{ data: unknown; error: null }>((resolve) => {
              resolveSecondContext = resolve;
            }),
        ),
    };
    const { authClient, emitAuthStateChange } = createMockAuthClient({ session: firstSession });

    renderWithAuthorization(<AuthorizationProbe />, {
      authClient,
      authorizationClient,
      initialSession: firstSession,
    });

    expect(await screen.findByText(/ready:first reference user/i)).toBeVisible();

    act(() => {
      emitAuthStateChange('SIGNED_IN', secondSession);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/authorization state/i)).toHaveTextContent('initializing:none');
    });

    act(() => {
      resolveSecondContext?.({
        data: toAuthorizationRpcData(secondContext),
        error: null,
      });
    });

    expect(await screen.findByText(/ready:second reference user/i)).toBeVisible();
  });

  it('fails closed when the authorization RPC fails', async () => {
    const { authorizationClient } = createMockAuthorizationClient({
      error: {
        message: 'internal policy detail',
      },
    });

    renderWithAuthorization(<AuthorizationProbe />, { authorizationClient });

    expect(await screen.findByText(/error:none/i)).toBeVisible();
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('denied');
    expect(screen.getByLabelText(/authorization error/i)).toHaveTextContent(
      'Authorization context could not be loaded.',
    );
  });

  it('fails closed when the account access RPC fails', async () => {
    const { authorizationClient } = createMockAuthorizationClient({
      accountAccessError: {
        message: 'raw account lookup detail',
      },
    });

    renderWithAuthorization(<AuthorizationProbe />, { authorizationClient });

    expect(await screen.findByText(/error:none/i)).toBeVisible();
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('denied');
    expect(screen.getByLabelText(/authorization error/i)).toHaveTextContent(
      'Account access state could not be loaded.',
    );
    expect(authorizationClient.rpc).not.toHaveBeenCalledWith('get_my_authorization_context');
  });

  it('does not load roles or permissions for inactive profiles', async () => {
    const inactiveAccountAccessState: AccountAccessState = {
      accountStatus: 'suspended',
      displayName: 'Reference Authorization User',
      isDemoAccount: true,
      profileExists: true,
      userProfileId: '00000000-0000-4000-8000-000000000104',
    };
    const { authorizationClient } = createMockAuthorizationClient({
      accountAccessState: inactiveAccountAccessState,
    });

    renderWithAuthorization(<AuthorizationProbe permissionKey="access.manage" />, {
      authorizationClient,
    });

    expect(await screen.findByLabelText(/authorization state/i)).toHaveTextContent('inactive:none');
    expect(screen.getByLabelText(/account access state/i)).toHaveTextContent('profile:suspended');
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('denied');
    expect(authorizationClient.rpc).not.toHaveBeenCalledWith('get_my_authorization_context');
  });

  it('does not grant permissions to an unprovisioned authenticated user', async () => {
    const { authorizationClient } = createMockAuthorizationClient({
      accountAccessState: EMPTY_ACCOUNT_ACCESS_STATE,
      context: null,
    });

    renderWithAuthorization(<AuthorizationProbe permissionKey="access.manage" />, {
      authorizationClient,
    });

    expect(await screen.findByText(/unprovisioned:none/i)).toBeVisible();
    expect(screen.getByLabelText(/account access state/i)).toHaveTextContent('none:none');
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('denied');
    expect(authorizationClient.rpc).not.toHaveBeenCalledWith('get_my_authorization_context');
  });

  it('uses permissions rather than role-name conditionals for UI checks', async () => {
    const roleOnlyContext: AuthorizationContextData = {
      ...MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
      permissions: [],
    };
    const { authorizationClient } = createMockAuthorizationClient({ context: roleOnlyContext });

    renderWithAuthorization(<AuthorizationProbe permissionKey="access.manage" />, {
      authorizationClient,
    });

    expect(await screen.findByLabelText(/authorization roles/i)).toHaveTextContent(
      'Reference Administrator',
    );
    expect(screen.getByLabelText(/authorization permission check/i)).toHaveTextContent('denied');
  });
});
