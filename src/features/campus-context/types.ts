import type { AuthorizationCampusGrant, AuthorizationRole } from '../authorization';

export type CampusContextSelectionStatus = 'none' | 'selected' | 'selection_required';

export interface WorkingCampusContext extends AuthorizationCampusGrant {
  roles: AuthorizationRole[];
}

export interface CampusContextValue {
  clearCampusSelection: () => void;
  selectableCampuses: WorkingCampusContext[];
  selectedCampus: WorkingCampusContext | null;
  selectedCampusId: string | null;
  selectionStatus: CampusContextSelectionStatus;
  selectCampus: (campusId: string) => void;
}
