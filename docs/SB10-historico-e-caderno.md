# SB10 — Histórico e caderno de erros

**Persona:** Participante · **Telas:** U08 `/historico`, U09 `/caderno`

## Composição das telas U08 e U09

- **Histórico:** abas **Peças** e **Questões**; filtros de tipo revelado, exame, tema, período e situação da avaliação; registros com tentativa, data, nota e ação **Ver detalhes**.
- **Caderno:** busca textual, filtro **Preciso revisar** ou **Revisado**, vinculada ou livre, e ação **Nova anotação**.
- **Detalhe da anotação:** título, texto, situação e vínculo opcional com exercício, tentativa e campo ou subitem. A edição do texto não altera a resposta enviada.

## Sequência do storyboard

1. O aluno abre o histórico, filtra um tipo de peça e consulta uma tentativa concluída.
2. Pelo resultado, cria uma anotação com contexto automaticamente vinculado e estado inicial **Preciso revisar**.
3. Em outro dia, abre o caderno, revisa e marca **Revisado**. Também pode criar uma nota livre.
4. Após vencer o novelo, continua usando histórico e caderno pelo mesmo menu.

## US21 — Consultar tentativas próprias

Como participante, quero encontrar minhas respostas anteriores para acompanhar meu aprendizado.

**Critérios de aceite**

- [ ] Tentativas são independentes e ordenadas por data.
- [ ] Filtro por tipo não revela exercícios inéditos.
- [ ] Nota sem avaliação aparece pendente.
- [ ] Registros de outra conta nunca aparecem.
- [ ] Rascunhos são diferenciados de envios concluídos.

## US22 — Manter o caderno de erros

Como participante, quero escrever o que errei e por que errei para revisar depois.

**Critérios de aceite**

- [ ] Criar, editar, buscar, marcar e excluir com confirmação.
- [ ] Notas livres não exigem exercício.
- [ ] Ao criar pelo resultado, o vínculo é validado como pertencente ao aluno.
- [ ] Conteúdo arquivado não apaga notas.
- [ ] O usuário não consegue usar um vínculo para ler outra tentativa.

## PROPOSTA de consulta após vencimento

Preservar respostas enviadas, notas e espelho da tentativa como parte do histórico. Bloquear catálogo, novos treinos, refazer e biblioteca. Essa distinção precisa ser confirmada porque a responsável preservou o histórico, mas não definiu se o espelho continua disponível (**PENDENTE** D06). Rascunhos vencidos ficam somente para consulta, sem novo envio, até validação.
