# US-018 — Timer da prova

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero um cronômetro durante o caso concreto, para treinar a produção da peça dentro do tempo.

## Critérios de aceite
- [ ] Ao abrir o caso, o sistema exibe um aviso de início ("Sua peça começou! Você tem 1h").
- [ ] O timer faz contagem regressiva a partir do tempo configurado (US-014) e fica sempre visível.
- [ ] Quando o tempo acaba, o timer fica vermelho e o sistema exibe um aviso de que o tempo estourou, incentivando o estudante a buscar concluir dentro do tempo.
- [ ] Após estourar, o timer continua contando o tempo excedente (ex.: "+05:32").
- [ ] Nada é bloqueado: o estudante continua escrevendo e pode enviar normalmente.
- [ ] O tempo total gasto e o indicador "dentro/fora do tempo" ficam salvos com a resposta.

## Regras de negócio
- O timer se baseia no horário de início salvo, para não reiniciar se a página for recarregada.

## Dependências
- US-014, US-017.
