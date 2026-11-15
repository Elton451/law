# SB15 — Administração de painéis e usuários

**Persona:** Administradora · **Telas:** AD06 `/admin/paineis`, AD07 `/admin/usuarios`

## Tela AD06 — Incidência de conteúdos

Necessidade confirmada: gerenciar os painéis. A origem dos números ainda não foi definida (**PENDENTE** D07).

**PROPOSTA:** usar uma base editorial de ocorrências por prova, separada das tentativas dos alunos, com disciplina, exame de origem, peça principal, alternativas aceitas, temas e artigos.

- Cada ocorrência precisa de referência e status de revisão.
- Escolher o conjunto de exames incluídos e exibir prévia antes da publicação.
- Repetir uma questão no catálogo não deve duplicar sua ocorrência estatística se a fonte é a mesma.

### US32 — Publicar estatísticas verificáveis

Como administradora, quero mostrar incidências de provas cadastradas com uma base compreensível.

**Critérios de aceite**

- [ ] O painel informa o recorte e a quantidade de provas ou questões.
- [ ] Peça principal e alternativa aceita são contadas em categorias separadas.
- [ ] Temas e artigos admitem múltiplas ocorrências por prova, com regra de percentual identificada.
- [ ] Ausência de base não produz percentuais fictícios.

**PROPOSTA de denominadores:**

- Peças principais: pelo número de provas incluídas.
- Alternativas: pelo número de provas com alternativa cadastrada.
- Temas e artigos: pelo número de questões ou peças do recorte que citam o item, sem contar repetição interna do mesmo artigo duas vezes.
- Como há múltiplas tags, os percentuais podem somar mais de 100%.

## Tela AD07 — Usuários

Lista com busca por nome ou e-mail e filtros de disciplina, exame e estado de acesso. Detalhe do perfil com dados cadastrais, oferta vinculada e estado calculado. A existência do vínculo de compra é informação operacional somente para leitura, sem módulo de gestão de compras.

### US33 — Gerenciar contas com escopo limitado

Como administradora, quero consultar participantes e corrigir dados de cadastro autorizados.

**Critérios de aceite**

- [ ] Alterações são auditadas.
- [ ] Não exibir senha nem tokens.
- [ ] Nenhuma edição de perfil concede acesso pago.
- [ ] Disciplina e exame de um direito ativo não podem ser trocados como simples edição cadastral.
- [ ] Suspensão e exclusão de conta são **PROPOSTAS** que precisam de política definida antes de ativar os botões.

## Administração protegida

- Uma única conta administrativa, provisionada por processo técnico seguro.
- O cadastro público nunca aceita o papel de administradora.
- **PROPOSTA:** exigir autenticação multifator administrativa.
- A administradora não precisa ler respostas pessoais para cadastrar conteúdo; qualquer acesso adicional deve ter finalidade e permissão explícitas.
