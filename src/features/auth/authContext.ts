import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export type AuthStatus = 'authenticated' | 'initializing' | 'unauthenticated';
export type AuthSessionNotice = 'manual-sign-out' | 'session-ended' | null;

export interface AuthContextValue {
  sessionKey: number;
  sessionNotice: AuthSessionNotice;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  status: AuthStatus;
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
