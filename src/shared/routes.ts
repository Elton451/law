export const paths = {
  home: '/',
  login: '/entrar',
  signUp: '/cadastro',
  trails: '/trilhas',
  trail: (slug: string) => `/trilhas/${slug}`,
  profile: '/perfil',
  settings: '/configuracoes',
  admin: '/admin',
} as const;
