# Novelo Jurídico — Storyboards e histórias de usuário

Especificação funcional do protótipo navegável com cadastro real, persistência de dados e controle de acesso. Destinada à pessoa desenvolvedora e à responsável pelo produto para implementar e validar as jornadas pública, do participante e da administração.

## Como usar esta documentação

Cada storyboard (SB) descreve a composição da tela, a sequência de interação, os estados de exceção e as histórias de usuário (US) com critérios de aceite. Os identificadores SB e US devem ser mantidos nas tarefas, telas e testes para rastrear o escopo.

| Marcador       | Significado                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **CONFIRMADO** | Decisão expressa pela responsável.                                                                            |
| **PROPOSTA**   | Regra sugerida para tornar o desenvolvimento verificável. Não é aprovação já obtida.                          |
| **PENDENTE**   | Decisão ainda necessária (ver [D01–D08](./plano-e-decisoes.md#decisões-que-exigem-validação-da-responsável)). |

## Escopo da primeira entrega

Aplicação responsiva com página pública, escolha do novelo, cadastro e login por senha e Google, compra em ambiente de teste, painel do participante, treinamento de peças e questões, autoavaliação ponderada, histórico, caderno de erros, materiais e painel administrativo.

- As integrações de pagamento devem ser demonstradas em **sandbox**; cobrança real depende de configuração e validação posteriores.
- Esta documentação descreve a implementação; não constitui a plataforma já desenvolvida.

## Regras de negócio confirmadas

### Comercialização e acesso

- **RN01** Cada oferta combina uma disciplina com uma edição do Exame de Ordem e custa **R$ 79,90**. O aluno não compra múltiplas disciplinas; o alcance dessa restrição entre edições futuras permanece **PENDENTE** (D01).
- **RN02** O acesso ao material começa após a confirmação do pagamento e termina um dia depois da segunda fase. O adiamento da prova atualiza a validade do acesso.
- **RN03** Após o vencimento, o participante continua acessando seu histórico e caderno de erros, mas perde o acesso ao material do novelo.
- **RN04** Pagamento deve oferecer Pix, cartão e parcelamento. Mercado Pago é o candidato indicado; número de parcelas e juros não foram definidos.

### Conta e treinamento

- **RN05** Cadastro com nome completo conforme documento oficial, e-mail, UF, edição do exame e disciplina. Login por e-mail e senha e por Google. A escolha da oferta preenche exame e disciplina.
- **RN06** Peças respondidas em sete campos digitados. Primeira tentativa de cada exercício com tipo da peça oculto. Envio em branco permitido.
- **RN07** Cronômetro opcional de 90 minutos. Atingir o tempo gera alerta, sem bloquear escrita e sem enviar automaticamente.
- **RN08** Rascunhos retomáveis, novas tentativas independentes e histórico com filtros por tipo de peça após a revelação.
- **RN09** Questões discursivas com subitens, filtros por tema, artigo e exame e mesma lógica de autoavaliação ponderada.

### Conteúdo e administração

- **RN10** Uma administradora gerencia usuários, exercícios, espelhos, pesos, materiais, painéis, calendário e frases. Sem gestão manual de compras, liberação manual de acesso ou exportação de relatórios na interface.
- **RN11** Materiais em PDF, vídeo e links. Somente PDFs disponibilizados para download.
- **RN12** Petisco Diário com a mesma frase para todos no mesmo dia, escolhida da lista administrada. Sem ranking competitivo entre alunos.
- **RN13** No máximo dois dispositivos com acesso simultâneo. Um terceiro acesso encerra uma das sessões anteriores.

## Mapa de navegação e estados de acesso

### Rotas públicas e de autenticação

| ID  | Rota                            | Tela                               |
| --- | ------------------------------- | ---------------------------------- |
| P01 | `/`                             | Página inicial                     |
| P02 | `/novelos/{disciplina}/{exame}` | Oferta                             |
| A01 | `/cadastro`                     | Registro                           |
| A02 | `/entrar`                       | Autenticação                       |
| A03 | `/recuperar-senha`              | Recuperação                        |
| C01 | `/compra/{pedido}`              | Andamento e resultado do pagamento |

### Área do participante

| ID  | Rota                         | Tela                    |
| --- | ---------------------------- | ----------------------- |
| U01 | `/participante`              | Dashboard               |
| U02 | `/materiais`                 | Biblioteca              |
| U03 | `/pecas`                     | Seleção e retomada      |
| U04 | `/pecas/tentativas/{id}`     | Formulário              |
| U05 | `/tentativas/{id}/resultado` | Espelho e autoavaliação |
| U06 | `/questoes`                  | Catálogo                |
| U07 | `/questoes/tentativas/{id}`  | Resposta por subitem    |
| U08 | `/historico`                 | Tentativas              |
| U09 | `/caderno`                   | Anotações               |
| U10 | `/conta`                     | Perfil e sessões        |

### Administração

| ID   | Rota                | Tela             |
| ---- | ------------------- | ---------------- |
| AD01 | `/admin`            | Resumo           |
| AD02 | `/admin/exercicios` | Peças e questões |
| AD03 | `/admin/materiais`  | Apoio            |
| AD04 | `/admin/exames`     | Calendário       |
| AD05 | `/admin/petiscos`   | Frases           |
| AD06 | `/admin/paineis`    | Estatísticas     |
| AD07 | `/admin/usuarios`   | Contas           |

Nenhuma rota administrativa deve ser autorizada apenas por ocultação no menu.

### Menu lateral

Dashboard, Material de apoio, Treinamento de peças, Treinamento de questões, Histórico, Caderno de erros e Minha conta. Histórico e Caderno ganham entradas próprias para permitir consulta após o vencimento. No celular, menu recolhível e ações principais acessíveis sem rolagem horizontal.

### PROPOSTA de máquina de estados

Visitante → cadastrado sem compra → pagamento pendente → acesso ativo → acesso vencido.

- Pagamento recusado ou cancelado retorna à compra sem liberar conteúdo.
- Estorno confirmado revoga o direito de acesso conforme política comercial a validar, preservando os registros do aluno.
- Ao autenticar, o servidor calcula o estado do direito de acesso. **Não confundir estar autenticado com poder estudar.**
- Histórico, caderno e conta requerem autenticação, mas não assinatura ativa. APIs de materiais, novos exercícios, envio e rascunhos exigem acesso ativo.

### Critério transversal

Dado um endereço copiado de outro aluno ou de uma disciplina não adquirida, quando solicitado, então o servidor nega o recurso sem devolver seu conteúdo. O mesmo controle vale para URLs de arquivos e requisições em segundo plano.

## Identidade visual e componentes

Usar o logotipo fornecido, preservando proporções e legibilidade. Usar os sete novelos enviados como imagens das disciplinas, acompanhados do nome textual. Marfim como fundo principal, ameixa para texto e navegação, lavanda para superfícies de apoio, ametista para seleção e dourado para ações de destaque.

As fontes não foram identificadas nominalmente. **PROPOSTA** provisória: títulos em Georgia e interface em uma fonte sem serifa do sistema. Não declarar essas fontes como oficiais; a substituição depende do arquivo ou nome aprovado pela responsável.

### Paleta da marca

| Uso        | Cor      | HEX       |
| ---------- | -------- | --------- |
| Principal  | Ameixa   | `#302638` |
| Apoio      | Ametista | `#8063AD` |
| Superfície | Lavanda  | `#E7E0EF` |
| Base       | Marfim   | `#F8F6F2` |
| Destaque   | Dourado  | `#C6A15B` |

### Cores dos novelos (disciplinas)

| Disciplina     | Novelo           | HEX da referência |
| -------------- | ---------------- | ----------------- |
| Administrativo | Rosa             | `#F084CF`         |
| Civil          | Azul             | `#74C8F0`         |
| Constitucional | Verde            | `#4CCD73`         |
| Empresarial    | Preto ou grafite | `#575757`         |
| Penal          | Vermelho         | `#F16F70`         |
| Trabalhista    | Laranja          | `#F99F78`         |
| Tributário     | Amarelo          | `#F6E9A4`         |

Os HEX das disciplinas são aproximações descritas na referência. O novelo Empresarial permanece preto ou grafite conforme o arquivo enviado. Não depender só da cor para identificar disciplinas, erros ou status.

### Componentes necessários

Cartões de disciplina, campos rotulados, seletores, abas, editor de texto, cronômetro, alerta persistente, diálogo de confirmação, tabela responsiva, filtros, indicador de salvamento e estados de carregamento, vazio, indisponível e erro. Validar contraste e navegação por teclado; tons claros não devem receber texto branco sem contraste suficiente.

## Índice

### Storyboards do participante

| SB                                             | Título                                  | Telas              | Histórias        |
| ---------------------------------------------- | --------------------------------------- | ------------------ | ---------------- |
| [SB01](./SB01-descoberta-publica.md)           | Descoberta pública da plataforma        | P01                | US01, US02       |
| [SB02](./SB02-oferta-e-compra.md)              | Oferta e preparação da compra           | P02                | US03, US04       |
| [SB03](./SB03-cadastro-autenticacao-perfil.md) | Cadastro, autenticação e perfil         | A01, A02, A03, U10 | US05, US06       |
| [SB04](./SB04-pagamento-e-ativacao.md)         | Pagamento e ativação do novelo          | C01                | US07, US08       |
| [SB05](./SB05-dashboard-e-petisco-diario.md)   | Dashboard e Petisco Diário              | U01                | US09, US10, US11 |
| [SB06](./SB06-selecao-de-pecas.md)             | Seleção de peças sem revelar a resposta | U03                | US12, US13       |
| [SB07](./SB07-resposta-e-cronometro.md)        | Resposta estruturada e cronômetro       | U04                | US14, US15, US16 |
| [SB08](./SB08-espelho-e-autoavaliacao.md)      | Espelho, autoavaliação e resultado      | U05                | US17, US18       |
| [SB09](./SB09-questoes-discursivas.md)         | Treinamento de questões discursivas     | U06, U07           | US19, US20       |
| [SB10](./SB10-historico-e-caderno.md)          | Histórico e caderno de erros            | U08, U09           | US21, US22       |
| [SB11](./SB11-materiais-de-apoio.md)           | Materiais de apoio                      | U02                | US23, US24       |
| [SB12](./SB12-vencimento-e-dispositivos.md)    | Vencimento e limite de dispositivos     | U01, U10           | US25, US26       |

### Storyboards da administração

| SB                                                  | Título                                          | Telas            | Histórias        |
| --------------------------------------------------- | ----------------------------------------------- | ---------------- | ---------------- |
| [SB13](./SB13-admin-pecas-e-questoes.md)            | Administração de peças e questões               | AD01, AD02       | US27, US28       |
| [SB14](./SB14-admin-calendario-materiais-frases.md) | Administração de calendário, materiais e frases | AD03, AD04, AD05 | US29, US30, US31 |
| [SB15](./SB15-admin-paineis-e-usuarios.md)          | Administração de painéis e usuários             | AD06, AD07       | US32, US33       |

### Flashcards

Funcionalidade já existente no produto, fora da especificação de storyboards acima. Mantém a numeração da documentação anterior (`US-0xx`), referenciada no código.

| US                                               | Título                         |
| ------------------------------------------------ | ------------------------------ |
| [US-009](./US-009-estudo-com-flashcards.md)      | Estudo com flashcards          |
| [US-010](./US-010-repeticao-espacada.md)         | Revisão com repetição espaçada |
| [US-023](./US-023-admin-gerenciar-flashcards.md) | Admin: gerenciar flashcards    |

As dependências citadas nessas histórias (US-007 página da matéria, US-011 XP, US-012 streak, US-021 módulos e lições) pertenciam à documentação anterior e não fazem parte desta especificação.

### Referência técnica

- [Motor de pontuação e papel da IA](./motor-de-pontuacao.md)
- [Modelo de dados e invariantes](./modelo-de-dados.md)
- [Contratos técnicos e requisitos transversais](./contratos-tecnicos.md)
- [Cenários de homologação (QA01–QA16)](./homologacao.md)
- [Plano de implementação e decisões pendentes (D01–D08)](./plano-e-decisoes.md)
