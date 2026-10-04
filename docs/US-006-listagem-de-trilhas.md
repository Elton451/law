# US-006 — Listagem de trilhas

**Persona:** Estudante
**Prioridade:** Alta

## História
Como estudante, quero ver todas as trilhas disponíveis com meu progresso em cada uma, para escolher o que estudar.

## Descrição
Tela inicial do estudante logado. Exibe as 7 trilhas (novelos) e o menu lateral (logo, perfil, configurações, logout).

## Critérios de aceite
- [ ] A tela exibe as 7 trilhas em ordem alfabética, com nome, cor e ícone de novelo.
- [ ] Cada trilha mostra o percentual de progresso do estudante.
- [ ] Ao clicar numa trilha, o estudante acessa a página da matéria (US-007).
- [ ] A tela exibe o XP total e o streak atual do estudante (US-011, US-012).
- [ ] O menu lateral dá acesso a perfil (US-013), configurações (US-014) e logout.
- [ ] Em telas pequenas, o menu lateral vira um menu recolhível.

## Regras de negócio
- As trilhas são fixas e cadastradas diretamente no banco de dados; não há CRUD de trilhas.
- Todas as trilhas ficam liberadas desde o início (navegação livre).

## Dependências
- US-002.
