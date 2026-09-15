import type { HTMLAttributes, ReactNode } from 'react';

import { StatePanel } from '../StatePanel';

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  action?: ReactNode;
  description: string;
  label?: string;
  title: string;
}

export function EmptyState({ action, description, label, title, ...emptyProps }: EmptyStateProps) {
  return (
    <StatePanel
      actions={action}
      description={description}
      label={label}
      title={title}
      tone="neutral"
      {...emptyProps}
    />
  );
}
