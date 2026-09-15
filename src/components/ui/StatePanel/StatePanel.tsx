import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './StatePanel.module.css';

export type StatePanelTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

interface StatePanelProps extends HTMLAttributes<HTMLElement> {
  actions?: ReactNode;
  children?: ReactNode;
  description?: string;
  indicator?: ReactNode;
  label?: string;
  title: string;
  tone?: StatePanelTone;
}

export function StatePanel({
  actions,
  children,
  className,
  description,
  indicator,
  label,
  title,
  tone = 'neutral',
  ...panelProps
}: StatePanelProps) {
  return (
    <section className={classNames(styles.panel, styles[tone], className)} {...panelProps}>
      {indicator ? (
        <div aria-hidden="true" className={styles.indicator}>
          {indicator}
        </div>
      ) : null}
      <div className={styles.content}>
        {label ? <p className={styles.label}>{label}</p> : null}
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
        {children ? <div className={styles.body}>{children}</div> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </section>
  );
}
