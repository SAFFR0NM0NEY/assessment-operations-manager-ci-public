import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithAppProviders } from '../../test/renderWithAppProviders';
import { PermissionDeniedState } from './PermissionDeniedState';

describe('PermissionDeniedState', () => {
  it('renders friendly permission-denied wording without exposing implementation details', () => {
    renderWithAppProviders(<PermissionDeniedState showProjectIdentity />);

    expect(screen.getByText(/personal skills development \/ reference build/i)).toBeVisible();
    expect(screen.getByText(/access denied/i)).toBeVisible();
    expect(screen.getByText(/you do not have permission to access this area/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /^sign out$/i })).toBeEnabled();
    expect(screen.queryByText(/row level security/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/policy/i)).not.toBeInTheDocument();
  });
});
