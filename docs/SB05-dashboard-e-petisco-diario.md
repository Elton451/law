# SB05 — Dashboard e Petisco Diário

**Persona:** Participante · **Tela:** U01 `/participante`

## Composição da tela U01

Menu lateral; identificação da disciplina e edição; contagem de dias até a segunda fase; data final de acesso; Petisco Diário; cartões com notas das tentativas; dois painéis de incidência. Sem comparação de desempenho entre pessoas.

- **Painel 1 — Peças:** peças mais cobradas, alternativas aceitas pela banca, temas e artigos frequentes em peças.
- **Painel 2 — Questões:** questões ou agrupamentos recorrentes, temas e artigos frequentes em questões.
- Mostrar período ou conjunto de provas usado e quantidade de registros.

## Sequência do storyboard

1. Aluno com acesso ativo entra e vê sua disciplina, sua data e a frase do dia.
2. Abre detalhes de um tema e consulta sua incidência. Elementos que revelam o tipo de uma peça ainda não realizada não devem apontar para esse exercício individual.
3. Usa **Treinar peça** ou **Treinar questão**. Se houver rascunho, também vê **Continuar meu treino**.

## US09 — Consultar notas e prazo

Como participante, quero ver minhas notas e os dias restantes para planejar o estudo.

**Critérios de aceite**

- [ ] Exibir notas apenas das próprias tentativas avaliadas.
- [ ] Sem avaliação, mostrar **Aguardando autoavaliação**.
- [ ] Não exibir média igual a zero para ausência de dados.
- [ ] No dia da prova, mostrar “A prova é hoje”; depois dela, não mostrar dias negativos.

## US10 — Receber o Petisco Diário

Como participante, quero uma mensagem diária selecionada da lista da administradora.

**Critérios de aceite**

- [ ] A mesma data em `America/Sao_Paulo` produz a mesma frase para todos e em todos os dispositivos.
- [ ] Atualizações de página não sorteiam novamente.
- [ ] Sem frases válidas, ocultar o bloco de modo estável.
- [ ] **PROPOSTA:** seleção diária persistida com rodízio, evitando repetição até percorrer a lista.

## US11 — Explorar incidências

Como participante, quero entender o que mais apareceu nas provas cadastradas.

**Critérios de aceite**

- [ ] Dados restritos à disciplina.
- [ ] Painéis sem base mostram ausência de dados.
- [ ] Mostrar contagem e percentual com denominador identificável.

A forma de alimentar a base e o significado exato de peças alternativas dependem de validação (**PENDENTE** D07).
