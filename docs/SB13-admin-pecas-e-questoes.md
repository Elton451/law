# SB13 — Administração de peças e questões

**Persona:** Administradora · **Telas:** AD01 `/admin`, AD02 `/admin/exercicios`

## Composição das telas AD01 e AD02

Visão administrativa separada da participante. Menu com Exercícios, Materiais, Exames, Petiscos, Painéis e Usuários.

- **Lista de exercícios:** tipo Peça ou Questão, disciplina, origem, edição e estado **Rascunho**, **Publicado** ou **Arquivado**. Ações Criar, Editar, Pré-visualizar e Arquivar.
- **Editor de peça:** caso, identificação correta, sete espelhos, pesos, alternativas aceitas, temas, artigos e referência da fonte.
- **Editor de questão:** enunciado, lista ordenada de subitens, espelhos e pesos por subitem, temas, artigos e fonte.
- Separar a edição de origem da prova da edição de venda que recebe o conteúdo.

## Sequência do storyboard

1. A administradora cria um rascunho e preenche os dados. Campos incompletos podem ser salvos como rascunho.
2. Configura espelhos e pesos, visualiza a experiência com tipo oculto e depois com resultado revelado.
3. Publica após validações. Novas tentativas passam a usar essa versão.
4. Corrige o exercício: cria nova versão, sem reescrever tentativas antigas. Arquivamento bloqueia novas tentativas, preservando histórico e notas.

## US27 — Gerenciar conteúdo avaliável

Como administradora, quero cadastrar casos, respostas oficiais e pesos para permitir o treino.

**Critérios de aceite**

- [ ] Publicação exige disciplina, caso ou enunciado, espelhos e pesos válidos.
- [ ] Campo não aplicável é marcado explicitamente com peso zero e justificativa.
- [ ] A soma dos pesos deve ser positiva.
- [ ] Nomes de temas e artigos usam cadastro padronizado.
- [ ] Pré-visualização não altera dados de alunos.

## US28 — Preservar versões

Como administradora, quero corrigir conteúdos sem destruir o histórico de estudo.

**Critérios de aceite**

- [ ] Alteração publicada gera revisão identificável.
- [ ] A tentativa fixa conteúdo, espelho e pesos da versão iniciada.
- [ ] Alterações posteriores não recalculam o passado automaticamente.
- [ ] Exercício com tentativa vinculada não é excluído fisicamente pela interface.

## Pendência de conteúdo

Nenhum banco de provas, espelhos ou estatísticas foi fornecido. Para o protótipo, usar exercícios demonstrativos claramente marcados. Não apresentar texto inventado como espelho oficial da FGV. Publicação real exige revisão e fornecimento da fonte pela responsável.
