# SB12 — Vencimento e limite de dispositivos

**Persona:** Participante / Titular · **Telas:** U01, U10, A02

## Sequência de vencimento

1. O dashboard exibe a data da prova e a data final do acesso.
2. Encerrada a validade, a aplicação mostra “Seu acesso ao material terminou. Seu histórico e caderno continuam disponíveis”. Itens bloqueados encaminham a essa orientação, sem excluir o menu de consulta.
3. A administradora adia a prova; o direito associado ao exame passa a usar a nova data. Se já havia vencido, reativar somente quando a nova regra o tornar válido, com registro da alteração.

## US25 — Aplicar validade no servidor

Como participante, quero que minha autorização acompanhe a data da prova cadastrada.

**Critérios de aceite**

- [ ] Mudança de relógio do navegador não prolonga o acesso.
- [ ] APIs de estudo e arquivos verificam a validade em cada solicitação.
- [ ] Histórico e caderno permanecem autenticados.
- [ ] O adiamento alcança todos os direitos vinculados, sem alterar datas de exames diferentes.

**PROPOSTA de limite exato** (**PENDENTE** D02): permitir até 23h59min59 do dia seguinte à segunda fase, em `America/Sao_Paulo`. Implementar como limite exclusivo à meia-noite do dia posterior a esse dia. Exemplo fictício: prova em 10/01; acesso permitido em 11/01; bloqueio a partir de 12/01 às 00h. A responsável deve validar essa interpretação antes da entrega funcional.

**PROPOSTA durante o treino:** salvar o que for possível antes do limite; após expirar, bloquear escrita no servidor, manter o texto ainda não salvo no cliente com aviso e permitir consultar o que ficou salvo. Não conceder prazo adicional implícito. Comportamento depende de aprovação.

## US26 — Limite de dois dispositivos

Como titular, quero usar até dois dispositivos e receber aviso quando uma sessão for encerrada.

### Sequência

1. Login em A cria a sessão 1; login em B cria a sessão 2.
2. Login em C revoga uma anterior. **PROPOSTA:** revogar a sessão com login mais antigo (**PENDENTE** D05).
3. O dispositivo revogado recebe “Sua sessão foi encerrada porque houve acesso em outro dispositivo” e vai ao login.

**Critérios de aceite**

- [ ] Limite imposto de forma transacional para logins concorrentes.
- [ ] Revogar o refresh e a próxima requisição.
- [ ] Abas do mesmo perfil do navegador compartilham sessão.
- [ ] Navegadores diferentes contam como sessões distintas.
- [ ] A mesma rede não identifica dispositivo.
- [ ] No treino, não sobrescrever o rascunho a partir do dispositivo revogado.
