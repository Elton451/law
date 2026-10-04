# US-017 — Resolução de caso concreto

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero ler um caso concreto e redigir a peça em um formulário estruturado, para treinar a 2ª fase da OAB.

## Descrição
Segue o wireframe: o caso concreto fica à esquerda e o formulário à direita, com as seções Endereçamento, Qualificação, Fundamentação, Pedidos e Fechamento. No mobile, as duas áreas ficam empilhadas ou em abas.

## Critérios de aceite
- [ ] Ao iniciar, o sistema sorteia um caso concreto da matéria, priorizando casos que o estudante ainda não fez.
- [ ] O caso indica a origem (ex.: "OAB — XXXV Exame" ou "Autoral").
- [ ] O formulário tem os 5 campos de texto livre: Endereçamento, Qualificação, Fundamentação, Pedidos e Fechamento.
- [ ] O timer começa com um aviso de início de peça (US-018).
- [ ] O rascunho é salvo automaticamente durante a resolução, para não se perder se a página for recarregada.
- [ ] O botão "Enviar" pede confirmação, salva a resposta e leva à autocorreção (US-019).
- [ ] O botão "Gerar outro teste" pede confirmação (a resposta atual será descartada) e sorteia um novo caso.
- [ ] No mobile, o estudante alterna facilmente entre o caso e o formulário.

## Regras de negócio
- Campos vazios são permitidos no envio, mas o sistema avisa quais estão em branco.
- Enviar um caso concede XP (US-011).

## Pontos em aberto
- O formulário deve ter um campo "Peça cabível" (qual peça o estudante identificou)? Ele faria sentido para o treino de identificação de peças.

## Dependências
- US-015, US-024.
