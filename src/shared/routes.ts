// Route ids (P01, A01, U10…) follow docs/README.md → Mapa de navegação.
export const paths = {
  // Public
  home: '/', // P01
  homeSection: (section: 'como-funciona' | 'novelos' | 'calendario') => `/#${section}`,
  discipline: (discipline: string) => `/novelos/${discipline}`,
  offer: (discipline: string, exam: number | string) => `/novelos/${discipline}/${exam}`, // P02

  // Authentication
  signUp: '/cadastro', // A01
  login: '/entrar', // A02
  recoverPassword: '/recuperar-senha', // A03
  resetPassword: '/redefinir-senha',
  completeProfile: '/completar-cadastro',

  // Participant
  dashboard: '/participante', // U01
  materials: '/materiais', // U02
  pieces: '/pecas', // U03
  questions: '/questoes', // U06
  history: '/historico', // U08
  notebook: '/caderno', // U09
  account: '/conta', // U10

  // Earlier content (trilhas, estudo de caso, flashcards), kept alongside.
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

  // Administration
  admin: '/admin',
  adminCases: '/admin/casos',
  adminNewCase: '/admin/casos/novo',
  adminCase: (id: string) => `/admin/casos/${id}`,
  adminFlashcards: '/admin/flashcards',
  adminLessonFlashcards: (lessonId: string) => `/admin/flashcards/licoes/${lessonId}`,
} as const;

/** Query parameter carrying the chosen offer through sign-up and Google sign-in (SB02). */
export const OFFER_PARAM = 'oferta';
