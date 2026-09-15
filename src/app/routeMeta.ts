import type { AppRouteMeta } from '../types/navigation';

export const appRootRoute = {
  breadcrumbLabel: 'Application',
  id: 'app-root',
  label: 'Application',
  pageTitle: 'Application',
  path: '/app',
  showInNavigation: false,
} satisfies AppRouteMeta;

export const overviewRoute = {
  breadcrumbLabel: 'Overview',
  description:
    'Presentation-only dashboard preview using static synthetic values. Live dashboard data is not implemented yet.',
  id: 'overview',
  label: 'Overview',
  navigationGroup: 'application',
  pageTitle: 'Overview',
  path: '/app/overview',
  showInNavigation: true,
} satisfies AppRouteMeta;

export const studentsRoute = {
  breadcrumbLabel: 'Students',
  description:
    'Presentation-only student management preview using synthetic rows and local filtering only.',
  id: 'students',
  label: 'Students',
  navigationGroup: 'application',
  pageTitle: 'Students',
  path: '/app/students',
  showInNavigation: true,
} satisfies AppRouteMeta;

export const examsRoute = {
  breadcrumbLabel: 'Exams',
  description:
    'Presentation-only exam catalogue preview that keeps generic canonical placeholders separate from source-label examples.',
  id: 'exams',
  label: 'Exams',
  navigationGroup: 'application',
  pageTitle: 'Exams',
  path: '/app/exams',
  showInNavigation: true,
} satisfies AppRouteMeta;

export const reportsRoute = {
  breadcrumbLabel: 'Reports',
  description:
    'Presentation-only reporting structure. Reports and exports require later backend, permission, and reference data work.',
  id: 'reports',
  label: 'Reports',
  navigationGroup: 'application',
  pageTitle: 'Reports',
  path: '/app/reports',
  showInNavigation: true,
} satisfies AppRouteMeta;

export const administrationRoute = {
  breadcrumbLabel: 'Administration',
  description:
    'Presentation-only administration structure. User access, records, and controls are not implemented in this checkpoint.',
  id: 'administration',
  label: 'Administration',
  navigationGroup: 'application',
  pageTitle: 'Administration',
  path: '/app/administration',
  showInNavigation: true,
} satisfies AppRouteMeta;

export const designSystemRoute = {
  breadcrumbLabel: 'Design System',
  description: 'Reusable visual foundation preview for the reference build.',
  id: 'design-system',
  label: 'Design System',
  navigationGroup: 'support',
  pageTitle: 'Design System',
  path: '/design-system',
  showInNavigation: true,
} satisfies AppRouteMeta;

export const loginRoute = {
  breadcrumbLabel: 'Login',
  description: 'Private email/password access for configured reference accounts.',
  id: 'login',
  label: 'Login',
  pageTitle: 'Login',
  path: '/login',
  showInNavigation: false,
} satisfies AppRouteMeta;

export const notFoundRoute = {
  breadcrumbLabel: 'Not Found',
  id: 'not-found',
  label: 'Not Found',
  pageTitle: 'Page Not Found',
  path: '/',
  showInNavigation: false,
} satisfies AppRouteMeta;

export const applicationRoutes = [
  overviewRoute,
  studentsRoute,
  examsRoute,
  reportsRoute,
  administrationRoute,
] as const;

export const navigationRoutes = [...applicationRoutes, designSystemRoute] as const;

export const routeMeta = [
  appRootRoute,
  ...applicationRoutes,
  designSystemRoute,
  loginRoute,
  notFoundRoute,
] as const;

export function findRouteByPath(pathname: string) {
  return routeMeta.find((route) => route.path === pathname);
}
