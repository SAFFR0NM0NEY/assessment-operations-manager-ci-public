import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import type { AuthError, Session } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

import {
  Button,
  DataTable,
  type DataTableColumn,
  SelectField,
  StatusBadge,
  TextInputField,
} from '../components/ui';
import App from './App';
import { AuthProvider } from '../features/auth';
import type { AuthClient } from '../features/auth';
import {
  GENERIC_SIGN_IN_ERROR_MESSAGE,
  GENERIC_SIGN_OUT_ERROR_MESSAGE,
} from '../features/auth/authService';
import {
  EMPTY_ACCOUNT_ACCESS_STATE,
  type AccountAccessState,
  type AuthorizationClient,
} from '../features/authorization';
import { createMockAuthClient, createMockAuthError, createMockSession } from '../test/auth';
import {
  createMockAuthorizationClient,
  createMockAuthorizationContext,
  SOUTH_CAMPUS_GRANT,
  SOUTH_CAMPUS_MANAGER_ROLE,
  MOCK_ACTIVE_ACCOUNT_ACCESS_STATE,
  NORTH_CAMPUS_GRANT,
  NORTH_TRAINER_ROLE,
  toAccountAccessRpcData,
  toAuthorizationRpcData,
} from '../test/authorization';
import { renderWithAppProviders } from '../test/renderWithAppProviders';

describe('application routing foundation', () => {
  it('redirects the root route to the shell overview', async () => {
    renderWithAppProviders(<App />, { route: '/' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    expect(screen.getByText(/personal skills development \/ reference build/i)).toBeInTheDocument();
    expect(screen.getByText(/local development/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.0\.0-foundation/i)).toBeInTheDocument();
  });

  it('renders the application shell with persistent project identity on the overview route', async () => {
    renderWithAppProviders(<App />, { route: '/app/overview' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /^aom$/i })).toBeVisible();
    const projectIdentity = screen.getByLabelText(/project identity/i);
    expect(
      within(projectIdentity).getByText(/personal skills development \/ reference build/i),
    ).toBeVisible();
    expect(within(projectIdentity).getByText(/^environment$/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/local development/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/^version$/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/0\.0\.0-foundation/i)).toBeVisible();
    expect(await screen.findByText(/reference authorization user/i)).toBeInTheDocument();
    expect(screen.getByText(/organisation: reference administrator/i)).toBeInTheDocument();
    expect(screen.getByText(/campus roles: no campus role assigned/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/working campus/i)).toBeDisabled();
    expect(screen.getByRole('option', { name: /no campus context/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign out$/i })).toBeEnabled();
    expect(screen.queryByText(/sample manager/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/north campus - sample context/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/project support/i)).not.toHaveLength(0);
  });

  it('does not fabricate a shell campus when the signed-in user has no campus grant', async () => {
    renderWithAppProviders(<App />, { route: '/app/overview' });

    const authorizationContext = await screen.findByLabelText(/current authorization context/i);

    expect(within(authorizationContext).getByText(/reference authorization user/i)).toBeVisible();
    expect(
      within(authorizationContext).getByText(/organisation: reference administrator/i),
    ).toBeVisible();
    expect(
      within(authorizationContext).getByText(/campus roles: no campus role assigned/i),
    ).toBeVisible();
    expect(within(authorizationContext).getByLabelText(/working campus/i)).toBeDisabled();
    expect(within(authorizationContext).queryByText(/north campus/i)).not.toBeInTheDocument();
  });

  it('requires explicit working-campus selection and preserves it across app navigation', async () => {
    const user = userEvent.setup();
    const multiCampusContext = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT, SOUTH_CAMPUS_GRANT],
      campusRoles: [NORTH_TRAINER_ROLE, SOUTH_CAMPUS_MANAGER_ROLE],
    });
    const { authorizationClient } = createMockAuthorizationClient({ context: multiCampusContext });

    renderWithAppProviders(<App />, {
      authorizationClient,
      route: '/app/overview',
    });

    const authorizationContext = await screen.findByLabelText(/current authorization context/i);
    const campusSelector = within(authorizationContext).getByLabelText(/working campus/i);

    expect(campusSelector).toBeEnabled();
    expect(campusSelector).toHaveValue('');
    expect(
      within(authorizationContext).getByText(/organisation: reference administrator/i),
    ).toBeVisible();
    expect(
      within(authorizationContext).getByText(
        /campus roles: trainer - north campus, campus manager - south campus/i,
      ),
    ).toBeVisible();
    expect(screen.getByRole('option', { name: /select campus/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^north campus$/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^south campus$/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /all campuses/i })).not.toBeInTheDocument();

    await user.selectOptions(campusSelector, 'campus-north');

    expect(campusSelector).toHaveValue('campus-north');
    expect(within(authorizationContext).getByText(/current role: trainer/i)).toBeVisible();

    await user.click(screen.getByRole('link', { name: /^students$/i }));

    expect(screen.getByRole('heading', { name: /^students$/i })).toBeInTheDocument();
    const nextAuthorizationContext = screen.getByLabelText(/current authorization context/i);
    const nextCampusSelector = within(nextAuthorizationContext).getByLabelText(/working campus/i);
    expect(nextCampusSelector).toHaveValue('campus-north');

    await user.selectOptions(nextCampusSelector, 'campus-south');

    expect(nextCampusSelector).toHaveValue('campus-south');
    expect(
      within(nextAuthorizationContext).getByText(/current role: campus manager/i),
    ).toBeVisible();
  });

  it('marks the overview navigation link as the current page', async () => {
    renderWithAppProviders(<App />, { route: '/app/overview' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { current: 'page', name: /overview/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders breadcrumbs with the current page as non-linked text', async () => {
    renderWithAppProviders(<App />, { route: '/app/overview' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    const breadcrumbs = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(within(breadcrumbs).getByText(/^overview$/i)).toHaveAttribute('aria-current', 'page');
    expect(
      within(breadcrumbs).queryByRole('link', { name: /^overview$/i }),
    ).not.toBeInTheDocument();
  });

  it('renders the presentation-only overview dashboard preview', async () => {
    renderWithAppProviders(<App />, { route: '/app/overview' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    expect(screen.getByText(/static synthetic preview/i)).toBeInTheDocument();
    expect(screen.getByText(/^total students$/i)).toBeInTheDocument();
    expect(screen.getByText(/^rewrite required$/i)).toBeInTheDocument();
    expect(screen.getByText(/all counts on this page are static synthetic/i)).toBeInTheDocument();
  });

  it('renders synthetic student records with local-only filtering', async () => {
    const user = userEvent.setup();

    renderWithAppProviders(<App />, { route: '/app/students' });

    expect(await screen.findByRole('heading', { name: /^students$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add student unavailable/i })).toBeDisabled();
    expect(screen.getByLabelText(/search synthetic students/i)).toHaveAttribute('type', 'search');
    expect(screen.getByLabelText(/programme filter/i)).toBeInTheDocument();
    const studentTable = screen.getByRole('table', {
      name: /synthetic presentation-only student records/i,
    });
    expect(studentTable).toBeInTheDocument();
    expect(
      within(studentTable).getByRole('cell', { name: /^reference learner 001$/i }),
    ).toBeInTheDocument();
    expect(within(studentTable).getByRole('cell', { name: /ref-1001/i })).toBeInTheDocument();
    expect(screen.getByText(/5 synthetic preview records shown/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search synthetic students/i), '1005');

    expect(
      within(studentTable).getByRole('cell', { name: /^reference learner 005$/i }),
    ).toBeInTheDocument();
    expect(
      within(studentTable).queryByRole('cell', { name: /^reference learner 001$/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/1 synthetic preview records shown/i)).toBeInTheDocument();
  });

  it('keeps exam canonical placeholders separate from unresolved source labels', async () => {
    renderWithAppProviders(<App />, { route: '/app/exams' });

    expect(await screen.findByRole('heading', { name: /^exams$/i })).toBeInTheDocument();
    const canonicalTable = screen.getByRole('table', {
      name: /generic synthetic canonical exam preview/i,
    });
    expect(within(canonicalTable).getByText(/reference assessment 001/i)).toBeInTheDocument();
    expect(within(canonicalTable).queryByText(/legacy label a/i)).not.toBeInTheDocument();
    expect(within(canonicalTable).queryByText(/^short code c$/i)).not.toBeInTheDocument();

    const sourceLabelTable = screen.getByRole('table', {
      name: /source-label examples that are not canonical exams/i,
    });
    expect(
      within(sourceLabelTable).getByRole('cell', { name: /^legacy label a$/i }),
    ).toBeInTheDocument();
    expect(
      within(sourceLabelTable).getByRole('cell', { name: /^legacy label b$/i }),
    ).toBeInTheDocument();
    expect(
      within(sourceLabelTable).getByRole('cell', { name: /^short code c$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/does not define providers or merge ambiguous labels/i)).toBeVisible();
  });

  it('renders the reports page as non-functional product structure', async () => {
    renderWithAppProviders(<App />, { route: '/app/reports' });

    expect(await screen.findByRole('heading', { name: /^reports$/i })).toBeInTheDocument();
    expect(screen.getByText(/campus results/i)).toBeInTheDocument();
    expect(screen.getByText(/export centre/i)).toBeInTheDocument();
    expect(screen.getByText(/no export action/i)).toBeInTheDocument();
  });

  it('renders the administration page without starting user-access implementation', async () => {
    renderWithAppProviders(<App />, { route: '/app/administration' });

    expect(await screen.findByRole('heading', { name: /^administration$/i })).toBeInTheDocument();
    expect(screen.getByText(/campuses & programmes/i)).toBeInTheDocument();
    expect(screen.getByText(/users & access/i)).toBeInTheDocument();
    expect(screen.getByText(/preview only/i)).toBeInTheDocument();
    expect(screen.getByText(/not yet available/i)).toBeInTheDocument();
  });

  it('exposes accurate mobile navigation expanded and collapsed semantics', async () => {
    const user = userEvent.setup();

    renderWithAppProviders(<App />, { route: '/app/overview' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    const drawer = screen.getByRole('dialog', { name: /main navigation/i });
    expect(drawer).toBeInTheDocument();

    await user.click(within(drawer).getByRole('button', { name: /^close$/i }));

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes responsive navigation when a route is selected', async () => {
    const user = userEvent.setup();

    renderWithAppProviders(<App />, { route: '/app/overview' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);

    const drawer = screen.getByRole('dialog', { name: /main navigation/i });
    await user.click(within(drawer).getByRole('link', { name: /^students$/i }));

    expect(screen.getByRole('heading', { name: /^students$/i })).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('redirects unauthenticated private app routes to the login page', () => {
    renderWithAppProviders(<App />, { initialSession: null, route: '/app/students' });

    expect(
      screen.getByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeEnabled();
    expect(screen.queryByRole('heading', { name: /^students$/i })).not.toBeInTheDocument();
  });

  it('redirects authenticated login visitors to the overview route', async () => {
    renderWithAppProviders(<App />, { route: '/login' });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
  });

  it.each(['https://evil.example/', 'javascript:alert(1)', '//evil.example/', '/app.evil'])(
    'rejects unsafe login return destination %s',
    async (returnTo) => {
      renderWithAppProviders(<App />, {
        initialEntries: [
          {
            pathname: '/login',
            state: {
              returnTo,
            },
          },
        ],
      });

      expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /page not found/i })).not.toBeInTheDocument();
    },
  );

  it('shows an initializing auth state without exposing the protected shell', () => {
    const authClient: AuthClient = {
      getSession: vi.fn(
        () =>
          new Promise<Awaited<ReturnType<AuthClient['getSession']>>>(() => {
            // Keep the session lookup pending for this route-guard state test.
          }),
      ),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      signInWithPassword: vi.fn(() =>
        Promise.resolve({
          data: {
            session: null,
            user: null,
          },
          error: null,
        }),
      ),
      signOut: vi.fn(() =>
        Promise.resolve({
          error: null,
        }),
      ),
    };

    render(
      <AuthProvider authClient={authClient}>
        <MemoryRouter initialEntries={['/app/overview']}>
          <App />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/checking private access/i)).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^overview$/i })).not.toBeInTheDocument();
  });

  it('renders the private Supabase email/password login form', () => {
    renderWithAppProviders(<App />, { initialSession: null, route: '/login' });

    expect(
      screen.getByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /^aom$/i })).toBeVisible();
    expect(screen.getByText(/personal reference build/i)).toBeInTheDocument();
    const projectIdentity = screen.getByLabelText(/project identity/i);
    expect(
      within(projectIdentity).getByText(/personal skills development \/ reference build/i),
    ).toBeVisible();
    expect(within(projectIdentity).getByText(/local development/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/0\.0\.0-foundation/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/transitional service metadata only/i)).toBeVisible();
    expect(screen.getByText(/development access only/i)).toBeVisible();
    expect(screen.getByLabelText(/email address/i)).toBeEnabled();
    expect(screen.getByLabelText(/password/i)).toBeEnabled();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeEnabled();
    expect(screen.queryByText(/authentication is not connected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sign in unavailable/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/you have signed out/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/your session ended or is no longer valid/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/register/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/signed in/i)).not.toBeInTheDocument();
  });

  it('validates required login fields before calling Supabase', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient({ session: null });

    renderWithAppProviders(<App />, {
      authClient,
      initialSession: null,
      route: '/login',
    });

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/email address is required/i)).toBeVisible();
    expect(screen.getByText(/password is required/i)).toBeVisible();
    expect(authClient.signInWithPassword).not.toHaveBeenCalled();
  });

  it('validates email format before calling Supabase', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient({ session: null });

    renderWithAppProviders(<App />, {
      authClient,
      initialSession: null,
      route: '/login',
    });

    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), 'test-password');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByText(/enter a valid email address/i)).toBeVisible();
    expect(authClient.signInWithPassword).not.toHaveBeenCalled();
  });

  it('shows a generic login error without exposing raw Supabase error text', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient({
      session: null,
      signInError: createMockAuthError('Email not confirmed internal provider detail'),
    });

    renderWithAppProviders(<App />, {
      authClient,
      initialSession: null,
      route: '/login',
    });

    await user.type(screen.getByLabelText(/email address/i), 'unknown@example.invalid');
    await user.type(screen.getByLabelText(/password/i), 'bad-password');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(GENERIC_SIGN_IN_ERROR_MESSAGE);
    expect(
      screen.queryByText(/email not confirmed internal provider detail/i),
    ).not.toBeInTheDocument();
  });

  it('prevents duplicate login submissions and returns to the intended private route', async () => {
    const user = userEvent.setup();
    const signInSession = createMockSession();
    let resolveSignIn:
      | ((result: {
          data: {
            session: Session;
            user: Session['user'];
          };
          error: AuthError | null;
        }) => void)
      | undefined;

    const authClient: AuthClient = {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: {
            session: null,
          },
          error: null,
        }),
      ),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
      signInWithPassword: vi.fn(
        () =>
          new Promise<{
            data: {
              session: Session;
              user: Session['user'];
            };
            error: AuthError | null;
          }>((resolve) => {
            resolveSignIn = resolve;
          }),
      ),
      signOut: vi.fn(() =>
        Promise.resolve({
          error: null,
        }),
      ),
    };

    renderWithAppProviders(<App />, {
      authClient,
      initialEntries: [
        {
          pathname: '/login',
          state: {
            returnTo: '/app/students',
          },
        },
      ],
      initialSession: null,
    });

    await user.type(
      screen.getByLabelText(/email address/i),
      'reference-auth-smoke@example.invalid',
    );
    await user.type(screen.getByLabelText(/password/i), 'valid-private-password');
    const submitButton = screen.getByRole('button', { name: /^sign in$/i });

    await user.click(submitButton);
    await user.click(submitButton);

    expect(authClient.signInWithPassword).toHaveBeenCalledTimes(1);
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/signing in/i);

    act(() => {
      resolveSignIn?.({
        data: {
          session: signInSession,
          user: signInSession.user,
        },
        error: null,
      });
    });

    expect(await screen.findByRole('heading', { name: /^students$/i })).toBeInTheDocument();
  });

  it('keeps unprovisioned authenticated accounts out of the application shell', async () => {
    const { authorizationClient } = createMockAuthorizationClient({
      accountAccessState: EMPTY_ACCOUNT_ACCESS_STATE,
      context: null,
    });

    renderWithAppProviders(<App />, {
      authorizationClient,
      route: '/app/students',
    });

    expect(await screen.findByText(/access not provisioned/i)).toBeVisible();
    expect(screen.getByText(/not linked to a reference application profile yet/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /check access again/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /^sign out$/i })).toBeEnabled();
    expect(screen.queryByRole('heading', { name: /^students$/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/current authorization context/i)).not.toBeInTheDocument();
  });

  it('keeps inactive profiles out of the application shell with friendly status wording', async () => {
    const disabledAccountState: AccountAccessState = {
      accountStatus: 'disabled',
      displayName: 'Reference Authorization User',
      isDemoAccount: true,
      profileExists: true,
      userProfileId: '00000000-0000-4000-8000-000000000104',
    };
    const { authorizationClient } = createMockAuthorizationClient({
      accountAccessState: disabledAccountState,
    });

    renderWithAppProviders(<App />, {
      authorizationClient,
      route: '/app/administration',
    });

    expect(await screen.findByText(/account disabled/i)).toBeVisible();
    expect(screen.getByText(/cannot open the application workspace/i)).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^administration$/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/user_profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/rpc/i)).not.toBeInTheDocument();
  });

  it.each([
    {
      accountStatus: 'invited',
      title: /account awaiting activation/i,
    },
    {
      accountStatus: 'suspended',
      title: /account suspended/i,
    },
    {
      accountStatus: 'archived',
      title: /account archived/i,
    },
  ] satisfies {
    accountStatus: Exclude<AccountAccessState['accountStatus'], null | 'active'>;
    title: RegExp;
  }[])(
    'denies $accountStatus profiles without redirecting back to login',
    async ({ accountStatus, title }) => {
      const accountAccessState: AccountAccessState = {
        accountStatus,
        displayName: 'Reference Authorization User',
        isDemoAccount: true,
        profileExists: true,
        userProfileId: '00000000-0000-4000-8000-000000000104',
      };
      const { authorizationClient } = createMockAuthorizationClient({ accountAccessState });

      renderWithAppProviders(<App />, {
        authorizationClient,
        route: '/app/overview',
      });

      expect(await screen.findByText(title)).toBeVisible();
      expect(screen.getByRole('button', { name: /check access again/i })).toBeEnabled();
      expect(
        screen.queryByRole('heading', { name: /assessment operations manager/i }),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /^overview$/i })).not.toBeInTheDocument();
    },
  );

  it('fails closed when account access cannot be verified', async () => {
    const { authorizationClient } = createMockAuthorizationClient({
      accountAccessError: {
        message: 'raw rpc detail',
      },
    });

    renderWithAppProviders(<App />, {
      authorizationClient,
      route: '/app/overview',
    });

    expect(await screen.findByText(/access check unavailable/i)).toBeVisible();
    expect(screen.getByText(/access could not be confirmed right now/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /try again/i })).toBeEnabled();
    expect(screen.queryByRole('heading', { name: /^overview$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/raw rpc detail/i)).not.toBeInTheDocument();
  });

  it('signs out from the application shell and returns to login with a signed-out notice', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient();

    renderWithAppProviders(<App />, {
      authClient,
      route: '/app/overview',
    });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^sign out$/i }));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/you have signed out/i)).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^overview$/i })).not.toBeInTheDocument();
  });

  it('prevents duplicate sign-out submissions while logout is pending', async () => {
    const user = userEvent.setup();
    let resolveSignOut: ((result: { error: AuthError | null }) => void) | undefined;
    const { authClient } = createMockAuthClient();
    authClient.signOut = vi.fn(
      () =>
        new Promise<{ error: AuthError | null }>((resolve) => {
          resolveSignOut = resolve;
        }),
    );

    renderWithAppProviders(<App />, {
      authClient,
      route: '/app/overview',
    });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();

    const signOutButton = screen.getByRole('button', { name: /^sign out$/i });
    await user.click(signOutButton);
    await user.click(signOutButton);

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    expect(signOutButton).toBeDisabled();
    expect(signOutButton).toHaveTextContent(/signing out/i);

    act(() => {
      resolveSignOut?.({ error: null });
    });

    expect(
      await screen.findByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
  });

  it('does not fake sign-out success when Supabase sign-out fails', async () => {
    const user = userEvent.setup();
    const { authClient } = createMockAuthClient({
      signOutError: createMockAuthError('Internal sign-out failure'),
    });

    renderWithAppProviders(<App />, {
      authClient,
      route: '/app/overview',
    });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^sign out$/i }));

    expect(authClient.signOut).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveTextContent(GENERIC_SIGN_OUT_ERROR_MESSAGE);
    expect(screen.queryByText(/internal sign-out failure/i)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /assessment operations manager/i }),
    ).not.toBeInTheDocument();
  });

  it('redirects to login with a session-ended notice when Supabase clears an active session', async () => {
    const { authClient, emitAuthStateChange } = createMockAuthClient();

    renderWithAppProviders(<App />, {
      authClient,
      route: '/app/overview',
    });

    expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();

    act(() => {
      emitAuthStateChange('SIGNED_OUT', null);
    });

    expect(
      await screen.findByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/your session ended or is no longer valid/i)).toBeVisible();
    expect(screen.queryByRole('heading', { name: /^overview$/i })).not.toBeInTheDocument();
  });

  it('clears working-campus selection across sign-out and re-login', async () => {
    const user = userEvent.setup();
    const multiCampusContext = createMockAuthorizationContext({
      campusGrants: [NORTH_CAMPUS_GRANT, SOUTH_CAMPUS_GRANT],
      campusRoles: [NORTH_TRAINER_ROLE, SOUTH_CAMPUS_MANAGER_ROLE],
    });
    const { authClient } = createMockAuthClient();
    const { authorizationClient } = createMockAuthorizationClient({ context: multiCampusContext });

    renderWithAppProviders(<App />, {
      authClient,
      authorizationClient,
      route: '/app/overview',
    });

    const authorizationContext = await screen.findByLabelText(/current authorization context/i);
    const campusSelector = within(authorizationContext).getByLabelText(/working campus/i);

    await user.selectOptions(campusSelector, 'campus-north');

    expect(campusSelector).toHaveValue('campus-north');

    await user.click(screen.getByRole('button', { name: /^sign out$/i }));

    expect(await screen.findByText(/you have signed out/i)).toBeVisible();

    await user.type(
      screen.getByLabelText(/email address/i),
      'reference-auth-smoke@example.invalid',
    );
    await user.type(screen.getByLabelText(/password/i), 'valid-private-password');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    const reloggedAuthorizationContext = await screen.findByLabelText(
      /current authorization context/i,
    );
    const reloggedCampusSelector = within(reloggedAuthorizationContext).getByLabelText(
      /working campus/i,
    );

    expect(reloggedCampusSelector).toHaveValue('');
    expect(screen.getByRole('option', { name: /^north campus$/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^south campus$/i })).toBeInTheDocument();
  });

  it.each([
    {
      firstAccountState: EMPTY_ACCOUNT_ACCESS_STATE,
      firstError: null,
      firstTitle: /access not provisioned/i,
      refreshLabel: /check access again/i,
    },
    {
      firstAccountState: {
        accountStatus: 'invited',
        displayName: 'Reference Authorization User',
        isDemoAccount: true,
        profileExists: true,
        userProfileId: '00000000-0000-4000-8000-000000000104',
      },
      firstError: null,
      firstTitle: /account awaiting activation/i,
      refreshLabel: /check access again/i,
    },
    {
      firstAccountState: EMPTY_ACCOUNT_ACCESS_STATE,
      firstError: { message: 'raw account access failure' },
      firstTitle: /access check unavailable/i,
      refreshLabel: /try again/i,
    },
  ] satisfies {
    firstAccountState: AccountAccessState;
    firstError: { message: string } | null;
    firstTitle: RegExp;
    refreshLabel: RegExp;
  }[])(
    'refreshes from a denied $firstTitle state to the active application shell',
    async ({ firstAccountState, firstError, firstTitle, refreshLabel }) => {
      const user = userEvent.setup();
      let accountStateCallCount = 0;
      const rpc = vi.fn<AuthorizationClient['rpc']>((fn) => {
        if (fn === 'get_my_account_access_state') {
          accountStateCallCount += 1;

          if (accountStateCallCount === 1) {
            return Promise.resolve({
              data: toAccountAccessRpcData(firstAccountState),
              error: firstError,
            });
          }

          return Promise.resolve({
            data: toAccountAccessRpcData(MOCK_ACTIVE_ACCOUNT_ACCESS_STATE),
            error: null,
          });
        }

        return Promise.resolve({
          data: toAuthorizationRpcData(createMockAuthorizationContext()),
          error: null,
        });
      });
      const authorizationClient: AuthorizationClient = { rpc };

      renderWithAppProviders(<App />, {
        authorizationClient,
        route: '/app/overview',
      });

      expect(await screen.findByText(firstTitle)).toBeVisible();

      await user.click(screen.getByRole('button', { name: refreshLabel }));

      expect(await screen.findByRole('heading', { name: /^overview$/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/current authorization context/i)).toBeInTheDocument();
    },
  );

  it('renders the design-system preview at the design-system route', () => {
    renderWithAppProviders(<App />, { route: '/design-system' });

    expect(
      screen.getByRole('heading', { name: /assessment operations manager/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /^aom$/i })).toBeVisible();
    expect(screen.getByText(/application visual system preview/i)).toBeInTheDocument();
    expect(screen.getByText(/reference design system/i)).toBeInTheDocument();
    expect(screen.getByText(/design system preview/i)).toBeInTheDocument();
    const projectIdentity = screen.getByLabelText(/project identity/i);
    expect(
      within(projectIdentity).getByText(/personal skills development \/ reference build/i),
    ).toBeVisible();
    expect(within(projectIdentity).getByText(/local development/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/0\.0\.0-foundation/i)).toBeVisible();
  });

  it('renders design-system state previews and the harmless confirmation example', async () => {
    const user = userEvent.setup();

    renderWithAppProviders(<App />, { route: '/design-system' });

    expect(screen.getByText(/system states/i)).toBeInTheDocument();
    expect(screen.getByText(/loading preview content/i)).toBeInTheDocument();
    expect(screen.getByText(/no preview content to display/i)).toBeInTheDocument();
    expect(screen.getByText(/preview action could not continue/i)).toBeInTheDocument();
    expect(screen.getByText(/preview state ready/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open confirmation example/i }));

    const dialog = screen.getByRole('alertdialog', {
      name: /clear this temporary preview/i,
    });
    expect(within(dialog).getByText(/does not delete data/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open confirmation example/i }));
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: /clear preview/i }),
    );

    expect(screen.getByText(/preview action confirmed/i)).toBeInTheDocument();
  });

  it('renders the Not Found route with a link back home', () => {
    renderWithAppProviders(<App />, { route: '/admin/login' });

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    const projectIdentity = screen.getByLabelText(/project identity/i);
    expect(
      within(projectIdentity).getByText(/personal skills development \/ reference build/i),
    ).toBeVisible();
    expect(within(projectIdentity).getByText(/local development/i)).toBeVisible();
    expect(within(projectIdentity).getByText(/0\.0\.0-foundation/i)).toBeVisible();
    expect(screen.getByText(/the requested page was not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to application overview/i })).toHaveAttribute(
      'href',
      '/app/overview',
    );
  });
});

describe('visual design system primitives', () => {
  it('keeps button semantics and disabled state intact', () => {
    renderWithAppProviders(
      <>
        <Button>Save example</Button>
        <Button disabled variant="secondary">
          Disabled example
        </Button>
      </>,
    );

    expect(screen.getByRole('button', { name: /save example/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /disabled example/i })).toBeDisabled();
  });

  it('renders accessible labelled form controls', () => {
    renderWithAppProviders(
      <>
        <TextInputField helpText="Search help" label="Example search field" type="search" />
        <SelectField
          label="Example filter"
          options={[
            { label: 'All examples', value: 'all' },
            { label: 'Ready examples', value: 'ready' },
          ]}
        />
      </>,
    );

    expect(screen.getByLabelText(/example search field/i)).toHaveAttribute('type', 'search');
    expect(screen.getByLabelText(/example filter/i)).toBeInTheDocument();
    expect(screen.getByText(/search help/i)).toBeInTheDocument();
  });

  it('renders status badge text so colour is not the only signal', () => {
    renderWithAppProviders(<StatusBadge variant="success">Ready for review</StatusBadge>);

    expect(screen.getByText(/ready for review/i)).toBeVisible();
  });

  it('renders semantic table column headers', () => {
    interface ExampleRow {
      area: string;
      status: string;
    }

    const columns: DataTableColumn<ExampleRow>[] = [
      {
        header: 'Area',
        key: 'area',
        render: (row) => row.area,
      },
      {
        header: 'Status',
        key: 'status',
        render: (row) => row.status,
      },
    ];

    renderWithAppProviders(
      <DataTable
        caption="Example table"
        columns={columns}
        getRowKey={(row) => row.area}
        rows={[{ area: 'Foundation', status: 'Ready' }]}
      />,
    );

    expect(screen.getByRole('columnheader', { name: /area/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /example table/i })).toBeInTheDocument();
  });
});
