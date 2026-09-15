import { createContext } from 'react';

import type {
  AccountAccessState,
  AuthorizationCampusGrant,
  AuthorizationPermission,
  AuthorizationProfile,
  AuthorizationRole,
  AuthorizationStatus,
  PermissionKey,
} from './types';

export interface AuthorizationContextValue {
  accountAccessState: AccountAccessState;
  campusGrants: AuthorizationCampusGrant[];
  error: string | null;
  hasPermission: (permissionKey: PermissionKey, campusId?: string | null) => boolean;
  permissions: AuthorizationPermission[];
  profile: AuthorizationProfile | null;
  refreshAuthorization: () => void;
  roles: AuthorizationRole[];
  status: AuthorizationStatus;
}

export const AuthorizationContext = createContext<AuthorizationContextValue | undefined>(undefined);
