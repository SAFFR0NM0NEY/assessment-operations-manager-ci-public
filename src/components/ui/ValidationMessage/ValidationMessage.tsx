import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../../lib/classNames';
import styles from './ValidationMessage.module.css';

export type ValidationMessageVariant = 'error' | 'supporting';

interface ValidationMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  id: string;
  variant?: ValidationMessageVariant;
}

export function ValidationMessage({
  children,
  className,
  id,
  role,
  variant = 'supporting',
  ...messageProps
}: ValidationMessageProps) {
  const messageRole = variant === 'error' ? 'alert' : role;

  return (
    <p
      className={classNames(styles.message, styles[variant], className)}
      id={id}
      role={messageRole}
      {...messageProps}
    >
      {children}
    </p>
  );
}
