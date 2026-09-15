import type { HTMLAttributes, ReactNode } from 'react';

import { StatePanel } from '../StatePanel';

interface SuccessStateProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  action?: ReactNode;
  message: string;
  title: string;
}

export function SuccessState({ action, message, title, ...successProps }: SuccessStateProps) {
  return (
    <StatePanel
      actions={action}
      aria-live="polite"
      description={message}
      label="Success"
      role="status"
      title={title}
      tone="success"
      {...successProps}
    />
  );
}
