# US-001 — Cadastro de usuário

**Persona:** Estudante (visitante)
**Prioridade:** Alta

## História
Como visitante, quero criar uma conta com e-mail e senha, para acessar as trilhas de estudo e salvar meu progresso.

## Descrição
Formulário de cadastro acessível a partir da página inicial (botões "Login" e "Comprar"). No MVP, o cadastro é apenas por e-mail e senha.

## Critérios de aceite
- [ ] O formulário solicita nome, e-mail, senha e confirmação de senha.
- [ ] O sistema valida o formato do e-mail e impede o cadastro de um e-mail já existente, sem revelar que ele já está cadastrado: a resposta é a mesma de um cadastro novo ("se ainda não houver conta com este e-mail, enviamos um link de confirmação").
- [ ] A senha segue uma política mínima (ex.: 8 caracteres, com letras e números).
- [ ] O sistema exibe mensagens de erro claras por campo.
- [ ] Após o cadastro, o usuário é autenticado e redirecionado para a tela de trilhas (US-006).
- [ ] A conta é criada com o perfil "estudante".
- [ ] O layout é mobile first.

## Regras de negócio
- O e-mail é único no sistema.
- O cadastro não revela se um e-mail já existe (evita enumeração de contas), em linha com o login (US-002) e a recuperação de senha (US-003).
- A senha é armazenada com hash seguro (ex.: bcrypt/argon2), nunca em texto puro.

## Fora de escopo
- Login social (Google etc.).
- Fluxo de pagamento no cadastro.

## Dependências
- Nenhuma.

## Pontos em aberto
- Haverá confirmação de e-mail obrigatória antes do primeiro acesso?
