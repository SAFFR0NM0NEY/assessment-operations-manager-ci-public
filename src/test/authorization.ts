import { vi } from 'vitest';

import type {
  AccountAccessState,
  AuthorizationClient,
  AuthorizationCampusGrant,
  AuthorizationContextData,
  AuthorizationPermission,
  AuthorizationRole,
} from '../features/authorization';
import { EMPTY_ACCOUNT_ACCESS_STATE } from '../features/authorization';

const TEST_ORGANISATION = {
  organisationId: '00000000-0000-4000-8000-000000000101',
  organisationKey: 'REFERENCE_LEARNING_GROUP',
  organisationName: 'Reference Learning Group',
};

export const NORTH_CAMPUS_GRANT: AuthorizationCampusGrant = {
  campusCode: 'NORTH',
  campusId: 'campus-north',
  campusName: 'North Campus',
};

export const SOUTH_CAMPUS_GRANT: AuthorizationCampusGrant = {
  campusCode: 'SOUTH',
  campusId: 'campus-south',
  campusName: 'South Campus',
};

export const EAST_CAMPUS_GRANT: AuthorizationCampusGrant = {
  campusCode: 'EAST',
  campusId: 'campus-east',
  campusName: 'East Campus',
};

export const NORTH_TRAINER_ROLE: AuthorizationRole = {
  ...NORTH_CAMPUS_GRANT,
  roleKey: 'TRAINER',
  roleName: 'Trainer',
  scopeKind: 'campus',
};

export const SOUTH_CAMPUS_MANAGER_ROLE: AuthorizationRole = {
  ...SOUTH_CAMPUS_GRANT,
  roleKey: 'CAMPUS_MANAGER',
  roleName: 'Campus Manager',
  scopeKind: 'campus',
};

export function createCampusPermission(
  grant: AuthorizationCampusGrant,
  permissionKey: AuthorizationPermission['permissionKey'] = 'students.view',
): AuthorizationPermission {
  return {
    ...grant,
    permissionKey,
    permissionName: permissionKey,
    scopeKind: 'campus',
  };
}

export const MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT: AuthorizationContextData = {
  campusGrants: [],
  permissions: [
    {
      campusCode: null,
      campusId: null,
      campusName: null,
      permissionKey: 'authorization.view',
      permissionName: 'Authorization - View',
      scopeKind: 'organisation',
    },
    {
      campusCode: null,
      campusId: null,
      campusName: null,
      permissionKey: 'access.manage',
      permissionName: 'Access - Manage',
      scopeKind: 'organisation',
    },
    {
      campusCode: null,
      campusId: null,
      campusName: null,
      permissionKey: 'statistics.view_organisation',
      permissionName: 'Statistics - View Organisation Totals',
      scopeKind: 'organisation',
    },
  ],
  profile: {
    accountStatus: 'active',
    displayName: 'Reference Authorization User',
    email: 'reference-auth-smoke@example.invalid',
    isDemoAccount: true,
    organisation: TEST_ORGANISATION,
    userProfileId: '00000000-0000-4000-8000-000000000104',
  },
  roles: [
    {
      campusCode: null,
      campusId: null,
      campusName: null,
      roleKey: 'DEMO_ADMINISTRATOR',
      roleName: 'Reference Administrator',
      scopeKind: 'organisation',
    },
  ],
};

export const MOCK_ACTIVE_ACCOUNT_ACCESS_STATE: AccountAccessState = {
  accountStatus: 'active',
  displayName: 'Reference Authorization User',
  isDemoAccount: true,
  profileExists: true,
  userProfileId: '00000000-0000-4000-8000-000000000104',
};

export function createMockAuthorizationContext({
  campusGrants,
  campusPermissions = [],
  campusRoles = [],
  organisationPermissions = MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT.permissions,
  organisationRoles = MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT.roles,
}: {
  campusGrants?: AuthorizationCampusGrant[];
  campusPermissions?: AuthorizationPermission[];
  campusRoles?: AuthorizationRole[];
  organisationPermissions?: AuthorizationPermission[];
  organisationRoles?: AuthorizationRole[];
} = {}): AuthorizationContextData {
  const derivedCampusGrants = campusRoles
    .filter((role) => role.campusId && role.campusCode && role.campusName)
    .map((role) => ({
      campusCode: role.campusCode ?? '',
      campusId: role.campusId ?? '',
      campusName: role.campusName ?? '',
    }));
  const activeCampusGrants = campusGrants ?? derivedCampusGrants;

  return {
    ...MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
    campusGrants: Array.from(
      new Map(activeCampusGrants.map((grant) => [grant.campusId, grant])).values(),
    ),
    permissions: [...organisationPermissions, ...campusPermissions],
    roles: [...organisationRoles, ...campusRoles],
  };
}

export function toAuthorizationRpcData(context: AuthorizationContextData | null) {
  if (!context) {
    return null;
  }

  return {
    campus_grants: context.campusGrants.map((grant) => ({
      campus_code: grant.campusCode,
      campus_id: grant.campusId,
      campus_name: grant.campusName,
    })),
    permissions: context.permissions.map((permission) => ({
      campus_code: permission.campusCode,
      campus_id: permission.campusId,
      campus_name: permission.campusName,
      permission_key: permission.permissionKey,
      permission_name: permission.permissionName,
      scope_kind: permission.scopeKind,
    })),
    profile: context.profile
      ? {
          account_status: context.profile.accountStatus,
          display_name: context.profile.displayName,
          email: context.profile.email,
          is_demo_account: context.profile.isDemoAccount,
          organisation: {
            organisation_id: context.profile.organisation.organisationId,
            organisation_key: context.profile.organisation.organisationKey,
            organisation_name: context.profile.organisation.organisationName,
          },
          user_profile_id: context.profile.userProfileId,
        }
      : null,
    roles: context.roles.map((role) => ({
      campus_code: role.campusCode,
      campus_id: role.campusId,
      campus_name: role.campusName,
      role_key: role.roleKey,
      role_name: role.roleName,
      scope_kind: role.scopeKind,
    })),
  };
}

export function toAccountAccessRpcData(accountAccessState: AccountAccessState) {
  return [
    {
      account_status: accountAccessState.accountStatus,
      display_name: accountAccessState.displayName,
      is_demo_account: accountAccessState.isDemoAccount,
      profile_exists: accountAccessState.profileExists,
      user_profile_id: accountAccessState.userProfileId,
    },
  ];
}

export function createMockAuthorizationClient({
  accountAccessError = null,
  accountAccessState,
  context = MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
  error = null,
}: {
  accountAccessError?: { message: string } | null;
  accountAccessState?: AccountAccessState;
  context?: AuthorizationContextData | null;
  error?: { message: string } | null;
} = {}) {
  const resolvedAccountAccessState =
    accountAccessState ??
    (context?.profile
      ? {
          accountStatus: context.profile.accountStatus as AccountAccessState['accountStatus'],
          displayName: context.profile.displayName,
          isDemoAccount: context.profile.isDemoAccount,
          profileExists: true,
          userProfileId: context.profile.userProfileId,
        }
      : EMPTY_ACCOUNT_ACCESS_STATE);

  const authorizationClient: AuthorizationClient = {
    rpc: vi.fn((fn) => {
      if (fn === 'get_my_account_access_state') {
        return Promise.resolve({
          data: toAccountAccessRpcData(resolvedAccountAccessState),
          error: accountAccessError,
        });
      }

      return Promise.resolve({
        data: toAuthorizationRpcData(context),
        error,
      });
    }),
  };

  return {
    authorizationClient,
  };
}
