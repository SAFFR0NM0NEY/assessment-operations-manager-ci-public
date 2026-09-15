import { createContext } from 'react';

import type { CampusContextValue } from './types';

export const CampusContext = createContext<CampusContextValue | undefined>(undefined);
