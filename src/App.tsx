import { ConfigProvider } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import {
  AdminCaseFormPage,
  AdminCasesPage,
  AdminFlashcardLessonsPage,
  AdminLessonFlashcardsPage,
} from '@modules/admin';
import { AccountPage } from '@modules/account';
import {
  CompleteProfilePage,
  LoginPage,
  RecoverPasswordPage,
  ResetPasswordPage,
  SignUpPage,
} from '@modules/auth';
import { OfferPage } from '@modules/catalog';
import { AttemptPage, CaseStudyAreaPage } from '@modules/case-study';
import {
  FlashcardsAreaPage,
  LessonSessionPage,
  ReviewPage,
  ReviewSessionPage,
} from '@modules/flashcards';
import Home from '@modules/home';
import { DashboardPage } from '@modules/participant';
import { TrailPage, TrailsPage } from '@modules/trails';
import { AuthProvider } from '@shared/auth/AuthProvider';
import RedirectIfAuthenticated from '@shared/auth/components/RedirectIfAuthenticated';
import RequireAuth from '@shared/auth/components/RequireAuth';
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
            {/* Public (P01, P02) */}
            <Route path={paths.home} element={<Home />} />
            <Route path={paths.discipline(':disciplina')} element={<OfferPage />} />
            <Route path={paths.offer(':disciplina', ':exame')} element={<OfferPage />} />

            {/* Authentication (A01–A03) */}
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
              path={paths.recoverPassword}
              element={
                <RedirectIfAuthenticated>
                  <RecoverPasswordPage />
                </RedirectIfAuthenticated>
              }
            />
            {/* Not guest-only: the recovery link signs the person in to get here. */}
            <Route path={paths.resetPassword} element={<ResetPasswordPage />} />
            <Route
              path={paths.completeProfile}
              element={
                <RequireAuth allowIncompleteProfile>
                  <CompleteProfilePage />
                </RequireAuth>
              }
            />

            {/* Participant (U01, U10) */}
            <Route
              path={paths.dashboard}
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.account}
              element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              }
            />

            {/* Trilhas, estudo de caso and flashcards */}
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
            <Route
              path={paths.flashcards(':slug')}
              element={
                <RequireAuth>
                  <FlashcardsAreaPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.lessonFlashcards(':slug', ':lessonId')}
              element={
                <RequireAuth>
                  <LessonSessionPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.trailReview(':slug')}
              element={
                <RequireAuth>
                  <ReviewSessionPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.review}
              element={
                <RequireAuth>
                  <ReviewPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.reviewSession}
              element={
                <RequireAuth>
                  <ReviewSessionPage />
                </RequireAuth>
              }
            />
            {/* Casos concretos is the admin's landing area (US-024). */}
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
            <Route
              path={paths.adminFlashcards}
              element={
                <RequireAuth role="admin">
                  <AdminFlashcardLessonsPage />
                </RequireAuth>
              }
            />
            <Route
              path={paths.adminLessonFlashcards(':lessonId')}
              element={
                <RequireAuth role="admin">
                  <AdminLessonFlashcardsPage />
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
