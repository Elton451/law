# US-021 — Admin: gerenciar módulos e lições

**Persona:** Administrador
**Prioridade:** Alta

## História
Como administrador, quero criar e organizar módulos e lições dentro de cada trilha, para estruturar o conteúdo de estudo.

## Critérios de aceite
- [ ] O painel administrativo tem um menu de navegação para todas as áreas de gestão.
- [ ] O admin seleciona uma das 7 trilhas e vê seus módulos e lições.
- [ ] O admin cria, edita e exclui módulos (título, descrição opcional e ordem).
- [ ] O admin cria, edita e exclui lições dentro de um módulo (título e ordem).
- [ ] O admin reordena módulos e lições (ex.: arrastar e soltar ou campo de ordem).
- [ ] As alterações ficam visíveis aos estudantes imediatamente (sem fluxo de aprovação).
- [ ] O sistema pede confirmação antes de excluir e avisa se há conteúdo vinculado.

## Regras de negócio
- As trilhas não são editáveis pelo painel (são gerenciadas no banco).
- Excluir uma lição com progresso de estudantes deve ser tratado com cuidado (ex.: soft delete).

## Dependências
- US-004.
