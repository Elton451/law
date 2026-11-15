# SB08 — Espelho, autoavaliação e resultado

**Persona:** Participante · **Tela:** U05 `/tentativas/{id}/resultado`

## Composição da tela U05

Cabeçalho com exercício, tipo revelado, número da tentativa, datas e duração. Sete blocos exibem **Minha resposta**, **Espelho oficial cadastrado** e autoavaliação. Cada bloco oferece quatro níveis:

- Em branco ou erro total
- Acertei pouco
- Acertei na média
- Acertei total

Exibir peso máximo do campo, pontos obtidos e total. Ações **Salvar autoavaliação**, **Adicionar ao caderno**, **Ver histórico** e **Refazer**. Informar que a nota reflete autoavaliação e não uma correção oficial da FGV.

O cálculo segue o [motor de pontuação](./motor-de-pontuacao.md).

## Sequência do storyboard

1. Após o envio, o servidor revela o tipo e o espelho da versão fixada na tentativa.
2. O aluno compara cada resposta e seleciona um nível em cada campo. Seleção parcial mantém a avaliação incompleta.
3. **Salvar autoavaliação** calcula os pontos no servidor. O resultado distingue nota calculada de eventual recurso de IA.
4. Em um campo com dificuldade, o aluno cria uma anotação já vinculada ao exercício, tentativa e etapa.

## US17 — Comparar com o espelho

Como participante, quero entender a diferença entre minha resposta e a referência cadastrada.

**Critérios de aceite**

- [ ] O espelho só é entregue depois do envio.
- [ ] Campos em branco aparecem como **Não respondido**.
- [ ] A edição posterior de conteúdo administrativo não altera silenciosamente o espelho usado no histórico.
- [ ] Peça alternativa aceita aparece com sua justificativa cadastrada, se aplicável.

## US18 — Autoavaliar por campo

Como participante, quero registrar meu acerto e visualizar uma nota ponderada.

**Critérios de aceite**

- [ ] Todos os campos avaliáveis exigem um nível antes do fechamento.
- [ ] Pesos vêm da versão administrativa.
- [ ] O cliente não determina o total.
- [ ] Formulário enviado todo em branco recebe zero, conforme regra proposta de pontuação.
- [ ] O cálculo permanece disponível sem serviço de IA.

## Estados e ajustes

- **PROPOSTA:** permitir revisar a autoavaliação, mantendo data, versão anterior e total recalculado. Isso não altera o texto originalmente enviado. A política de revisão deve ser aprovada (**PENDENTE** D06).
- Falha ao salvar a avaliação mantém as seleções visíveis e não duplica a tentativa.
