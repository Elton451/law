# US-009 — Estudo com flashcards

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero estudar com flashcards de frente e verso e avaliar se acertei, para fixar o conteúdo.

## Descrição
Sessão de flashcards de uma lição. O estudante vê a frente, pensa na resposta, vira o card e informa se acertou ou errou.

## Critérios de aceite
- [ ] O card exibe a frente (pergunta) e, ao toque ou clique, vira para o verso (resposta), com animação.
- [ ] Depois de virar, o estudante escolhe "Errei" ou "Acertei".
- [ ] A sessão exibe o progresso (ex.: 3/10).
- [ ] Ao final, o sistema mostra um resumo da sessão (acertos, erros e XP ganho).
- [ ] O resultado de cada card alimenta a repetição espaçada (US-010).
- [ ] A conclusão da sessão concede XP (US-011) e conta para o streak (US-012).
- [ ] A interação funciona bem com toque (mobile).

## Regras de negócio
- No MVP, o único formato de card é frente/verso.
- A autoavaliação é binária (Errei/Acertei).

## Fora de escopo
- Múltipla escolha, verdadeiro/falso, lacunas.

## Dependências
- US-007, US-023.
