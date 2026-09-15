import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '../auth';
import { useAuthorization } from '../authorization';
import type { AuthorizationCampusGrant, AuthorizationRole } from '../authorization';
import { CampusContext } from './campusContext';
import type { CampusContextSelectionStatus, WorkingCampusContext } from './types';

interface CampusContextProviderProps {
  children: ReactNode;
}

interface CampusSelectionState {
  campusContextKey: string;
  requestedCampusId: string | null;
}

function createSelectableCampuses({
  campusGrants,
  roles,
}: {
  campusGrants: AuthorizationCampusGrant[];
  roles: AuthorizationRole[];
}) {
  const campusRolesByCampusId = new Map<string, AuthorizationRole[]>();

  for (const role of roles) {
    if (role.scopeKind !== 'campus' || !role.campusId) {
      continue;
    }

    const campusRoles = campusRolesByCampusId.get(role.campusId) ?? [];
    campusRoles.push(role);
    campusRolesByCampusId.set(role.campusId, campusRoles);
  }

  const seenCampusIds = new Set<string>();
  const selectableCampuses: WorkingCampusContext[] = [];

  for (const grant of campusGrants) {
    if (seenCampusIds.has(grant.campusId)) {
      continue;
    }

    const campusRoles = campusRolesByCampusId.get(grant.campusId) ?? [];

    if (campusRoles.length === 0) {
      continue;
    }

    selectableCampuses.push({
      ...grant,
      roles: campusRoles,
    });
    seenCampusIds.add(grant.campusId);
  }

  return selectableCampuses;
}

function resolveSelectedCampusId({
  requestedCampusId,
  selectableCampuses,
}: {
  requestedCampusId: string | null;
  selectableCampuses: WorkingCampusContext[];
}) {
  if (selectableCampuses.length === 0) {
    return null;
  }

  if (selectableCampuses.length === 1) {
    return selectableCampuses[0].campusId;
  }

  if (!requestedCampusId) {
    return null;
  }

  return selectableCampuses.some((campus) => campus.campusId === requestedCampusId)
    ? requestedCampusId
    : null;
}

export function CampusContextProvider({ children }: CampusContextProviderProps) {
  const { sessionKey: authSessionKey, status: authStatus, user } = useAuth();
  const authorization = useAuthorization();
  const [selectionState, setSelectionState] = useState<CampusSelectionState>({
    campusContextKey: 'initializing',
    requestedCampusId: null,
  });

  const isReadyForCampusContext =
    authStatus === 'authenticated' && authorization.status === 'ready';
  const currentUserId = user?.id ?? null;
  const selectableCampuses = useMemo(() => {
    if (!isReadyForCampusContext) {
      return [];
    }

    return createSelectableCampuses({
      campusGrants: authorization.campusGrants,
      roles: authorization.roles,
    });
  }, [authorization.campusGrants, authorization.roles, isReadyForCampusContext]);
  const campusContextKey = useMemo(() => {
    const authSessionKeyValue = String(authSessionKey);

    if (!isReadyForCampusContext || !currentUserId) {
      return `${authSessionKeyValue}:${currentUserId ?? 'anonymous'}:unavailable`;
    }

    const selectableCampusIds = selectableCampuses.map((campus) => campus.campusId).join('|');

    return `${authSessionKeyValue}:${currentUserId}:${selectableCampusIds}`;
  }, [authSessionKey, currentUserId, isReadyForCampusContext, selectableCampuses]);
  const requestedCampusId =
    selectionState.campusContextKey === campusContextKey ? selectionState.requestedCampusId : null;

  const selectedCampusId = resolveSelectedCampusId({
    requestedCampusId,
    selectableCampuses,
  });

  const selectedCampus = useMemo(
    () => selectableCampuses.find((campus) => campus.campusId === selectedCampusId) ?? null,
    [selectableCampuses, selectedCampusId],
  );

  const selectionStatus = useMemo<CampusContextSelectionStatus>(() => {
    if (selectableCampuses.length === 0) {
      return 'none';
    }

    return selectedCampus ? 'selected' : 'selection_required';
  }, [selectableCampuses.length, selectedCampus]);

  const selectCampus = useCallback(
    (campusId: string) => {
      setSelectionState((currentSelection) => {
        if (!selectableCampuses.some((campus) => campus.campusId === campusId)) {
          return currentSelection.campusContextKey === campusContextKey
            ? currentSelection
            : {
                campusContextKey,
                requestedCampusId: null,
              };
        }

        return {
          campusContextKey,
          requestedCampusId: campusId,
        };
      });
    },
    [campusContextKey, selectableCampuses],
  );

  const clearCampusSelection = useCallback(() => {
    setSelectionState({
      campusContextKey,
      requestedCampusId: null,
    });
  }, [campusContextKey]);

  const contextValue = useMemo(
    () => ({
      clearCampusSelection,
      selectableCampuses,
      selectedCampus,
      selectedCampusId,
      selectionStatus,
      selectCampus,
    }),
    [
      clearCampusSelection,
      selectableCampuses,
      selectedCampus,
      selectedCampusId,
      selectionStatus,
      selectCampus,
    ],
  );

  return <CampusContext.Provider value={contextValue}>{children}</CampusContext.Provider>;
}
