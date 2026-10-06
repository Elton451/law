import { ConfigProvider } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Admin from '@modules/admin';
import { LoginPage, SignUpPage } from '@modules/auth';
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
              path={paths.admin}
              element={
                <RequireAuth role="admin">
                  <Admin />
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
