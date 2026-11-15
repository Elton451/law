# SB14 — Administração de calendário, materiais e frases

**Persona:** Administradora · **Telas:** AD04 `/admin/exames`, AD03 `/admin/materiais`, AD05 `/admin/petiscos`

## Tela AD04 — Calendário

Campos: número e nome da edição, datas relevantes, data da segunda fase, situação, fonte opcional e ofertas associadas. Separar a publicação do calendário da abertura de venda. Pré-visualizar a página pública e o prazo resultante antes de salvar uma mudança.

### US29 — Atualizar a prova

Como administradora, quero atualizar a prova para manter calendário e acessos coerentes.

**Critérios de aceite**

- [ ] Validação de datas e fuso.
- [ ] Alteração registrada com valor anterior, novo e instante.
- [ ] Exame já vendido não pode ser removido fisicamente.
- [ ] Mudança da segunda fase atualiza a validade e a contagem de dias.
- [ ] Exibir quantos acessos serão afetados.
- [ ] **PROPOSTA:** redução de prazo exige confirmação explícita na própria interface.

## Tela AD03 — Materiais

Campos: título, descrição, disciplina, ofertas ou edições de destino, formato, PDF ou URL, temas e publicação. O PDF deve ser enviado a armazenamento privado. A URL de vídeo deve respeitar os provedores aprovados pela implementação.

### US30 — Publicar materiais

Como administradora, quero publicar materiais para o novelo correto.

**Critérios de aceite**

- [ ] Formato PDF exige arquivo válido; vídeo e link exigem URL válida.
- [ ] Rascunho não aparece ao participante.
- [ ] Despublicação bloqueia novos acessos.
- [ ] Editar o destino não concede outro novelo ao aluno.
- [ ] **PROPOSTA:** tamanho máximo inicial de PDF de 25 MB, sujeito a validação.

## Tela AD05 — Petisco Diário

Lista de frases ativas, campo de texto e autoria opcional, ações Criar, Editar, Desativar e prévia do dia. O algoritmo usa apenas a lista cadastrada; não criar frases por IA como requisito implícito.

### US31 — Alimentar as frases

Como administradora, quero alimentar a lista que gera a mensagem diária.

**Critérios de aceite**

- [ ] Frase vazia é rejeitada.
- [ ] A mesma frase publicada no dia permanece consistente para todos.
- [ ] Editar uma frase já selecionada não troca silenciosamente o conteúdo daquele dia.
- [ ] **PROPOSTA:** persistir o texto escolhido como fotografia diária; permitir substituição imediata apenas por ação explícita, refletida para todos.

## Estados comuns

- Erro ao salvar não informa sucesso.
- Alteração não salva gera aviso antes de sair.
- Ações de despublicação e arquivamento indicam o efeito sobre os alunos.
- Limpar um cadastro de origem não apaga suas referências históricas.
