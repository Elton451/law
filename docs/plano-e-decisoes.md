# Plano de implementação e decisões pendentes

## Sequência de trabalho proposta

| Etapa | Escopo                                                                                                 | Histórias           | Dependências / observações                                                 |
| ----- | ------------------------------------------------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------------- |
| 1     | Base visual, rotas e modelo de dados; autenticação, perfil, autorização e limite de sessões            | US01–06, US26       | Protótipo com navegação verificável e dados de demonstração identificados. |
| 2     | Ofertas, pedidos de teste, confirmação idempotente, direito de acesso e calendário                     | US07–08, US25, US29 | Conta de testes do provedor e decisão de validade (D02).                   |
| 3     | Administração de exercícios, versões e motor de pontuação; treinamento de peças, cronômetro e espelhos | US12–18, US27–28    | Pesos, fatores (D03) e conteúdo demonstrativo revisado.                    |
| 4     | Questões, histórico, caderno e materiais                                                               | US19–24, US30       | Verificar a experiência após vencimento.                                   |
| 5     | Dashboard, frases, incidências e usuários                                                              | US09–11, US31–33    | Finalizar homologação e guia de configuração.                              |

A ordem pode ajustar dependências sem remover regras transversais.

## Decisões que exigem validação da responsável

- **D01** A restrição de uma disciplina vale por exame ou para toda a conta? Proposta: por exame, com nova escolha em edição futura.
- **D02** Confirmar acesso até o fim do dia seguinte à prova e a regra de treino iniciado antes do vencimento.
- **D03** Aprovar fatores 0; 0,25; 0,50; 1 e fornecer pesos reais dos sete campos e dos subitens. Definir escala máxima e eventual efeito de identificar a peça errada.
- **D04** Confirmar soma determinística da autoavaliação ou pedir análise textual por IA como recurso adicional.
- **D05** Aprovar encerramento da sessão com login mais antigo e contagem por perfil de navegador. Aprovar tempo corrido e duração de 90 minutos para questão isolada.
- **D06** Confirmar se o histórico vencido inclui espelho, consulta a rascunhos e possibilidade de revisar autoavaliação.
- **D07** Definir base e recorte das estatísticas, fontes oficiais e sentido de “outras peças aceitas”: alternativas do mesmo enunciado ou outras categorias históricas.
- **D08** Escolher provedor, parcelas, juros, regras de estorno e cancelamento. Fornecer vídeo, domínio, fontes e conteúdos. Aprovar política de dados e suporte antes da produção.

## Definição de entrega concluída

- Aplicação navegável com persistência real.
- Jornadas US01–33 demonstradas.
- Permissões testadas no servidor.
- Pagamento em sandbox.
- Estados de erro e vazio.
- QA01–16 aprovados.
- Decisões pendentes resolvidas ou isoladas por configuração identificada.
- Instruções de execução, configuração administrativa e limitações conhecidas entregues.

Não apresentar integrações fictícias como concluídas nem ativar cobrança real como parte da demonstração.
