import type { HTMLAttributes } from 'react';

import { StatePanel } from '../StatePanel';
import styles from './LoadingState.module.css';

interface LoadingStateProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  description?: string;
  title?: string;
}

export function LoadingState({
  description,
  title = 'Loading content',
  ...loadingProps
}: LoadingStateProps) {
  return (
    <StatePanel
      aria-busy="true"
      aria-live="polite"
      description={description}
      indicator={<span className={styles.spinner} />}
      role="status"
      title={title}
      tone="info"
      {...loadingProps}
    />
  );
}
