import type { HTMLAttributes } from 'react';

import { browserAppConfig } from '../../lib/appConfig';
import { classNames } from '../../lib/classNames';
import styles from './ProjectIdentity.module.css';

type ProjectIdentityVariant = 'banner' | 'compact' | 'panel';

interface ProjectIdentityProps extends HTMLAttributes<HTMLDivElement> {
  showOnlineNote?: boolean;
  variant?: ProjectIdentityVariant;
}

export function ProjectIdentity({
  className,
  showOnlineNote = false,
  variant = 'compact',
  ...identityProps
}: ProjectIdentityProps) {
  return (
    <div
      aria-label="Project identity"
      className={classNames(styles.identity, styles[variant], className)}
      {...identityProps}
    >
      <span className={styles.statusLabel}>{browserAppConfig.statusLabel}</span>
      <span className={styles.metaItem}>
        <span className={styles.metaLabel}>Environment</span>
        <span className={styles.metaValue}>{browserAppConfig.appEnvironmentLabel}</span>
      </span>
      <span className={styles.metaItem}>
        <span className={styles.metaLabel}>Version</span>
        <span className={styles.metaValue}>{browserAppConfig.appVersion}</span>
      </span>
      {showOnlineNote ? (
        <span className={styles.onlineNote}>Transitional service metadata only</span>
      ) : null}
    </div>
  );
}
