import { Navigate, Route, Routes } from 'react-router';

import { ApplicationShell } from '../components/app-shell';
import { RequireApplicationAccess } from '../features/application-access';
import { RequireAuthentication } from '../features/auth';
import { PlaceholderPage } from '../features/app/PlaceholderPage';
import { FoundationPage } from '../features/foundation/FoundationPage';
import { LoginPage } from '../features/login/LoginPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import {
  administrationRoute,
  appRootRoute,
  designSystemRoute,
  examsRoute,
  loginRoute,
  overviewRoute,
  reportsRoute,
  studentsRoute,
} from './routeMeta';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Navigate replace to={overviewRoute.path} />} path="/" />
      <Route element={<LoginPage />} path={loginRoute.path} />
      <Route element={<RequireAuthentication />}>
        <Route element={<RequireApplicationAccess />}>
          <Route element={<ApplicationShell />} path={appRootRoute.path}>
            <Route index element={<Navigate replace to={overviewRoute.path} />} />
            <Route element={<PlaceholderPage route={overviewRoute} />} path="overview" />
            <Route element={<PlaceholderPage route={studentsRoute} />} path="students" />
            <Route element={<PlaceholderPage route={examsRoute} />} path="exams" />
            <Route element={<PlaceholderPage route={reportsRoute} />} path="reports" />
            <Route
              element={<PlaceholderPage route={administrationRoute} />}
              path="administration"
            />
          </Route>
        </Route>
      </Route>
      <Route element={<FoundationPage />} path={designSystemRoute.path} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
