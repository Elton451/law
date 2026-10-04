# US-004 — Controle de acesso por perfil

**Persona:** Sistema
**Prioridade:** Alta

## História
Como responsável pela plataforma, quero que cada perfil acesse apenas as áreas permitidas, para proteger o conteúdo e a administração.

## Critérios de aceite
- [ ] Rotas da área administrativa só são acessíveis ao perfil `admin`.
- [ ] Rotas da área do estudante exigem autenticação.
- [ ] Um acesso não autorizado redireciona para o login (não autenticado) ou exibe "acesso negado" (autenticado sem permissão).
- [ ] A validação de permissão ocorre no backend, não apenas na interface.

## Regras de negócio
- Existe um único perfil de administrador, com acesso total.
- O perfil `admin` é atribuído diretamente no banco de dados (não há tela para promover usuários).

## Dependências
- US-002.
