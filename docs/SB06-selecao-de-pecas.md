# SB06 — Seleção de peças sem revelar a resposta

**Persona:** Participante · **Tela:** U03 `/pecas` → U04

## Composição da tela U03

Lista com códigos neutros, origem ou edição quando isso não revelar o tipo, situação **Não iniciado**, **Rascunho** ou **Concluído**, e ações **Começar**, **Continuar** ou **Ver resultado**. Na primeira tentativa, não mostrar tipo, sugestão de resposta, espelho ou tags capazes de entregar a identificação.

Separar as áreas **Primeiro treino** e **Refazer peças conhecidas**:

- Em Primeiro treino, os exercícios são apresentados com identificação neutra.
- Em Refazer, filtros por tipo atuam apenas sobre exercícios já enviados pelo próprio aluno.

## Sequência do storyboard

1. O aluno escolhe um caso ainda não respondido. Vê instruções e a opção **Usar cronômetro de 90 minutos**.
2. Ao começar, o servidor cria a tentativa em rascunho, fixa a versão do exercício e registra o início. Abre U04.
3. Se sair e retornar, a ação é **Continuar**. Se já enviou esse exercício, pode acessar o resultado e gerar uma nova tentativa independente.

## US12 — Iniciar com identificação oculta

Como participante, quero descobrir a peça pelo caso sem receber a resposta antecipadamente.

**Critérios de aceite**

- [ ] O servidor omite tipo e espelho no payload inicial.
- [ ] URL, título da página, nomes de arquivo, atributos de imagem, acessibilidade e mensagens não contêm a resposta.
- [ ] Não basta esconder texto por CSS.
- [ ] Filtros de tipo não permitem inferir exercícios inéditos.

## US13 — Retomar ou refazer

Como participante, quero continuar um rascunho e refazer exercícios já enviados.

**Critérios de aceite**

- [ ] Atualizar a página recupera o rascunho salvo.
- [ ] Começar repetidamente não cria rascunhos duplicados por engano.
- [ ] Refazer cria outro ID e mantém a tentativa anterior.
- [ ] Ao refazer, o tipo pode ser conhecido porque houve envio anterior desse exercício.

## Conflitos e exceções

- **PROPOSTA:** uma tentativa editável por exercício e aluno de cada vez. Uma segunda aba avisa que o mesmo rascunho está aberto; a atualização usa versão de concorrência para impedir sobrescrita silenciosa.
- Conteúdo arquivado não aceita novas tentativas, mas registros já enviados continuam no histórico.
