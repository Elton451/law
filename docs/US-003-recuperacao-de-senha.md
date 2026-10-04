# US-003 — Recuperação de senha

**Persona:** Estudante / Administrador
**Prioridade:** Média

## História
Como usuário que esqueceu a senha, quero redefini-la pelo meu e-mail, para recuperar o acesso à minha conta.

## Critérios de aceite
- [ ] A tela de login tem o link "Esqueci minha senha".
- [ ] O usuário informa o e-mail e recebe um link de redefinição.
- [ ] A mensagem exibida é a mesma, exista ou não o e-mail (por segurança).
- [ ] O link expira após um período definido (ex.: 1 hora) e só pode ser usado uma vez.
- [ ] A nova senha segue a mesma política do cadastro.
- [ ] Após a redefinição, o usuário é direcionado ao login.

## Dependências
- US-001, US-002.
- Serviço de envio de e-mail.
