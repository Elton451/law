export const paths = {
  home: '/',
  login: '/entrar',
  signUp: '/cadastro',
  trails: '/trilhas',
  trail: (slug: string) => `/trilhas/${slug}`,
  caseStudy: (slug: string) => `/trilhas/${slug}/estudo-de-caso`,
  caseAttempt: (slug: string, attemptId: string) =>
    `/trilhas/${slug}/estudo-de-caso/tentativas/${attemptId}`,
  flashcards: (slug: string) => `/trilhas/${slug}/flashcards`,
  lessonFlashcards: (slug: string, lessonId: string) =>
    `/trilhas/${slug}/flashcards/licoes/${lessonId}`,
  trailReview: (slug: string) => `/trilhas/${slug}/flashcards/revisao`,
  review: '/revisao',
  reviewSession: '/revisao/sessao',
  profile: '/perfil',
  settings: '/configuracoes',
  admin: '/admin',
  adminCases: '/admin/casos',
  adminNewCase: '/admin/casos/novo',
  adminCase: (id: string) => `/admin/casos/${id}`,
  adminFlashcards: '/admin/flashcards',
  adminLessonFlashcards: (lessonId: string) => `/admin/flashcards/licoes/${lessonId}`,
} as const;
