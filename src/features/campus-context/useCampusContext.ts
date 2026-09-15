import { useContext } from 'react';

import { CampusContext } from './campusContext';

export function useCampusContext() {
  const context = useContext(CampusContext);

  if (!context) {
    throw new Error('useCampusContext must be used within a CampusContextProvider.');
  }

  return context;
}
