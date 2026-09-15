import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './StatusBadge.module.css';

export type StatusBadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: StatusBadgeVariant;
}

export function StatusBadge({
  children,
  className,
  variant = 'neutral',
  ...badgeProps
}: StatusBadgeProps) {
  return (
    <span className={classNames(styles.badge, styles[variant], className)} {...badgeProps}>
      {children}
    </span>
  );
}
