export const paths = {
  home: '/',
  login: '/entrar',
  signUp: '/cadastro',
  trails: '/trilhas',
  trail: (slug: string) => `/trilhas/${slug}`,
  caseStudy: (slug: string) => `/trilhas/${slug}/estudo-de-caso`,
  caseAttempt: (slug: string, attemptId: string) =>
    `/trilhas/${slug}/estudo-de-caso/tentativas/${attemptId}`,
  profile: '/perfil',
  settings: '/configuracoes',
  admin: '/admin',
  adminCases: '/admin/casos',
  adminNewCase: '/admin/casos/novo',
  adminCase: (id: string) => `/admin/casos/${id}`,
} as const;
