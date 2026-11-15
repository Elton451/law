# Cenários de homologação

## Conta, compra e autorização

- **QA01** Cadastrar por senha e Google, completar UF e nome, sair e retornar: perfil persistido e mesma oferta preservada. Conta sem compra não lê material. _(SB03)_
- **QA02** Pagamento pendente, recusado e aprovado no sandbox: apenas o aprovado validado ativa. URL de sucesso isolada não ativa. _(SB04)_
- **QA03** Repetir notificação e enviar eventos fora de ordem: um direito por compra e nenhum rebaixamento indevido. Divergência de valor é rejeitada. _(SB04)_
- **QA04** Tentar comprar duas disciplinas simultaneamente para o mesmo exame: a regra aprovada é preservada sem liberar ambas. Definir tratamento de exceção se o provedor já capturou valores. _(SB02)_

## Treinamento e avaliação

- **QA05** Inspecionar tela, payload, rotas, nomes e filtros antes do envio: nenhum tipo correto ou espelho indevido é recebido. _(SB06)_
- **QA06** Digitar nos sete campos, sair, atualizar e retomar: texto confirmado salvo permanece. Simular falha e conflito de abas: sem sobrescrita silenciosa. _(SB07)_
- **QA07** Cronômetro desligado, ligado, recarga e 90 minutos: aviso sem bloqueio ou envio automático; tempo não reinicia. _(SB07)_
- **QA08** Enviar totalmente vazio e clicar duas vezes: uma tentativa enviada, campos vazios registrados e espelho liberado só após sucesso. _(SB07, SB08)_
- **QA09** Autoavaliar parcial e integralmente: pendência distinta de zero; pesos e fatores calculados no servidor; exemplo de pontuação reproduzido; tentativa antiga mantém versão após edição administrativa. _(SB08, SB13)_
- **QA10** Questão com dois subitens: rascunhos, respostas, pesos, espelhos e notas independentes por subitem. _(SB09)_

## Continuidade e administração

- **QA11** Vencimento imediatamente antes e no instante limite: bloquear biblioteca e novas respostas; preservar histórico e caderno. Simular adiamento e verificar reativação conforme a nova data. _(SB12, SB14)_
- **QA12** Entrar em três perfis de navegador: dois permanecem ativos e o escolhido é revogado. Duas abas do mesmo perfil não consomem dois dispositivos. Testar logins concorrentes. _(SB12)_
- **QA13** Solicitar tentativa, nota ou PDF de outro aluno por ID: acesso negado, sem conteúdo sensível na resposta. _(transversal)_
- **QA14** Frase diária em duas contas e dispositivos, antes e depois da meia-noite local: consistência por data; lista vazia tem estado previsto. _(SB05, SB14)_
- **QA15** Administradora publica, versiona e arquiva exercício; participante comum tenta a mesma API e é impedido. Alteração de exame não afeta outra edição. _(SB13, SB14)_
- **QA16** Celular, teclado e leitor de tela: completar cadastro, resposta, envio e anotação. Sem dados, cada tela apresenta orientação útil, sem notas ou estatísticas inventadas. _(transversal)_
