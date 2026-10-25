import { ConfigProvider } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AdminCaseFormPage, AdminCasesPage } from '@modules/admin';
import { LoginPage, SignUpPage } from '@modules/auth';
import { AttemptPage, CaseStudyAreaPage } from '@modules/case-study';
import Home from '@modules/home';
import { TrailPage, TrailsPage } from '@modules/trails';
import { AuthProvider } from '@shared/auth/AuthProvider';
import RedirectIfAuthenticated from '@shared/auth/RedirectIfAuthenticated';
import RequireAuth from '@shared/auth/RequireAuth';
import { paths } from '@shared/routes';
import { antdTheme } from '@shared/theme/antdTheme';
import { GlobalStyle } from '@shared/theme/GlobalStyle';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path={paths.home} element={<Home />} />
            <Route
              path={paths.login}
              element={
                <RedirectIfAuthenticated>
                  <LoginPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path={paths.signUp}
              element={
                <RedirectIfAuthenticated>
                  <SignUpPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path={paths.trails}
              element={
                <RequireAuth>
                  <TrailsPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.trail(':slug')}
              element={
                <RequireAuth>
                  <TrailPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.caseStudy(':slug')}
              element={
                <RequireAuth>
                  <CaseStudyAreaPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.caseAttempt(':slug', ':attemptId')}
              element={
                <RequireAuth>
                  <AttemptPage />
                </RequireAuth>
              }
            />
            {/* Casos concretos is the only admin area so far (US-024). */}
            <Route path={paths.admin} element={<Navigate to={paths.adminCases} replace />} />
            <Route
              path={paths.adminCases}
              element={
                <RequireAuth role="admin">
                  <AdminCasesPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.adminNewCase}
              element={
                <RequireAuth role="admin">
                  <AdminCaseFormPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.adminCase(':caseId')}
              element={
                <RequireAuth role="admin">
                  <AdminCaseFormPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to={paths.home} replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
