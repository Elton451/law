# US-002 — Login e logout

**Persona:** Estudante / Administrador
**Prioridade:** Alta

## História
Como usuário cadastrado, quero entrar e sair da minha conta com e-mail e senha, para acessar meu conteúdo com segurança.

## Descrição
Tela de login única para estudantes e administradores. Após o login, o sistema direciona cada perfil para a área correspondente.

## Critérios de aceite
- [ ] O usuário consegue fazer login com e-mail e senha válidos.
- [ ] Credenciais inválidas exibem uma mensagem genérica, sem revelar se o e-mail existe.
- [ ] O estudante é redirecionado para a tela de trilhas (US-006).
- [ ] O administrador é redirecionado para o painel administrativo (US-021).
- [ ] O usuário consegue fazer logout a partir do menu lateral, encerrando a sessão.
- [ ] A sessão persiste entre recarregamentos de página até o logout ou a expiração.

## Regras de negócio
- O sistema possui dois perfis: `estudante` e `admin`.
- Tentativas repetidas de login malsucedidas devem ser limitadas (rate limit).

## Fora de escopo
- Autenticação em dois fatores.
- Login social.

## Dependências
- US-001.
