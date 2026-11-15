# Contratos técnicos e requisitos transversais

## Operações mínimas da aplicação

| Operação                             | Regra                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `GET` ofertas e calendário           | Apenas dados públicos publicados.                                                          |
| `POST` cadastro e operações de login | Validação e sessão.                                                                        |
| `POST` pedidos                       | Exige autenticação e oferta válida.                                                        |
| Recepção de evento de pagamento      | Autenticidade, deduplicação e transição validada.                                          |
| `GET` acesso atual                   | Situação derivada no servidor.                                                             |
| `POST` tentativas                    | Exige acesso ativo e fixa versão; devolve caso e critérios **sem** resposta.               |
| `PATCH` rascunho                     | Confere dono, validade, estado editável e versão; conflito devolve dados para conciliação. |
| `POST` enviar                        | Chave idempotente, aceita vazio, salva texto e fecha a tentativa de forma atômica.         |
| `GET` resultado                      | Exige dono e tentativa enviada; devolve a versão autorizada do espelho.                    |
| `PUT` autoavaliação                  | Valida níveis e calcula o total.                                                           |
| `GET` histórico e CRUD de anotações  | Exigem autenticação e propriedade, mesmo após vencimento.                                  |
| `GET` autorização de material        | Exige direito ativo.                                                                       |
| Operações administrativas            | Exigem papel verificado no servidor.                                                       |

## Persistência e autorização

- Persistência real em banco e armazenamento de arquivos. LocalStorage não substitui cadastro, sessão, histórico nem direito de acesso.
- Separar dados por usuário e por disciplina em toda consulta.
- Respostas privadas não devem ser compartilhadas por cache entre pessoas; logout limpa dados sensíveis do cliente.
- Textos livres precisam de saída escapada para impedir execução de HTML ou scripts.

## Confiabilidade proposta

- Registrar erros sem senhas, dados de cartão ou textos integrais desnecessários.
- Manter backup e comprovar restauração antes de uso real.
- Definir métricas de carregamento e salvamento em ambiente de teste acordado; **PROPOSTA** inicial de 95% das operações comuns em até 2 segundos, excluindo serviços externos e vídeos.
- Carga alvo e objetivos de disponibilidade ainda não definidos.

## Experiência e acessibilidade

- Telas funcionais em largura de 360 px e desktop.
- Foco visível; rótulos associados a campos; teclado para todas as ações.
- Alertas anunciados por leitor de tela sem apagar resposta.
- Estados vazios e de erro acionáveis.
- Datas exibidas em português brasileiro e fuso `America/Sao_Paulo`; instantes armazenados com referência temporal consistente.

## Dados pessoais e lançamento

Antes de produção, a responsável deve fornecer termos, aviso de privacidade, política comercial, canal de suporte e regras de retenção ou exclusão. Esta especificação não substitui esses documentos nem define obrigações jurídicas. A homologação usa contas fictícias, credenciais de teste e conteúdo demonstrativo identificado.
