# Novelo Jurídico — Requisitos do MVP

Aplicação web (mobile first) de estudos de Direito, estilo Duolingo, com trilhas gamificadas, flashcards, resumos e estudo de caso para a 2ª fase da OAB.

## Premissas gerais
- **Plataforma:** apenas web, mobile first e responsiva.
- **Perfis:** `estudante` e `admin` (perfil único, com acesso total).
- **Trilhas fixas (7):** Administrativo, Civil, Constitucional, Empresarial, Penal, Trabalhista e Tributário. São gerenciadas direto no banco e exibidas em ordem alfabética.
- **Estrutura:** Trilha → Módulos → Lições (resumos e flashcards). Navegação livre, sem bloqueios.
- **Gamificação do MVP:** XP e streak.
- **Conteúdo:** publicado imediatamente, sem fluxo de aprovação.

## Fora do MVP
Pagamento/checkout, login social, gato/avatar personalizável, cursor personalizado, ranking, níveis, #Desenrolei, outros formatos de flashcard e correção automática de casos.

## Glossário
- **Trilha (novelo):** área do Direito.
- **Módulo / Lição:** agrupamentos de conteúdo dentro da trilha.
- **Resumo:** texto teórico escrito pelo admin.
- **Flashcard:** card de frente/verso com autoavaliação.
- **Caso concreto:** enunciado de prova (OAB ou autoral) para redigir uma peça.
- **Gabarito:** resposta de referência do caso, nas 5 seções da peça.

## Índice de User Stories
- [US-001 — Cadastro de usuário](./US-001-cadastro-de-usuario.md)
- [US-002 — Login e logout](./US-002-login-e-logout.md)
- [US-003 — Recuperação de senha](./US-003-recuperacao-de-senha.md)
- [US-004 — Controle de acesso por perfil](./US-004-controle-de-acesso-por-perfil.md)
- [US-005 — Página inicial (landing page)](./US-005-pagina-inicial.md)
- [US-006 — Listagem de trilhas](./US-006-listagem-de-trilhas.md)
- [US-007 — Página da matéria (trilha)](./US-007-pagina-da-materia.md)
- [US-008 — Leitura de resumo](./US-008-leitura-de-resumo.md)
- [US-009 — Estudo com flashcards](./US-009-estudo-com-flashcards.md)
- [US-010 — Revisão com repetição espaçada](./US-010-repeticao-espacada.md)
- [US-011 — Sistema de XP](./US-011-sistema-de-xp.md)
- [US-012 — Streak (dias seguidos de estudo)](./US-012-streak.md)
- [US-013 — Perfil do usuário](./US-013-perfil-do-usuario.md)
- [US-014 — Configuração do tempo de prova](./US-014-configuracao-do-tempo-de-prova.md)
- [US-015 — Área de Estudo de Caso da matéria](./US-015-area-de-estudo-de-caso.md)
- [US-016 — Estudo: como fazer as peças](./US-016-estudo-como-fazer-as-pecas.md)
- [US-017 — Resolução de caso concreto](./US-017-resolucao-de-caso-concreto.md)
- [US-018 — Timer da prova](./US-018-timer-da-prova.md)
- [US-019 — Autocorreção visual](./US-019-autocorrecao-visual.md)
- [US-020 — Histórico de casos concretos](./US-020-historico-de-casos-concretos.md)
- [US-021 — Admin: gerenciar módulos e lições](./US-021-admin-gerenciar-modulos-e-licoes.md)
- [US-022 — Admin: gerenciar resumos](./US-022-admin-gerenciar-resumos.md)
- [US-023 — Admin: gerenciar flashcards](./US-023-admin-gerenciar-flashcards.md)
- [US-024 — Admin: gerenciar casos concretos](./US-024-admin-gerenciar-casos-concretos.md)
- [US-025 — Admin: gerenciar conteúdo "Como fazer as peças"](./US-025-admin-gerenciar-conteudo-de-pecas.md)
- [US-026 — Admin: listagem de usuários](./US-026-admin-listagem-de-usuarios.md)
