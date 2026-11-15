# Modelo de dados e invariantes

## Entidades propostas

### Conta e sessão

| Entidade  | Campos                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------- |
| `User`    | ID, nome completo, e-mail normalizado, UF, papel, identidade de senha ou provedor e estado da conta |
| `Session` | usuário, identificador do perfil do navegador, criação, última atividade e revogação                |

### Catálogo e comercialização

| Entidade                 | Campos                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `Discipline`             | nome, cor e imagem                                                                         |
| `ExamEdition`            | número, datas, fuso, publicação e referência                                               |
| `Offer`                  | disciplina, exame de destino, preço em centavos, estado e versão                           |
| `Order` / `PaymentEvent` | usuário, oferta imutável, valor, moeda, referência externa, estado e chave de idempotência |
| `AccessGrant`            | usuário, disciplina, exame, pedido e estado; validade derivada da edição vigente           |

### Exercícios

| Entidade                        | Campos                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Exercise`                      | tipo, disciplina e estado                                                                         |
| `ExerciseVersion`               | caso ou enunciado, tipo correto da peça, origem, metadados, critérios, espelhos e pesos imutáveis |
| `QuestionSubitem` / `Criterion` | ID estável, ordem, texto, espelho e peso                                                          |
| `Theme` / `LegalReference`      | tags padronizadas, diploma e dispositivo                                                          |

### Treinamento

| Entidade         | Campos                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `Attempt`        | usuário, versão do exercício, número, estado, cronômetro, início, envio e versão de concorrência |
| `Answer`         | tentativa, critério e texto                                                                      |
| `SelfAssessment` | tentativa, fatores selecionados, versão da regra, total e auditoria                              |
| `ErrorNote`      | usuário, texto, título, estado e vínculos opcionais                                              |

### Conteúdo e auditoria

| Entidade                 | Campos                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| `Material`               | título, formato, destinos e arquivo privado ou URL                |
| `Phrase` / `DailyPhrase` | cadastro e seleção persistida por data local                      |
| `IncidenceRecord`        | prova ou questão de origem, disciplina, itens, fonte e publicação |
| `AuditEvent`             | ator, ação, alvo, valores relevantes e data                       |

## Invariantes essenciais

- E-mail normalizado único e vínculo de identidade de provedor único. No máximo duas sessões ativas por usuário, sob transação.
- Oferta paga guarda sua versão e preço; mudar o preço futuro não altera pedido antigo. Valores monetários são inteiros em centavos.
- Pedido aprovado concede um direito uma única vez. Restrição de disciplina validada sob transação para impedir duas compras concorrentes incompatíveis.
- Tentativa só pertence a um aluno e fixa uma versão. Texto enviado é imutável; Refazer cria novo registro. Autoavaliação revisável é histórico separado.
- Espelho e tipo correto não são serializados antes da autorização de revelação. Não usar o mesmo objeto completo no endpoint de início.
- Conteúdo referenciado é arquivado ou versionado, preservando integridade. Rascunho, histórico, nota e caderno não são apagados no vencimento.
