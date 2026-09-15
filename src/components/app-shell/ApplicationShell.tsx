import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';

import {
  applicationRoutes,
  designSystemRoute,
  findRouteByPath,
  navigationRoutes,
  overviewRoute,
} from '../../app/routeMeta';
import { ProjectIdentity } from '../project-identity';
import { SelectField } from '../ui';
import { SignOutButton } from '../../features/auth';
import { useAuthorization, type AuthorizationRole } from '../../features/authorization';
import { useCampusContext } from '../../features/campus-context';
import { classNames } from '../../lib/classNames';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import styles from './ApplicationShell.module.css';

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary application navigation">
      <ul className={styles.navList}>
        {navigationRoutes.map((route, index) => {
          const isSupportRoute = index === applicationRoutes.length;

          return (
            <li key={route.id}>
              {isSupportRoute ? (
                <>
                  <div className={styles.navDivider} />
                  <span className={styles.navGroupLabel}>Project support</span>
                </>
              ) : null}
              <NavLink
                className={({ isActive }) =>
                  classNames(styles.navLink, isActive && styles.navLinkActive)
                }
                end={route.path === overviewRoute.path || route.path === designSystemRoute.path}
                onClick={onNavigate}
                to={route.path}
              >
                {({ isActive }) => (
                  <>
                    <span>{route.label}</span>
                    {isActive ? <span className={styles.currentMarker}>Current</span> : null}
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className={styles.sidebarBrand}>
      <img
        alt="AOM"
        className={styles.brandLogo}
        height="48"
        src="/branding/aom-mark.svg"
        width="163"
      />
      <div className={styles.brandCopy}>
        <div className={styles.productName}>Assessment Operations Manager</div>
        <p className={styles.brandContext}>Reference operations build</p>
      </div>
    </div>
  );
}

function getInitials(displayName: string | null) {
  if (!displayName) {
    return 'AU';
  }

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join('');

  return initials || 'AU';
}

function formatCampusRole(role: AuthorizationRole) {
  return role.campusName ? `${role.roleName} - ${role.campusName}` : role.roleName;
}

function getOrganisationRoleSummary(roles: AuthorizationRole[]) {
  const uniqueRoleNames = Array.from(
    new Set(roles.filter((role) => role.scopeKind === 'organisation').map((role) => role.roleName)),
  );

  return uniqueRoleNames.length > 0 ? uniqueRoleNames.join(', ') : 'No business role assigned';
}

function getCampusRoleSummary(roles: AuthorizationRole[]) {
  const uniqueRoleNames = Array.from(
    new Set(
      roles.filter((role) => role.scopeKind === 'campus').map((role) => formatCampusRole(role)),
    ),
  );

  return uniqueRoleNames.length > 0 ? uniqueRoleNames.join(', ') : 'No campus role assigned';
}

function getAuthorizationStatusSummary(status: ReturnType<typeof useAuthorization>['status']) {
  if (status === 'initializing') {
    return 'Loading authorization';
  }

  if (status === 'error') {
    return 'Authorization unavailable';
  }

  if (status === 'unprovisioned') {
    return 'No business profile provisioned';
  }

  if (status === 'inactive') {
    return 'Account inactive';
  }

  return 'Authorization ready';
}

export function ApplicationShell() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const location = useLocation();
  const authorization = useAuthorization();
  const campusContext = useCampusContext();
  const currentRoute = findRouteByPath(location.pathname) ?? overviewRoute;
  const breadcrumbs = useMemo<BreadcrumbItem[]>(
    () => [{ label: currentRoute.breadcrumbLabel }],
    [currentRoute.breadcrumbLabel],
  );
  const mobileNavigationId = 'mobile-application-navigation';

  function closeNavigation() {
    setIsNavigationOpen(false);
  }

  const accountName = authorization.profile?.displayName ?? 'Authorization pending';
  const accountInitials = getInitials(authorization.profile?.displayName ?? null);
  const authorizationStatusSummary = getAuthorizationStatusSummary(authorization.status);
  const organisationRoleSummary =
    authorization.status === 'ready'
      ? getOrganisationRoleSummary(authorization.roles)
      : authorizationStatusSummary;
  const campusRoleSummary =
    authorization.status === 'ready' ? getCampusRoleSummary(authorization.roles) : 'Unavailable';
  const selectedCampusRoleSummary =
    campusContext.selectedCampus?.roles.map((role) => role.roleName).join(', ') ?? null;
  const campusSelectorPlaceholder =
    campusContext.selectionStatus === 'none' ? 'No campus context' : 'Select campus';
  const isCampusSelectorDisabled = campusContext.selectionStatus === 'none';

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <div className={styles.shell}>
        <aside className={styles.desktopSidebar}>
          <SidebarBrand />
          <NavigationLinks />
        </aside>

        <div className={styles.mainColumn}>
          <ProjectIdentity variant="banner" />
          <header className={styles.topBar}>
            <div className={styles.topBarTitle}>
              <button
                aria-controls={mobileNavigationId}
                aria-expanded={isNavigationOpen}
                className={styles.menuButton}
                onClick={() => {
                  setIsNavigationOpen((isOpen) => !isOpen);
                }}
                type="button"
              >
                Menu
              </button>
              <div className={styles.pageContext}>
                <span className={styles.pageContextLabel}>Application section</span>
                <span className={styles.pageContextTitle}>{currentRoute.pageTitle}</span>
              </div>
            </div>

            <aside aria-label="Current authorization context" className={styles.accountSummary}>
              <div aria-hidden="true" className={styles.accountAvatar}>
                {accountInitials}
              </div>
              <div className={styles.accountText}>
                <span className={styles.accountLabel}>Authorization context</span>
                <span className={styles.accountName}>{accountName}</span>
                <span className={styles.accountMeta}>Organisation: {organisationRoleSummary}</span>
                <span className={styles.accountMeta}>Campus roles: {campusRoleSummary}</span>
              </div>
              <div className={styles.campusSelectorGroup}>
                <SelectField
                  className={styles.campusSelector}
                  disabled={isCampusSelectorDisabled}
                  label="Working campus"
                  onChange={(event) => {
                    const nextCampusId = event.currentTarget.value;

                    if (nextCampusId) {
                      campusContext.selectCampus(nextCampusId);
                    } else {
                      campusContext.clearCampusSelection();
                    }
                  }}
                  options={campusContext.selectableCampuses.map((campus) => ({
                    label: campus.campusName,
                    value: campus.campusId,
                  }))}
                  placeholder={campusSelectorPlaceholder}
                  value={campusContext.selectedCampusId ?? ''}
                />
                {selectedCampusRoleSummary ? (
                  <span className={styles.selectedCampusRole}>
                    Current role: {selectedCampusRoleSummary}
                  </span>
                ) : null}
              </div>
              <div className={styles.signOutGroup}>
                <SignOutButton
                  className={styles.signOutButton}
                  errorClassName={styles.signOutError}
                />
              </div>
            </aside>
          </header>

          <div className={styles.content}>
            <Breadcrumbs items={breadcrumbs} />
            <main id="main-content" tabIndex={-1}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {isNavigationOpen ? (
        <button
          aria-label="Close navigation"
          className={styles.mobileBackdrop}
          onClick={closeNavigation}
          type="button"
        />
      ) : null}
      <div
        aria-label="Main navigation"
        aria-modal="true"
        className={styles.mobileDrawer}
        hidden={!isNavigationOpen}
        id={mobileNavigationId}
        role="dialog"
      >
        <div className={styles.drawerHeader}>
          <SidebarBrand />
          <button className={styles.closeButton} onClick={closeNavigation} type="button">
            Close
          </button>
        </div>
        <NavigationLinks onNavigate={closeNavigation} />
      </div>
    </>
  );
}
