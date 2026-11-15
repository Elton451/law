# SB11 — Materiais de apoio

**Persona:** Participante · **Tela:** U02 `/materiais`

## Composição da tela U02

Biblioteca da disciplina com busca e filtros por formato e tema. Cada item mostra título, descrição, formato e publicação.

- PDFs têm **Visualizar** e **Baixar**.
- Vídeos têm **Assistir**.
- Links têm **Abrir recurso**.

Um material pode pertencer a ofertas ou edições definidas pela administradora.

## Sequência do storyboard

1. Aluno com acesso ativo consulta os materiais de seu novelo.
2. Abre um PDF no visualizador e pode baixar. Vídeo abre player incorporado ou página autorizada; link identifica o destino.
3. Se o direito vencer ou o material for despublicado, uma nova solicitação é negada com mensagem clara. Itens de outra disciplina não aparecem por troca de endereço.

## US23 — Acessar apoio da disciplina

Como participante, quero consultar os materiais organizados para complementar meu treino.

**Critérios de aceite**

- [ ] A busca considera apenas itens autorizados e publicados.
- [ ] PDF baixa com nome legível.
- [ ] Vídeo e link não oferecem botão de download da plataforma.
- [ ] Links quebrados mostram orientação sem comprometer o restante da página.
- [ ] O formato é identificado também por texto.

## US24 — Proteger arquivos de apoio

Como responsável pela plataforma, quero que os arquivos respeitem a validade do novelo.

**Critérios de aceite**

- [ ] Arquivos privados não são publicados em diretório aberto.
- [ ] O servidor verifica o acesso antes de conceder URL temporária.
- [ ] Não aceitar um ID arbitrário para assinar outro arquivo.
- [ ] A URL temporária tem validade curta e respeita o vencimento do direito.

## Limite técnico explícito

“Somente PDFs podem ser baixados” significa disponibilizar download apenas para esse formato na interface. Vídeo reproduzido no navegador ou link externo não permite garantia absoluta contra cópia. PDFs já baixados não podem ser retirados do dispositivo após o vencimento. Não prometer essa revogação retroativa.

## Falhas e acessibilidade

- Lista vazia: “Ainda não há materiais publicados para este novelo”.
- Erro de rede: **Tentar novamente**.
- Vídeos devem admitir legendas quando disponíveis; documentos precisam de títulos claros.
- **PROPOSTA:** validar tipo real e tamanho dos uploads, sem permitir arquivos executáveis disfarçados de PDF.
