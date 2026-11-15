# SB07 — Resposta estruturada e cronômetro

**Persona:** Participante · **Tela:** U04 `/pecas/tentativas/{id}` → U05

## Composição da tela U04

- **Desktop:** caso à esquerda e resposta à direita.
- **Celular:** abas **Caso** e **Minha resposta**, preservando o texto ao alternar.

Sete campos, nesta ordem:

1. Identificação da peça
2. Endereçamento
3. Qualificação
4. Dos fatos
5. Da fundamentação
6. Dos pedidos
7. Do fechamento

Barra persistente com tempo opcional, situação do salvamento, **Salvar e sair** e **Enviar resposta**. Não preencher campos com modelos que revelem a resposta do exercício. Campos aceitam texto simples com parágrafos.

## Sequência do storyboard

1. O aluno lê o caso e escreve em qualquer ordem. Alterações são salvas automaticamente.
2. Ao alcançar 90 minutos, aparece “Você atingiu 1h30 de treino. Pode continuar ou enviar sua resposta”. O aviso é acessível e não rouba o texto em edição.
3. Ao enviar, um diálogo informa que a tentativa ficará registrada e que o espelho será liberado. Com campos vazios, informa quantos estão em branco e permite **Enviar mesmo assim**.
4. Após confirmação do servidor, o formulário fica somente para leitura e abre o resultado.

## US14 — Escrever e salvar com segurança

Como participante, quero digitar por etapas sem perder meu trabalho.

**Critérios de aceite**

- [ ] **PROPOSTA:** autosave após 2 segundos sem digitação e ao sair de um campo.
- [ ] Mostrar **Salvando**, **Salvo às [hora]** ou **Não foi possível salvar**.
- [ ] Falha preserva o texto local para tentar novamente, com tratamento de privacidade.
- [ ] Salvar e sair aguarda confirmação ou alerta de falha.

## US15 — Controlar tempo sem bloqueio

Como participante, quero usar opcionalmente 90 minutos como referência.

**Critérios de aceite**

- [ ] Cronômetro desligado não gera alerta.
- [ ] Ligado, mantém o início no servidor e não reinicia ao atualizar.
- [ ] O alerta ocorre uma vez por tentativa.
- [ ] Ultrapassar o tempo não bloqueia nem envia.
- [ ] **PROPOSTA:** contar tempo corrido, inclusive saída e desconexão, e mostrar tempo excedido (**PENDENTE** D05).

## US16 — Enviar inclusive em branco

Como participante, quero enviar minha resposta mesmo com campos vazios.

**Critérios de aceite**

- [ ] Sete campos vazios são aceitos após confirmação.
- [ ] Clique duplo não gera dois envios.
- [ ] A resposta só sai do modo editável após sucesso.
- [ ] Indisponibilidade mantém o rascunho.
- [ ] Expiração do direito de acesso segue [SB12](./SB12-vencimento-e-dispositivos.md) e não deve ser confundida com o alerta de 90 minutos.
