# US-024 — Admin: gerenciar casos concretos

**Persona:** Administrador
**Prioridade:** Alta

## História
Como administrador, quero cadastrar casos concretos com seus gabaritos, de provas antigas da OAB ou autorais, para alimentar o treinamento da 2ª fase.

## Critérios de aceite
- [ ] O admin cria, edita e exclui (ou desativa) casos concretos vinculados a uma trilha.
- [ ] Cada caso tem: título, enunciado, peça cabível e origem ("OAB" com número do exame, ou "Autoral").
- [ ] O gabarito tem as 5 seções: Endereçamento, Qualificação, Fundamentação, Pedidos e Fechamento.
- [ ] O admin pode filtrar os casos por trilha e origem.
- [ ] O caso fica disponível para sorteio imediatamente após salvo, se estiver ativo.

## Regras de negócio
- Casos com tentativas de estudantes não devem ser excluídos fisicamente; devem ser desativados ou versionados (ver US-020).

## Dependências
- US-021.
