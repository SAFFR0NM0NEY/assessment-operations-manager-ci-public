import { Outlet } from 'react-router';

import { LoadingState } from '../../components/ui';
import { useAuthorization } from '../authorization';
import { AccountAccessUnavailablePage } from './AccountAccessUnavailablePage';

export function RequireApplicationAccess() {
  const { status } = useAuthorization();

  if (status === 'initializing') {
    return (
      <main className="app-page" aria-labelledby="application-access-loading-title">
        <LoadingState
          description="Checking this account's application access before opening the workspace."
          id="application-access-loading-title"
          title="Checking application access"
        />
      </main>
    );
  }

  if (status !== 'ready') {
    return <AccountAccessUnavailablePage />;
  }

  return <Outlet />;
}
