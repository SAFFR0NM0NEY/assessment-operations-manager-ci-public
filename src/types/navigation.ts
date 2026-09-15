export type AppRouteId =
  | 'administration'
  | 'app-root'
  | 'design-system'
  | 'exams'
  | 'login'
  | 'not-found'
  | 'overview'
  | 'reports'
  | 'students';

export interface AppRouteMeta {
  breadcrumbLabel: string;
  description?: string;
  id: AppRouteId;
  label: string;
  navigationGroup?: 'application' | 'support';
  pageTitle: string;
  path: string;
  showInNavigation: boolean;
}
