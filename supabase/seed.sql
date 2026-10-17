-- Casos concretos de EXEMPLO, um por trilha, para desenvolvimento e testes.
-- São fictícios e simplificados: não são gabaritos oficiais e precisam de revisão
-- jurídica antes de qualquer uso real. O conteúdo de produção virá do painel
-- admin (US-024).
--
-- `supabase db reset` roda este arquivo no banco local. Num projeto remoto, rode
-- pelo SQL Editor. É idempotente: casos com o mesmo título não são duplicados.

create or replace function pg_temp.seed_case(
  p_trail_slug text,
  p_title text,
  p_statement text,
  p_piece text,
  p_addressing text,
  p_qualification text,
  p_grounds text,
  p_requests text,
  p_closing text
) returns void
language plpgsql
as $$
declare
  v_case uuid;
begin
  if exists (select 1 from public.case_studies where title = p_title) then
    return;
  end if;

  insert into public.case_studies (trail_id, title, statement, origin)
  select id, p_title, p_statement, 'autoral'
  from public.trails
  where slug = p_trail_slug
  returning id into v_case;

  insert into public.case_study_answer_keys
    (case_study_id, piece, addressing, qualification, grounds, requests, closing)
  values (v_case, p_piece, p_addressing, p_qualification, p_grounds, p_requests, p_closing);
end;
$$;

select pg_temp.seed_case(
  'administrativo',
  '[Exemplo] Aprovada dentro das vagas e não nomeada',
  $$Maria foi aprovada em 2º lugar no concurso para Analista do Município de Campo Verde, cujo edital previa 3 vagas. O prazo de validade do concurso, já prorrogado, termina em 20 dias. O Município nomeou apenas o 1º colocado e contratou temporários para a mesma função. Maria tem cópia do edital, da homologação do resultado e dos contratos temporários publicados no Diário Oficial. Como advogado(a) de Maria, redija a peça cabível para garantir sua nomeação com urgência.$$,
  'Mandado de segurança (com pedido liminar)',
  $$Excelentíssimo Senhor Doutor Juiz de Direito da __ Vara da Fazenda Pública da Comarca de Campo Verde.$$,
  $$Maria (nacionalidade, estado civil, profissão, CPF, endereço), por seu advogado, impetra mandado de segurança contra ato do Prefeito do Município de Campo Verde, autoridade coatora, vinculada ao Município de Campo Verde (pessoa jurídica interessada).$$,
  $$Cabimento: direito líquido e certo comprovado por prova pré-constituída (art. 5º, LXIX, CF; Lei 12.016/09). Mérito: o candidato aprovado dentro do número de vagas tem direito subjetivo à nomeação (STF, RE 598.099). A contratação de temporários para a mesma função evidencia a necessidade do serviço e reforça o direito. Liminar: fumus boni iuris demonstrado; periculum in mora pelo fim iminente da validade do concurso (art. 7º, III, Lei 12.016/09).$$,
  $$a) concessão de liminar para determinar a nomeação imediata ou a reserva da vaga; b) notificação da autoridade coatora e ciência ao órgão de representação judicial do Município; c) oitiva do Ministério Público; d) concessão da segurança, confirmando a liminar e determinando a nomeação e posse.$$,
  $$Dá-se à causa o valor de R$ ___. Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);

select pg_temp.seed_case(
  'civil',
  '[Exemplo] Infiltração causada pelo vizinho',
  $$João é proprietário de um apartamento no 3º andar. Um vazamento no banheiro do apartamento de cima, de propriedade de Pedro, causou infiltração que danificou o teto, os móveis e um notebook de João. Laudo técnico confirma a origem do vazamento e orçamentos somam R$ 18.000,00. Pedro, notificado, recusou-se a pagar. João ficou 30 dias sem poder usar o quarto. Como advogado(a) de João, redija a peça cabível.$$,
  'Petição inicial de ação de indenização por danos materiais e morais',
  $$Excelentíssimo Senhor Doutor Juiz de Direito da __ Vara Cível da Comarca de ___.$$,
  $$João (qualificação completa, art. 319, II, CPC), por seu advogado, propõe ação de indenização pelo procedimento comum em face de Pedro (qualificação completa).$$,
  $$Fatos: vazamento originado na unidade do réu, comprovado por laudo. Direito: quem causa dano a outrem por ato ilícito fica obrigado a repará-lo (arts. 186 e 927, CC); uso anormal da propriedade e direitos de vizinhança (art. 1.277, CC). Danos materiais comprovados por orçamentos; danos morais pela privação do uso do imóvel.$$,
  $$a) citação do réu; b) condenação ao pagamento de R$ 18.000,00 por danos materiais, com correção e juros; c) condenação por danos morais em valor a ser arbitrado; d) produção de provas, especialmente pericial; e) condenação em custas e honorários; f) opção pela realização ou não de audiência de conciliação (art. 319, VII, CPC).$$,
  $$Valor da causa: R$ ___ (art. 292, CPC). Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);

select pg_temp.seed_case(
  'constitucional',
  '[Exemplo] Dados negados pelo órgão público',
  $$Carlos teve um pedido de crédito negado e descobriu que consta em um cadastro mantido pela autarquia federal Agência Nacional Fictícia (ANF) como inadimplente. Ele requereu administrativamente acesso às informações a seu respeito, mas a ANF recusou-se expressamente a fornecê-las. Carlos deseja conhecer e, se for o caso, retificar esses dados. Como advogado(a) de Carlos, redija a peça cabível.$$,
  'Habeas data',
  $$Excelentíssimo Senhor Doutor Juiz Federal da __ Vara Federal da Seção Judiciária de ___ (art. 109, VIII, CF; art. 20, I, d, Lei 9.507/97).$$,
  $$Carlos (qualificação completa), por seu advogado, impetra habeas data contra ato do Presidente da Agência Nacional Fictícia (ANF), autoridade coatora.$$,
  $$Cabimento: assegurar o conhecimento de informações relativas ao impetrante constantes de registros de entidade governamental (art. 5º, LXXII, a, CF). Interesse de agir: recusa administrativa comprovada (art. 8º, parágrafo único, I, Lei 9.507/97; Súmula 2 do STJ). Direito à retificação dos dados incorretos (art. 5º, LXXII, b, CF).$$,
  $$a) notificação da autoridade coatora para prestar informações; b) oitiva do Ministério Público; c) procedência para que a autoridade apresente as informações e, constatado o erro, as retifique; d) gratuidade da ação (art. 5º, LXXVII, CF).$$,
  $$Valor da causa: R$ ___. Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);

select pg_temp.seed_case(
  'empresarial',
  '[Exemplo] Duplicata sem compra e venda',
  $$A empresa Alfa Ltda. foi surpreendida com o protesto de uma duplicata de R$ 40.000,00 emitida pela Beta Comércio Ltda. As duas empresas nunca celebraram compra e venda nem prestação de serviço: não há nota fiscal, pedido ou comprovante de entrega. O protesto impediu a Alfa de obter financiamento bancário. Como advogado(a) da Alfa Ltda., redija a peça cabível.$$,
  'Petição inicial de ação declaratória de inexigibilidade de título c/c cancelamento de protesto e indenização (com tutela de urgência)',
  $$Excelentíssimo Senhor Doutor Juiz de Direito da __ Vara Cível da Comarca de ___.$$,
  $$Alfa Ltda. (CNPJ, sede), representada por seu sócio administrador, por seu advogado, propõe ação em face de Beta Comércio Ltda. (CNPJ, sede).$$,
  $$A duplicata é título causal: só pode ser emitida a partir de compra e venda ou prestação de serviços efetivas (arts. 1º, 2º e 20, Lei 5.474/68). Sem negócio subjacente, o título é inexigível e o protesto, indevido. O protesto indevido gera dano moral à pessoa jurídica (Súmula 227, STJ). Tutela de urgência para sustar os efeitos do protesto (art. 300, CPC).$$,
  $$a) tutela de urgência para suspender os efeitos do protesto; b) citação da ré; c) declaração de inexigibilidade do título; d) cancelamento definitivo do protesto; e) indenização por danos morais; f) custas e honorários; g) provas.$$,
  $$Valor da causa: R$ ___. Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);

select pg_temp.seed_case(
  'penal',
  '[Exemplo] Condenação baseada só no inquérito',
  $$Lucas foi condenado por furto (art. 155, CP) a 1 ano e 6 meses de reclusão. A sentença se baseou apenas no reconhecimento feito na delegacia, sem as formalidades do art. 226 do CPP. Em juízo, a vítima disse não ter certeza de que o autor era Lucas, e nenhuma outra prova foi produzida. A defesa foi intimada da sentença ontem. Como advogado(a) de Lucas, redija a peça cabível.$$,
  'Apelação (interposição e razões)',
  $$Interposição: Excelentíssimo Senhor Doutor Juiz de Direito da __ Vara Criminal da Comarca de ___. Razões: Egrégio Tribunal de Justiça do Estado de ___.$$,
  $$Lucas, já qualificado nos autos, por seu advogado, não se conformando com a sentença condenatória, interpõe apelação, no prazo de 5 dias (art. 593, I, CPP), requerendo o recebimento e a remessa das razões ao Tribunal.$$,
  $$O juiz não pode fundamentar a condenação exclusivamente em elementos colhidos no inquérito (art. 155, CPP). O reconhecimento sem as formalidades do art. 226 do CPP é inválido (STJ, HC 598.886). Em juízo, a vítima não confirmou a autoria. Havendo dúvida, aplica-se o in dubio pro reo.$$,
  $$a) recebimento e processamento da apelação; b) provimento do recurso para absolver o apelante por não existir prova suficiente para a condenação (art. 386, VII, CPP).$$,
  $$Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);

select pg_temp.seed_case(
  'trabalhista',
  '[Exemplo] Dispensa sem verbas rescisórias',
  $$Ana trabalhou de 01/03/2022 a 10/08/2025 como vendedora na Loja Gama Ltda., com salário de R$ 2.500,00, e foi dispensada sem justa causa. Não recebeu saldo de salário, aviso prévio, 13º proporcional, férias vencidas e proporcionais com 1/3 nem a multa de 40% do FGTS. Também não teve as guias para saque do FGTS e do seguro-desemprego. Como advogado(a) de Ana, redija a peça cabível.$$,
  'Reclamação trabalhista (petição inicial)',
  $$Excelentíssimo Senhor Doutor Juiz do Trabalho da __ Vara do Trabalho de ___.$$,
  $$Ana (qualificação completa, incluindo CTPS e PIS), por seu advogado, propõe reclamação trabalhista pelo rito ordinário em face de Loja Gama Ltda. (CNPJ, endereço).$$,
  $$Dispensa sem justa causa sem pagamento das verbas rescisórias no prazo de 10 dias (art. 477, § 6º, CLT): devidos saldo de salário, aviso prévio proporcional (Lei 12.506/11), 13º proporcional, férias vencidas e proporcionais + 1/3, multa de 40% do FGTS, multa do art. 477, § 8º, e multa do art. 467 da CLT sobre as verbas incontroversas. Entrega das guias do FGTS e do seguro-desemprego.$$,
  $$Pedidos certos, determinados e com valor (art. 840, § 1º, CLT): a) saldo de salário; b) aviso prévio indenizado; c) 13º proporcional; d) férias + 1/3; e) multa de 40% do FGTS; f) multas dos arts. 477, § 8º, e 467 da CLT; g) entrega das guias ou indenização substitutiva; h) honorários de sucumbência (art. 791-A, CLT); i) justiça gratuita.$$,
  $$Valor da causa: R$ ___. Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);

select pg_temp.seed_case(
  'tributario',
  '[Exemplo] Execução de IPTU já pago',
  $$O Município de Serra Azul ajuizou execução fiscal contra Roberto para cobrar o IPTU de 2023. Roberto pagou o tributo em dia e guarda o comprovante bancário. Citado, ele teve um imóvel penhorado e foi intimado da penhora há 10 dias. Como advogado(a) de Roberto, redija a peça cabível para extinguir a cobrança.$$,
  'Embargos à execução fiscal',
  $$Excelentíssimo Senhor Doutor Juiz de Direito da Vara da Fazenda Pública da Comarca de Serra Azul, distribuição por dependência à execução fiscal nº ___.$$,
  $$Roberto (qualificação completa), por seu advogado, opõe embargos à execução fiscal em face do Município de Serra Azul, no prazo de 30 dias contados da intimação da penhora (art. 16, III, Lei 6.830/80), estando o juízo garantido.$$,
  $$O pagamento extingue o crédito tributário (art. 156, I, CTN). Comprovado o pagamento, o título executivo perde a certeza e a exigibilidade, e a execução deve ser extinta. Pedido de efeito suspensivo, pois o juízo está garantido e há risco de dano (art. 919, § 1º, CPC, aplicado subsidiariamente).$$,
  $$a) recebimento dos embargos com efeito suspensivo; b) intimação do embargado para impugnar; c) procedência para reconhecer a extinção do crédito pelo pagamento e extinguir a execução; d) levantamento da penhora; e) condenação em honorários; f) provas, especialmente o comprovante de pagamento.$$,
  $$Valor da causa: R$ ___ (valor da execução). Nestes termos, pede deferimento. Local, data. Advogado, OAB nº ___.$$
);
