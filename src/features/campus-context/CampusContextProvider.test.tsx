import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AuthProvider, type AuthClient } from '../auth';
import { AuthorizationProvider, type AuthorizationClient } from '../authorization';
import { createMockAuthClient, createMockSession, createMockUser } from '../../test/auth';
import {
  createMockAuthorizationClient,
  createMockAuthorizationContext,
  SOUTH_CAMPUS_GRANT,
  SOUTH_CAMPUS_MANAGER_ROLE,
  MOCK_ACTIVE_ACCOUNT_ACCESS_STATE,
  MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
  EAST_CAMPUS_GRANT,
  NORTH_CAMPUS_GRANT,
  NORTH_TRAINER_ROLE,
  toAccountAccessRpcData,
  toAuthorizationRpcData,
} from '../../test/authorization';
import { CampusContextProvider } from './CampusContextProvider';
import { useCampusContext } from './useCampusContext';

function CampusContextProbe() {
  const { selectableCampuses, selectedCampus, selectedCampusId, selectionStatus, selectCampus } =
    useCampusContext();

  return (
    <div>
      <output aria-label="campus state">
        {`${selectionStatus}:${selectedCampus?.campusName ?? 'none'}`}
      </output>
      <output aria-label="selected campus id">{selectedCampusId ?? 'none'}</output>
      <output aria-label="campus options">
        {selectableCampuses.map((campus) => campus.campusName).join(', ') || 'none'}
      </output>
      <output aria-label="selected campus roles">
        {selectedCampus?.roles.map((role) => role.roleName).join(', ') ?? 'none'}
      </output>
      {selectableCampuses.map((campus) => (
        <button
          key={campus.campusId}
          onClick={() => {
            selectCampus(campus.campusId);
          }}
          type="button"
        >
          Select {campus.campusName}
        </button>
      ))}
    </div>
  );
}

function renderWithCampusContext(
  ui: ReactNode,
  {
    authClient,
    authorizationClient,
    initialSession = createMockSession(),
  }: {
    authClient?: AuthClient;
    authorizationClient?: AuthorizationClient;
    initialSession?: ReturnType<typeof createMockSession> | null;
  } = {},
) {
  const startingAuthClient =
    authClient ?? createMockAuthClient({ session: initialSession }).authClient;
  const startingAuthorizationClient =
    authorizationClient ?? createMockAuthorizationClient().authorizationClient;

  return render(
    <AuthProvider authClient={startingAuthClient} initialSession={initialSession}>
      <AuthorizationProvider authorizationClient={startingAuthorizationClient}>
        <CampusContextProvider>{ui}</CampusContextProvider>
      </AuthorizationProvider>
    </AuthProvider>,
  );
}

describe('CampusContextProvider', () => {
  it('shows no campus context when the user has no explicit campus grant', async () => {
    renderWithCampusContext(<CampusContextProbe />);

    expect(await screen.findByText('none:none')).toBeVisible();
    expect(screen.getByLabelText(/campus options/i)).toHaveTextContent('none');
  });

  it('does not infer a working campus from an organisation-scoped role', async () => {
    const { authorizationClient } = createMockAuthorizationClient({
      context: MOCK_REFERENCE_ADMIN_AUTHORIZATION_CONTEXT,
    });

    renderWithCampusContext(<CampusContextProbe />, { authorizationClient });

    expect(await screen.findByLabelText(/campus state/i)).toHaveTextContent('none:none');
    expect(screen.getByLabelText(/campus options/i)).toHaveTextContent('none');
  });

  it('does not make a grant selectable without a campus-scoped role for the same campus', async () => {
    const context = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT],
      campusRoles: [],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context });

    renderWithCampusContext(<CampusContextProbe />, { authorizationClient });

    expect(await screen.findByLabelText(/campus state/i)).toHaveTextContent('none:none');
    expect(screen.getByLabelText(/campus options/i)).toHaveTextContent('none');
  });

  it('does not make a role selectable without an explicit campus grant', async () => {
    const context = createMockAuthorizationContext({
      campusGrants: [],
      campusRoles: [NORTH_TRAINER_ROLE],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context });

    renderWithCampusContext(<CampusContextProbe />, { authorizationClient });

    expect(await screen.findByLabelText(/campus state/i)).toHaveTextContent('none:none');
    expect(screen.getByLabelText(/campus options/i)).toHaveTextContent('none');
  });

  it('auto-selects the only campus with both a grant and campus role', async () => {
    const context = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT],
      campusRoles: [NORTH_TRAINER_ROLE],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context });

    renderWithCampusContext(<CampusContextProbe />, { authorizationClient });

    await waitFor(() => {
      expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('selected:North Campus');
    });
    expect(screen.getByLabelText(/selected campus roles/i)).toHaveTextContent('Trainer');
  });

  it('requires an explicit choice when multiple campuses are selectable', async () => {
    const user = userEvent.setup();
    const context = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT, SOUTH_CAMPUS_GRANT],
      campusRoles: [NORTH_TRAINER_ROLE, SOUTH_CAMPUS_MANAGER_ROLE],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context });

    renderWithCampusContext(<CampusContextProbe />, { authorizationClient });

    expect(await screen.findByLabelText(/campus state/i)).toHaveTextContent(
      'selection_required:none',
    );
    expect(screen.getByLabelText(/campus options/i)).toHaveTextContent(
      'North Campus, South Campus',
    );

    await user.click(screen.getByRole('button', { name: /select north campus/i }));

    expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('selected:North Campus');
    expect(screen.getByLabelText(/selected campus roles/i)).toHaveTextContent('Trainer');

    await user.click(screen.getByRole('button', { name: /select south campus/i }));

    expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('selected:South Campus');
    expect(screen.getByLabelText(/selected campus roles/i)).toHaveTextContent('Campus Manager');
  });

  it('ignores campus grants that do not have a matching campus role', async () => {
    const context = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT, EAST_CAMPUS_GRANT],
      campusRoles: [NORTH_TRAINER_ROLE],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context });

    renderWithCampusContext(<CampusContextProbe />, { authorizationClient });

    await waitFor(() => {
      expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('selected:North Campus');
    });
    expect(screen.getByLabelText(/campus options/i)).toHaveTextContent('North Campus');
    expect(screen.getByLabelText(/campus options/i)).not.toHaveTextContent('East Campus');
  });

  it('clears the working campus immediately when the Auth user changes', async () => {
    const user = userEvent.setup();
    const firstSession = createMockSession({
      user: createMockUser({
        email: 'first-reference-user@example.invalid',
        id: '00000000-0000-4000-8000-000000000451',
      }),
    });
    const secondSession = createMockSession({
      user: createMockUser({
        email: 'second-reference-user@example.invalid',
        id: '00000000-0000-4000-8000-000000000452',
      }),
    });
    const firstContext = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT, SOUTH_CAMPUS_GRANT],
      campusRoles: [NORTH_TRAINER_ROLE, SOUTH_CAMPUS_MANAGER_ROLE],
    });
    const secondContext = createMockAuthorizationContext({
      campusGrants: [SOUTH_CAMPUS_GRANT],
      campusRoles: [SOUTH_CAMPUS_MANAGER_ROLE],
    });
    let resolveSecondContext: ((value: { data: unknown; error: null }) => void) | undefined;
    const authorizationClient: AuthorizationClient = {
      rpc: vi
        .fn()
        .mockResolvedValueOnce({
          data: toAccountAccessRpcData(MOCK_ACTIVE_ACCOUNT_ACCESS_STATE),
          error: null,
        })
        .mockResolvedValueOnce({
          data: toAuthorizationRpcData(firstContext),
          error: null,
        })
        .mockResolvedValueOnce({
          data: toAccountAccessRpcData(MOCK_ACTIVE_ACCOUNT_ACCESS_STATE),
          error: null,
        })
        .mockImplementationOnce(
          () =>
            new Promise<{ data: unknown; error: null }>((resolve) => {
              resolveSecondContext = resolve;
            }),
        ),
    };
    const { authClient, emitAuthStateChange } = createMockAuthClient({ session: firstSession });

    renderWithCampusContext(<CampusContextProbe />, {
      authClient,
      authorizationClient,
      initialSession: firstSession,
    });

    expect(await screen.findByLabelText(/campus state/i)).toHaveTextContent(
      'selection_required:none',
    );

    await user.click(screen.getByRole('button', { name: /select north campus/i }));

    expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('selected:North Campus');

    act(() => {
      emitAuthStateChange('SIGNED_IN', secondSession);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('none:none');
    });

    act(() => {
      resolveSecondContext?.({
        data: toAuthorizationRpcData(secondContext),
        error: null,
      });
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/campus state/i)).toHaveTextContent('selected:South Campus');
    });
  });
});
