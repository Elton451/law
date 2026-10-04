# US-010 — Revisão com repetição espaçada

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero que os flashcards voltem para revisão em intervalos adequados ao meu desempenho, para memorizar de forma eficiente.

## Descrição
Cada flashcard que o estudante já viu ganha uma data de próxima revisão. Os cards errados voltam mais cedo; os acertados, em intervalos cada vez maiores.

## Critérios de aceite
- [ ] Cada card estudado tem uma data de próxima revisão por estudante.
- [ ] O estudante vê a quantidade de cards pendentes de revisão por trilha e no total.
- [ ] O estudante pode iniciar uma sessão de revisão com os cards vencidos, por trilha ou geral.
- [ ] Errar um card reinicia seu intervalo; acertar aumenta o intervalo.
- [ ] A sessão de revisão usa a mesma mecânica de frente/verso da US-009.
- [ ] Concluir uma revisão concede XP e conta para o streak.

## Regras de negócio
- Sugestão de algoritmo: sistema de Leitner com caixas e intervalos de 1, 3, 7, 14 e 30 dias. Errar volta o card para a caixa 1.
- Se o admin editar um card, o histórico de revisão dele é mantido.

## Pontos em aberto
- Confirmar o algoritmo (Leitner simples vs. SM-2) e os intervalos.
- Definir um limite diário de revisões (ex.: no máximo 50 cards por dia)?

## Dependências
- US-009.
