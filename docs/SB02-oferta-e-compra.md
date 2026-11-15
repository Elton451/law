# SB02 — Oferta e preparação da compra

**Persona:** Visitante / Participante · **Telas:** P02 `/novelos/{disciplina}/{exame}` → A01 / A02 / C01

## Composição da tela P02

Cabeçalho com novelo e disciplina; seletor de edição; preço de R$ 79,90; resumo do que está incluído; data da segunda fase; regra de validade; ação **Criar conta e continuar**.

- Resumo lateral no desktop e abaixo do conteúdo no celular.
- Exibir a restrição de uma disciplina antes do pagamento.

## Sequência do storyboard

1. A visitante escolhe uma edição. O resumo mostra disciplina, exame, valor e validade, sem cobrança imediata.
2. Ao continuar sem conta, vai a A01 com a oferta preservada no servidor ou por identificador validado.
3. Se já tem conta, entra em A02 e retorna ao resumo da compra. Se já adquiriu a mesma oferta, a ação vira **Acessar meu novelo**.

## US03 — Revisar a oferta

Como visitante, quero conferir preço, disciplina, exame e duração antes de me cadastrar.

**Critérios de aceite**

- [ ] O preço vem do servidor em centavos.
- [ ] Selecionar outra edição atualiza o resumo.
- [ ] Atualizar a página mantém uma escolha válida.
- [ ] Oferta inexistente ou desativada não permite criar pedido.

## US04 — Impedir compra incompatível

Como participante, quero uma orientação clara quando uma compra conflitar com minha disciplina já adquirida.

**Critérios de aceite**

- [ ] Com acesso de Civil no mesmo exame, tentar comprar Penal não cria uma nova autorização de pagamento.
- [ ] Tentar recomprar Civil abre a área existente.
- [ ] A regra é validada no servidor, inclusive em duas abas simultâneas.

## PROPOSTA de restrição inicial

Uma única disciplina adquirida por conta em cada edição. Permitir o mesmo aluno estudar outra disciplina em uma edição futura depende de aprovação (**PENDENTE** D01). Enquanto o alcance não for decidido, documentar a configuração e não consolidar uma restrição vitalícia na estrutura do banco.

## Microtextos e falhas

- Resumo: “Você está escolhendo Direito Civil para o Exame [número]”.
- Oferta desativada durante o cadastro: preservar a conta, informar indisponibilidade e oferecer retorno às turmas, sem substituir o produto automaticamente.
