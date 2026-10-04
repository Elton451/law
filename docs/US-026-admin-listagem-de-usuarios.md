# US-026 — Admin: listagem de usuários

**Persona:** Administrador
**Prioridade:** Média

## História
Como administrador, quero ver a lista de usuários com informações básicas e status de pagamento, para acompanhar a base de estudantes.

## Critérios de aceite
- [ ] A lista exibe nome, e-mail, data de cadastro, último acesso e status de pagamento.
- [ ] A lista tem paginação.
- [ ] O admin busca por nome ou e-mail.
- [ ] O admin filtra pelo status de pagamento.

## Regras de negócio
- A tela é apenas de consulta: não há edição, bloqueio ou exclusão de usuários no MVP.

## Pontos em aberto
- Como o pagamento ainda não foi definido, o status de pagamento será um campo no banco (ex.: `ativo`, `pendente`, `inativo`), atualizado manualmente até haver integração.

## Dependências
- US-004.
