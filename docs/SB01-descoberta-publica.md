# SB01 — Descoberta pública da plataforma

**Persona:** Visitante · **Telas:** P01 `/` → P02

## Composição da tela P01

Topo com marca, Como funciona, Novelos, Calendário e Entrar. Abertura com proposta de preparação prática, chamada **Escolher meu novelo** e área do vídeo explicativo. Abaixo, calendário dos exames publicados, grade dos sete novelos, explicação do treinamento e rodapé institucional.

- Cada cartão apresenta imagem, disciplina e ação **Conhecer o novelo**.
- O calendário apresenta edição, datas informadas pela administradora, situação e fonte quando cadastrada. Não inventar datas nem extrair o número do exame da arte promocional como calendário real.

## Sequência do storyboard

1. A visitante chega sem conta e vê como a plataforma funciona. O vídeo ainda não existe: apresentar área identificada como vídeo em preparação, sem botão de reprodução enganoso.
2. Ela consulta a data da segunda fase e escolhe Civil pelo novelo azul.
3. A aplicação abre P02 com Civil selecionado, permitindo escolher uma edição disponível antes de comprar.

## US01 — Conhecer a proposta

Como visitante, quero entender o método para decidir se a plataforma atende à minha preparação.

**Critérios de aceite**

- [ ] Ao acessar sem login, vejo conteúdo público.
- [ ] Clicar em Entrar abre A02.
- [ ] Clicar em Como funciona leva à explicação.
- [ ] Vídeo ausente não quebra o layout.
- [ ] Dados de exemplo são identificados como demonstrativos.

## US02 — Escolher disciplina e exame

Como visitante, quero abrir a oferta de uma disciplina para uma edição disponível.

**Critérios de aceite**

- [ ] Cada um dos sete cartões abre a disciplina correta.
- [ ] A oferta mantém imagem e nome correspondentes.
- [ ] Não havendo edição aberta, vejo **Sem turma disponível** e a compra fica desabilitada.
- [ ] O usuário pode navegar por todas as ofertas sem comprar.

## Estados alternativos

- Calendário vazio: “As próximas datas serão publicadas aqui”.
- Falha de carregamento: mensagem e **Tentar novamente**.
- Conteúdo expirado não aparece como nova turma à venda, conforme configuração administrativa.
- Sem autoplay de vídeo.
