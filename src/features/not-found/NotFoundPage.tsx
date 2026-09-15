import { Link } from 'react-router';

import { overviewRoute } from '../../app/routeMeta';
import { ProjectIdentity } from '../../components/project-identity';
import { Card, Stack } from '../../components/ui';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <main className={styles.page} aria-labelledby="not-found-title">
      <div className="app-page">
        <section className={styles.panel}>
          <img
            alt="AOM"
            className={styles.brandLogo}
            height="48"
            src="/branding/aom-mark.svg"
            width="163"
          />
          <ProjectIdentity variant="panel" />
          <Stack gap="small">
            <h1 className={styles.title} id="not-found-title">
              Page Not Found
            </h1>
            <p className={styles.copy}>The requested page was not found in this reference build.</p>
          </Stack>
          <Card>
            <Stack gap="medium">
              <p className={styles.copy}>
                The requested route is not part of this reference application navigation.
              </p>
              <Link className={styles.homeLink} to={overviewRoute.path}>
                Back to application overview
              </Link>
            </Stack>
          </Card>
        </section>
      </div>
    </main>
  );
}
