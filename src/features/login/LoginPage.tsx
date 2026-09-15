import { useState, type SyntheticEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { loginRoute, overviewRoute } from '../../app/routeMeta';
import { ProjectIdentity } from '../../components/project-identity';
import { Button, Card, Stack, TextInputField } from '../../components/ui';
import { GENERIC_SIGN_IN_ERROR_MESSAGE } from '../auth/authService';
import { useAuth } from '../auth';
import styles from './LoginPage.module.css';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

function getSafeReturnToPath(locationState: unknown) {
  if (!locationState || typeof locationState !== 'object') {
    return undefined;
  }

  const returnTo = (locationState as { returnTo?: unknown }).returnTo;

  if (typeof returnTo === 'string' && (returnTo === '/app' || returnTo.startsWith('/app/'))) {
    return returnTo;
  }

  return undefined;
}

function validateLoginForm(email: string, password: string): LoginFormErrors {
  const nextErrors: LoginFormErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    nextErrors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    nextErrors.email = 'Enter a valid email address.';
  }

  if (!password) {
    nextErrors.password = 'Password is required.';
  }

  return nextErrors;
}

function getSessionNoticeMessage(sessionNotice: ReturnType<typeof useAuth>['sessionNotice']) {
  if (sessionNotice === 'manual-sign-out') {
    return 'You have signed out.';
  }

  if (sessionNotice === 'session-ended') {
    return 'Your session ended or is no longer valid. Sign in again.';
  }

  return '';
}

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionNotice, signIn, status } = useAuth();
  const returnTo = getSafeReturnToPath(location.state) ?? overviewRoute.path;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLoginForm(email, password);

    setErrors(nextErrors);
    setFormError('');

    if (Object.keys(nextErrors).length > 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(email.trim(), password);
      void navigate(returnTo, { replace: true });
    } catch {
      setFormError(GENERIC_SIGN_IN_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === 'authenticated') {
    return <Navigate replace to={returnTo} />;
  }

  const sessionNoticeMessage = getSessionNoticeMessage(sessionNotice);

  return (
    <main className={styles.page} aria-labelledby="login-title">
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
            <Stack gap="medium">
              <h1 className={styles.title} id="login-title">
                Assessment Operations Manager
              </h1>
              <p className={styles.summary}>
                Development access for the personal reference application. Current backend services
                are transitional while the project moves from the legacy hosted Supabase
                implementation to a local C# and PostgreSQL architecture.
              </p>
            </Stack>
          </section>

          <Card
            description="Use a configured reference account for this local build. Access here only confirms authentication; business roles and location permissions are still controlled separately."
            title={loginRoute.pageTitle}
          >
            <form
              className={styles.form}
              noValidate
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
            >
              <p className={styles.notice}>Development access only.</p>
              {sessionNoticeMessage ? (
                <p className={styles.sessionNotice} role="status">
                  {sessionNoticeMessage}
                </p>
              ) : null}
              {formError ? (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              ) : null}
              <TextInputField
                autoComplete="email"
                disabled={isSubmitting || status === 'initializing'}
                errorText={errors.email}
                label="Email address"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                type="email"
                value={email}
              />
              <TextInputField
                autoComplete="current-password"
                disabled={isSubmitting || status === 'initializing'}
                errorText={errors.password}
                label="Password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type="password"
                value={password}
              />
              <div className={styles.actions}>
                <Button disabled={isSubmitting || status === 'initializing'} type="submit">
                  {isSubmitting ? 'Signing in' : 'Sign in'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
