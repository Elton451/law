# US-007 — Página da matéria (trilha)

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero ver a estrutura completa de uma trilha, para escolher livremente o módulo, a lição ou o estudo de caso que quero fazer.

## Descrição
A trilha se organiza em **Trilha → Módulos → Lições**. Cada lição contém resumos e/ou flashcards. A página da matéria também dá acesso à área de Estudo de Caso (US-015).

## Critérios de aceite
- [ ] A página exibe o nome e o novelo da matéria no topo.
- [ ] Os módulos são listados na ordem definida pelo admin, cada um com suas lições.
- [ ] Cada lição indica o tipo de conteúdo (resumo, flashcards ou ambos) e o status (não iniciada, em andamento, concluída).
- [ ] Cada módulo exibe seu progresso (lições concluídas/total).
- [ ] O estudante pode abrir qualquer lição, sem pré-requisitos.
- [ ] A página exibe o acesso à revisão de flashcards pendentes da trilha (US-010), com a quantidade de cards a revisar.
- [ ] A página exibe o acesso à área de Estudo de Caso da matéria (US-015).
- [ ] A apresentação dos módulos e lições lembra um caminho/trilha gamificada.

## Regras de negócio
- Navegação livre: não há bloqueio entre módulos ou lições.
- Uma lição é concluída quando o estudante lê todos os resumos e passa por todos os flashcards dela.

## Dependências
- US-006, US-021.
