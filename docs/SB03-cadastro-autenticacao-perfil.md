# SB03 — Cadastro, autenticação e perfil

**Persona:** Candidata / Participante · **Telas:** A01 `/cadastro`, A02 `/entrar`, A03 `/recuperar-senha`, U10 `/conta`

## Composição das telas

- **Cadastro (A01):** nome completo conforme documento, e-mail, UF, senha e confirmação; exame e disciplina vindos da oferta; entrada alternativa **Continuar com Google**. Nome completo é um único campo obrigatório; não exigir sobrenome separado sem necessidade definida.
- **Login (A02):** e-mail, senha, Entrar, Google e Esqueci minha senha.
- **Recuperação (A03):** e-mail e confirmação genérica de solicitação.
- **Perfil (U10):** nome, UF, e-mail, exame, disciplina e sessões.

## Sequência do storyboard

1. A pessoa revisa disciplina e exame, preenche o cadastro ou entra com Google.
2. No Google, a plataforma solicita os campos ainda ausentes, como UF e confirmação do nome completo. Não adivinhar UF pelo endereço de rede.
3. Ao concluir, a conta sem compra vai ao resumo para pagamento; conta com acesso ativo vai ao dashboard. Uma compra ainda pendente permanece identificada.

## US05 — Cadastrar e persistir o perfil

Como candidata, quero criar minha conta sem perder a oferta escolhida.

**Critérios de aceite**

- [ ] Todos os campos obrigatórios são validados no servidor.
- [ ] E-mail é normalizado e único.
- [ ] UF usa lista válida de unidades federativas brasileiras.
- [ ] Exame e disciplina existem e correspondem à oferta.
- [ ] A conta não recebe material apenas por se cadastrar.

## US06 — Entrar e recuperar acesso

Como participante, quero usar senha ou Google e recuperar uma senha esquecida.

**Critérios de aceite**

- [ ] Erro de autenticação não informa se um e-mail existe.
- [ ] Link de recuperação expira e só pode ser usado uma vez.
- [ ] Trocar senha revoga sessões conforme política definida.
- [ ] **PROPOSTA:** confirmação de e-mail no cadastro por senha antes da compra, com reenvio controlado.

## Segurança e exceções

- **PROPOSTA:** senha com no mínimo 12 caracteres, armazenamento por hash seguro e limitação de tentativas.
- Google usa identidade verificada; não mesclar contas automaticamente por um e-mail não verificado.
- Vinculação entre senha e Google exige reautenticação segura.
- Campos nunca devem apagar o texto digitado após um erro de validação.
