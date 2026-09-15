import type { HTMLAttributes } from 'react';

import { Button } from '../Button';
import { StatePanel } from '../StatePanel';
import styles from './ErrorState.module.css';

interface ErrorStateProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  message: string;
  onRetry?: () => void;
  referenceCode?: string;
  retryLabel?: string;
  title: string;
}

export function ErrorState({
  message,
  onRetry,
  referenceCode,
  retryLabel = 'Retry',
  title,
  ...errorProps
}: ErrorStateProps) {
  return (
    <StatePanel
      actions={
        onRetry ? (
          <Button onClick={onRetry} variant="secondary">
            {retryLabel}
          </Button>
        ) : undefined
      }
      label="Error"
      role="alert"
      title={title}
      tone="danger"
      {...errorProps}
    >
      <p className={styles.message}>{message}</p>
      {referenceCode ? <p className={styles.reference}>Reference: {referenceCode}</p> : null}
    </StatePanel>
  );
}
