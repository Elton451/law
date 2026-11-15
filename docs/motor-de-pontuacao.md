# Motor de pontuação e papel da inteligência artificial

Usado em [SB08](./SB08-espelho-e-autoavaliacao.md) (peças) e [SB09](./SB09-questoes-discursivas.md) (questões).

## Modelo determinístico proposto

- Cada critério possui peso máximo `w`.
- A autoavaliação seleciona um fator `f`.
- Pontos do critério = `w × f`.
- Nota da tentativa = soma dos pontos.
- O total máximo é a soma dos pesos da versão do exercício.
- Arredondar apenas o resultado final para duas casas decimais, usando aritmética decimal no servidor.

**CONFIRMADO:** quatro níveis e pesos diferentes configurados pela administradora. Os multiplicadores abaixo **não** foram definidos pela responsável e precisam de aprovação (**PENDENTE** D03).

| Nível da autoavaliação  | Fator proposto |
| ----------------------- | -------------- |
| Em branco ou erro total | 0,00           |
| Acertei pouco           | 0,25           |
| Acertei na média        | 0,50           |
| Acertei total           | 1,00           |

## Exemplo didático sem pesos oficiais

Se dois critérios fictícios têm pesos 2,00 e 1,00 e o aluno marca Acertei na média e Acertei total, a nota é `2,00 × 0,50 + 1,00 × 1,00 = 2,00` de 3,00. Esse exemplo não define pesos reais nem a escala oficial do exame.

## Validações necessárias

- Peso não negativo; soma positiva.
- Quatro fatores ordenados entre 0 e 1.
- Nível ainda não escolhido significa avaliação **pendente**, não zero.
- **PROPOSTA:** resposta efetivamente vazia força fator zero no critério correspondente. Campos apenas com espaços são vazios.
- Critérios com peso zero são identificados como **Não pontuável** e não exigem nível.
- Identificação errada da peça não zera automaticamente os demais campos sem regra editorial explícita aprovada.

## IA não é necessária para somar

A soma ponderada deve ser código comum, testável e reproduzível. O pedido de IA para somar valores é atendido funcionalmente pelo motor de pontuação, cuja adoção precisa ser confirmada (**PENDENTE** D04). Não presumir que o sistema avaliará juridicamente o texto do aluno por IA.

Se a responsável quiser análise textual por IA, criar escopo separado:

- Sugestão por critério com justificativa, indicação de incerteza e revisão pelo aluno; nunca tratar a sugestão como espelho oficial.
- Definir fornecedor, custos, consentimento de envio, retenção e tratamento de falhas antes de implementar.
- Uma indisponibilidade de IA não pode impedir a consulta do espelho ou o cálculo da autoavaliação.
