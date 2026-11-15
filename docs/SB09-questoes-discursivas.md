# SB09 — Treinamento de questões discursivas

**Persona:** Participante · **Telas:** U06 `/questoes`, U07 `/questoes/tentativas/{id}`

## Composição das telas U06 e U07

Catálogo restrito à disciplina, com filtros por tema, artigo e edição do exame. Mostrar enunciados ou resumos que não incluam os espelhos. A questão pode possuir subitens A, B e outros, cadastrados pela administradora. O formulário apresenta o enunciado comum e um campo de resposta por subitem.

Na questão, não usar artificialmente os sete campos de uma peça. “A mesma lógica de correção” significa comparar, selecionar um dos quatro níveis e somar os pesos próprios de cada subitem ou critério.

## Sequência do storyboard

1. O aluno filtra questões e seleciona uma. Sem resultados, vê **Limpar filtros**.
2. Começa, escolhe o cronômetro opcional e responde os subitens. Pode salvar rascunho, sair e retomar.
3. Envia, inclusive com subitens vazios, mediante confirmação. Recebe espelho por subitem e autoavaliação equivalente à das peças.
4. Salva a avaliação ou registra um erro vinculado a um subitem no caderno.

## US19 — Encontrar questões

Como participante, quero selecionar assuntos e artigos para praticar minhas dificuldades.

**Critérios de aceite**

- [ ] Filtros combinam entre si.
- [ ] A seleção é preservada ao voltar ao catálogo.
- [ ] Artigos são identificados por diploma e dispositivo, evitando confundir artigos de leis diferentes.
- [ ] Só questões publicadas e autorizadas aparecem.

## US20 — Responder por subitem

Como participante, quero registrar respostas separadas e revisar cada parte.

**Critérios de aceite**

- [ ] Cada subitem tem identificador, resposta, espelho, peso e nível próprios.
- [ ] Envio vazio é permitido.
- [ ] Autosave, idempotência e proteção de rascunho seguem [SB07](./SB07-resposta-e-cronometro.md).
- [ ] Uma nova tentativa não modifica outra já enviada.

## PROPOSTA para o cronômetro

Aplicar 90 minutos por sessão de treinamento iniciada, tanto de peça quanto de questão, já que só esse tempo foi informado. A duração para uma questão isolada e eventual agrupamento de questões precisa de validação (**PENDENTE** D05). Não implementar simulado completo com outra duração como requisito confirmado.
