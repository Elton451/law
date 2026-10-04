# US-019 — Autocorreção visual

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero comparar minha resposta com o gabarito, seção por seção, para identificar meus erros sozinho.

## Descrição
Segue o wireframe: o gabarito ("Respostas do caso concreto") fica à esquerda e a resposta do estudante à direita, alinhados por seção.

## Critérios de aceite
- [ ] Após o envio, o sistema exibe lado a lado o gabarito e a resposta do estudante, nas 5 seções.
- [ ] O sistema exibe o tempo gasto e se ficou dentro ou fora do limite.
- [ ] O botão "Rever caso concreto" mostra novamente o enunciado do caso.
- [ ] O botão "Gerar outro teste" inicia um novo caso (US-017).
- [ ] No mobile, a comparação é feita seção por seção, empilhando gabarito e resposta.

## Regras de negócio
- No MVP, não há nota nem correção automática; a correção é apenas visual.

## Fora de escopo
- Correção por IA ou por critérios pontuados.

## Dependências
- US-017, US-024.
