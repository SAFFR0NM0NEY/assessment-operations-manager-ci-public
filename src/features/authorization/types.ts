export const PERMISSION_KEYS = [
  'students.view',
  'students.create',
  'students.edit',
  'students.archive',
  'exams.view',
  'exams.manage',
  'bookings.view',
  'bookings.manage',
  'attempts.view',
  'attempts.capture',
  'corrections.request',
  'corrections.approve',
  'audit.view',
  'authorization.view',
  'access.manage',
  'statistics.view_organisation',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const BUSINESS_ROLE_KEYS = [
  'TRAINER',
  'CAMPUS_MANAGER',
  'EXAM_ADMINISTRATOR',
  'DEMO_ADMINISTRATOR',
] as const;

export type BusinessRoleKey = (typeof BUSINESS_ROLE_KEYS)[number];

export const ACCOUNT_STATUSES = ['invited', 'active', 'suspended', 'disabled', 'archived'] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export type AuthorizationStatus = 'error' | 'inactive' | 'initializing' | 'ready' | 'unprovisioned';

export type PermissionScopeKind = 'campus' | 'organisation';

export type BusinessRoleScopeKind = 'campus' | 'organisation';

export interface AuthorizationOrganisation {
  organisationId: string;
  organisationKey: string;
  organisationName: string;
}

export interface AuthorizationProfile {
  accountStatus: string;
  displayName: string;
  email: string | null;
  isDemoAccount: boolean;
  organisation: AuthorizationOrganisation;
  userProfileId: string;
}

export interface AuthorizationRole {
  campusCode: string | null;
  campusId: string | null;
  campusName: string | null;
  roleKey: BusinessRoleKey;
  roleName: string;
  scopeKind: BusinessRoleScopeKind;
}

export interface AuthorizationPermission {
  campusCode: string | null;
  campusId: string | null;
  campusName: string | null;
  permissionKey: PermissionKey;
  permissionName: string;
  scopeKind: PermissionScopeKind;
}

export interface AuthorizationCampusGrant {
  campusCode: string;
  campusId: string;
  campusName: string;
}

export interface AccountAccessState {
  accountStatus: AccountStatus | null;
  displayName: string | null;
  isDemoAccount: boolean | null;
  profileExists: boolean;
  userProfileId: string | null;
}

export interface AuthorizationContextData {
  campusGrants: AuthorizationCampusGrant[];
  permissions: AuthorizationPermission[];
  profile: AuthorizationProfile | null;
  roles: AuthorizationRole[];
}

export const EMPTY_AUTHORIZATION_CONTEXT: AuthorizationContextData = {
  campusGrants: [],
  permissions: [],
  profile: null,
  roles: [],
};

export const EMPTY_ACCOUNT_ACCESS_STATE: AccountAccessState = {
  accountStatus: null,
  displayName: null,
  isDemoAccount: null,
  profileExists: false,
  userProfileId: null,
};

export function isPermissionKey(value: string): value is PermissionKey {
  return PERMISSION_KEYS.includes(value as PermissionKey);
}

export function isBusinessRoleKey(value: string): value is BusinessRoleKey {
  return BUSINESS_ROLE_KEYS.includes(value as BusinessRoleKey);
}

export function isAccountStatus(value: string): value is AccountStatus {
  return ACCOUNT_STATUSES.includes(value as AccountStatus);
}

export function isPermissionScopeKind(value: string): value is PermissionScopeKind {
  return value === 'campus' || value === 'organisation';
}

export function authorizationHasPermission(
  context: AuthorizationContextData,
  permissionKey: PermissionKey,
  campusId?: string | null,
) {
  return context.permissions.some((permission) => {
    if (permission.permissionKey !== permissionKey) {
      return false;
    }

    if (permission.scopeKind === 'organisation') {
      return true;
    }

    return Boolean(campusId) && permission.campusId === campusId;
  });
}
