# SB04 — Pagamento e ativação do novelo

**Persona:** Participante · **Tela:** C01 `/compra/{pedido}`

## Composição da tela C01

Resumo imutável do pedido, disciplina, exame e R$ 79,90. Checkout do provedor para Pix ou cartão; opções de parcelamento conforme configuração aprovada. Retorno com estados **Pendente**, **Aprovado**, **Recusado**, **Cancelado** ou **Indisponível**.

## Sequência do storyboard

1. Pessoa autenticada confirma a oferta; o servidor cria o pedido e abre o pagamento de teste.
2. No Pix, vê instruções e validade fornecidas pelo provedor. No cartão, informa os dados diretamente ao provedor. A plataforma não armazena número completo nem código de segurança.
3. Após o retorno, a aplicação consulta o estado interno. Enquanto a confirmação não chegou, mostra “Estamos aguardando a confirmação do pagamento”.
4. Confirmação válida ativa o novelo uma única vez e apresenta **Ir para meu painel**.

## US07 — Comprar com confirmação confiável

Como participante, quero pagar e receber acesso ao produto correto.

**Critérios de aceite**

- [ ] Abrir a URL de sucesso não libera acesso.
- [ ] Confirmação exige notificação autenticada e/ou consulta validada ao provedor.
- [ ] O servidor confere pedido, valor, moeda, recebedor e status.
- [ ] Notificações repetidas não duplicam acesso nem pedidos pagos.

## US08 — Retomar pagamento pendente

Como participante, quero consultar o pagamento sem pagar novamente por engano.

**Critérios de aceite**

- [ ] Ao voltar à conta, encontro o pedido pendente.
- [ ] Recusa permite nova tentativa identificada.
- [ ] Evento antigo não regride um pagamento aprovado sem uma transição válida de estorno.
- [ ] Duplicidade aprovada gera ocorrência técnica, sem dois direitos sobre o mesmo produto.

## Limites e dependências

- Mercado Pago é candidato, não integração já contratada. Métodos, assinatura de notificações, credenciais e parcelamento serão implementados segundo a documentação oficial vigente na execução (**PENDENTE** D08).
- Sandbox deve ser visivelmente separado da produção; não inserir credenciais no navegador.
- Interface administrativa de compras não faz parte do pedido. Eventos de pagamento, reconciliação e incidentes precisam existir no sistema para sustentar o acesso, sem criar um módulo comercial administrativo adicional.
