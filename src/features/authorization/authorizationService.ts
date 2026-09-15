import { supabaseBrowserClient } from '../../lib/supabase/client';
import {
  EMPTY_ACCOUNT_ACCESS_STATE,
  EMPTY_AUTHORIZATION_CONTEXT,
  isBusinessRoleKey,
  isAccountStatus,
  isPermissionKey,
  isPermissionScopeKind,
  type AccountAccessState,
  type AuthorizationCampusGrant,
  type AuthorizationContextData,
  type AuthorizationOrganisation,
  type AuthorizationPermission,
  type AuthorizationProfile,
  type AuthorizationRole,
} from './types';

interface AuthorizationRpcError {
  message?: string;
}

interface AuthorizationRpcResponse {
  data: unknown;
  error: AuthorizationRpcError | null;
}

export interface AuthorizationClient {
  rpc: (
    fn: 'get_my_account_access_state' | 'get_my_authorization_context',
  ) => PromiseLike<AuthorizationRpcResponse>;
}

export class AuthorizationContextLoadError extends Error {
  constructor() {
    super('Authorization context could not be loaded.');
    this.name = 'AuthorizationContextLoadError';
  }
}

export class AccountAccessStateLoadError extends Error {
  constructor() {
    super('Account access state could not be loaded.');
    this.name = 'AccountAccessStateLoadError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new AuthorizationContextLoadError();
  }

  return value;
}

function optionalString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new AuthorizationContextLoadError();
  }

  return value;
}

function requiredBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];

  if (typeof value !== 'boolean') {
    throw new AuthorizationContextLoadError();
  }

  return value;
}

function parseAccountStatus(value: unknown): AccountAccessState['accountStatus'] {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string' || !isAccountStatus(value)) {
    throw new AccountAccessStateLoadError();
  }

  return value;
}

function parseAccountAccessRow(value: unknown): AccountAccessState {
  if (!isRecord(value)) {
    throw new AccountAccessStateLoadError();
  }

  const profileExists = requiredBoolean(value, 'profile_exists');

  if (!profileExists) {
    return EMPTY_ACCOUNT_ACCESS_STATE;
  }

  const accountStatus = parseAccountStatus(value.account_status);

  if (!accountStatus) {
    throw new AccountAccessStateLoadError();
  }

  return {
    accountStatus,
    displayName: requiredString(value, 'display_name'),
    isDemoAccount: requiredBoolean(value, 'is_demo_account'),
    profileExists,
    userProfileId: requiredString(value, 'user_profile_id'),
  };
}

function parseOrganisation(value: unknown): AuthorizationOrganisation {
  if (!isRecord(value)) {
    throw new AuthorizationContextLoadError();
  }

  return {
    organisationId: requiredString(value, 'organisation_id'),
    organisationKey: requiredString(value, 'organisation_key'),
    organisationName: requiredString(value, 'organisation_name'),
  };
}

function parseProfile(value: unknown): AuthorizationProfile | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    throw new AuthorizationContextLoadError();
  }

  return {
    accountStatus: requiredString(value, 'account_status'),
    displayName: requiredString(value, 'display_name'),
    email: optionalString(value, 'email'),
    isDemoAccount: requiredBoolean(value, 'is_demo_account'),
    organisation: parseOrganisation(value.organisation),
    userProfileId: requiredString(value, 'user_profile_id'),
  };
}

function parseRole(value: unknown): AuthorizationRole {
  if (!isRecord(value)) {
    throw new AuthorizationContextLoadError();
  }

  const roleKey = requiredString(value, 'role_key');
  const scopeKind = requiredString(value, 'scope_kind');

  if (!isBusinessRoleKey(roleKey) || !isPermissionScopeKind(scopeKind)) {
    throw new AuthorizationContextLoadError();
  }

  return {
    campusCode: optionalString(value, 'campus_code'),
    campusId: optionalString(value, 'campus_id'),
    campusName: optionalString(value, 'campus_name'),
    roleKey,
    roleName: requiredString(value, 'role_name'),
    scopeKind,
  };
}

function parsePermission(value: unknown): AuthorizationPermission {
  if (!isRecord(value)) {
    throw new AuthorizationContextLoadError();
  }

  const permissionKey = requiredString(value, 'permission_key');
  const scopeKind = requiredString(value, 'scope_kind');

  if (!isPermissionKey(permissionKey) || !isPermissionScopeKind(scopeKind)) {
    throw new AuthorizationContextLoadError();
  }

  return {
    campusCode: optionalString(value, 'campus_code'),
    campusId: optionalString(value, 'campus_id'),
    campusName: optionalString(value, 'campus_name'),
    permissionKey,
    permissionName: requiredString(value, 'permission_name'),
    scopeKind,
  };
}

function parseCampusGrant(value: unknown): AuthorizationCampusGrant {
  if (!isRecord(value)) {
    throw new AuthorizationContextLoadError();
  }

  return {
    campusCode: requiredString(value, 'campus_code'),
    campusId: requiredString(value, 'campus_id'),
    campusName: requiredString(value, 'campus_name'),
  };
}

function parseList<T>(record: Record<string, unknown>, key: string, parser: (value: unknown) => T) {
  const value = record[key];

  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new AuthorizationContextLoadError();
  }

  return value.map(parser);
}

export function parseAuthorizationContext(data: unknown): AuthorizationContextData {
  if (data === null || data === undefined) {
    return EMPTY_AUTHORIZATION_CONTEXT;
  }

  if (!isRecord(data)) {
    throw new AuthorizationContextLoadError();
  }

  return {
    campusGrants: parseList(data, 'campus_grants', parseCampusGrant),
    permissions: parseList(data, 'permissions', parsePermission),
    profile: parseProfile(data.profile),
    roles: parseList(data, 'roles', parseRole),
  };
}

export async function loadAuthorizationContext(
  authorizationClient: AuthorizationClient = supabaseBrowserClient,
) {
  const { data, error } = await authorizationClient.rpc('get_my_authorization_context');

  if (error) {
    throw new AuthorizationContextLoadError();
  }

  return parseAuthorizationContext(data);
}

export function parseAccountAccessState(data: unknown): AccountAccessState {
  if (Array.isArray(data)) {
    if (data.length !== 1) {
      throw new AccountAccessStateLoadError();
    }

    return parseAccountAccessRow(data[0]);
  }

  return parseAccountAccessRow(data);
}

export async function loadAccountAccessState(
  authorizationClient: AuthorizationClient = supabaseBrowserClient,
) {
  const { data, error } = await authorizationClient.rpc('get_my_account_access_state');

  if (error) {
    throw new AccountAccessStateLoadError();
  }

  return parseAccountAccessState(data);
}
