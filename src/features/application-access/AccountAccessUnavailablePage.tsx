import { ProjectIdentity } from '../../components/project-identity';
import { Button, StatePanel } from '../../components/ui';
import { SignOutButton } from '../auth';
import { useAuthorization, type AccountStatus } from '../authorization';
import styles from './AccountAccessUnavailablePage.module.css';

interface AccessCopy {
  description: string;
  title: string;
  tone: 'danger' | 'info' | 'warning';
}

const INACTIVE_ACCOUNT_COPY: Record<Exclude<AccountStatus, 'active'>, AccessCopy> = {
  archived: {
    description: 'This reference profile is no longer available for application access.',
    title: 'Account archived',
    tone: 'warning',
  },
  disabled: {
    description: 'This reference profile is disabled and cannot open the application workspace.',
    title: 'Account disabled',
    tone: 'danger',
  },
  invited: {
    description:
      'This reference profile exists, but application access has not been activated yet.',
    title: 'Account awaiting activation',
    tone: 'info',
  },
  suspended: {
    description: 'This reference profile is suspended and cannot open the application workspace.',
    title: 'Account suspended',
    tone: 'warning',
  },
};

function getAccessCopy(
  status: ReturnType<typeof useAuthorization>['status'],
  accountStatus: AccountStatus | null,
): AccessCopy {
  if (status === 'error') {
    return {
      description: 'The application could not verify this account access. Try again.',
      title: 'Access check unavailable',
      tone: 'danger',
    };
  }

  if (accountStatus && accountStatus !== 'active') {
    return INACTIVE_ACCOUNT_COPY[accountStatus];
  }

  return {
    description: 'This signed-in account is not linked to a reference application profile yet.',
    title: 'Access not provisioned',
    tone: 'warning',
  };
}

export function AccountAccessUnavailablePage() {
  const { accountAccessState, error, refreshAuthorization, status } = useAuthorization();
  const accessCopy = getAccessCopy(status, accountAccessState.accountStatus);

  return (
    <main className={styles.page} aria-labelledby="account-access-title">
      <div className="app-page">
        <div className={styles.layout}>
          <section className={styles.intro}>
            <div className={styles.brandLockup}>
              <img
                alt="AOM"
                className={styles.brandLogo}
                height="48"
                src="/branding/aom-mark.svg"
                width="163"
              />
              <span className={styles.brandText}>Personal reference build</span>
            </div>
            <ProjectIdentity showOnlineNote variant="panel" />
            <div>
              <h1 className={styles.title} id="account-access-title">
                Assessment Operations Manager
              </h1>
              <p className={styles.summary}>
                Development access is available only to configured reference accounts.
              </p>
            </div>
          </section>

          <StatePanel
            actions={
              <div className={styles.actions}>
                <Button onClick={refreshAuthorization} type="button" variant="secondary">
                  {status === 'error' ? 'Try again' : 'Check access again'}
                </Button>
                <div className={styles.signOutGroup}>
                  <SignOutButton errorClassName={styles.signOutError} size="normal" />
                </div>
              </div>
            }
            description={accessCopy.description}
            label="Application access"
            title={accessCopy.title}
            tone={accessCopy.tone}
          >
            {error ? <p>Access could not be confirmed right now.</p> : null}
          </StatePanel>
        </div>
      </div>
    </main>
  );
}
