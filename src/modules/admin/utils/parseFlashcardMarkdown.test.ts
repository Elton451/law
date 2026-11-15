import { describe, expect, it } from 'vitest';
import { hasErrors, parseFlashcardMarkdown } from './parseFlashcardMarkdown';

const cardsOf = (markdown: string) =>
  parseFlashcardMarkdown(markdown).cards.map(({ front, back, format }) => ({
    front,
    back,
    format,
  }));

describe('parseFlashcardMarkdown', () => {
  it('reads one-line cards', () => {
    expect(cardsOf('Prazo prescricional geral::10 anos (art. 205, CC)')).toEqual([
      { front: 'Prazo prescricional geral', back: '10 anos (art. 205, CC)', format: 'inline' },
    ]);
  });

  it('makes two cards from a reversed one-line card', () => {
    expect(cardsOf('Habeas corpus:::Liberdade de locomoção')).toEqual([
      { front: 'Habeas corpus', back: 'Liberdade de locomoção', format: 'inlineReversed' },
      { front: 'Liberdade de locomoção', back: 'Habeas corpus', format: 'inlineReversed' },
    ]);
  });

  it('reads several one-line cards in a row', () => {
    const { cards } = parseFlashcardMarkdown('A::1\nB::2\nC:::3');
    expect(cards.map((card) => [card.front, card.line])).toEqual([
      ['A', 1],
      ['B', 2],
      ['C', 3],
      ['3', 3],
    ]);
  });

  it('reads multi-line cards, keeping their formatting', () => {
    const markdown = [
      'Quais são as excludentes de ilicitude?',
      '?',
      '- Estado de necessidade',
      '- **Legítima defesa**',
      '',
      'Qual remédio protege a locomoção?',
      '??',
      'Habeas corpus',
    ].join('\n');

    expect(cardsOf(markdown)).toEqual([
      {
        front: 'Quais são as excludentes de ilicitude?',
        back: '- Estado de necessidade\n- **Legítima defesa**',
        format: 'multiline',
      },
      {
        front: 'Qual remédio protege a locomoção?',
        back: 'Habeas corpus',
        format: 'multilineReversed',
      },
      {
        front: 'Habeas corpus',
        back: 'Qual remédio protege a locomoção?',
        format: 'multilineReversed',
      },
    ]);
  });

  it('makes one card per cloze gap', () => {
    expect(cardsOf('O prazo geral é de ==10 anos== (art. {{205}}, CC).')).toEqual([
      {
        front: 'O prazo geral é de [...] (art. 205, CC).',
        back: 'O prazo geral é de **10 anos** (art. 205, CC).',
        format: 'cloze',
      },
      {
        front: 'O prazo geral é de 10 anos (art. [...], CC).',
        back: 'O prazo geral é de 10 anos (art. **205**, CC).',
        format: 'cloze',
      },
    ]);
  });

  it('leaves bold text as formatting, not as a cloze', () => {
    const { cards, issues } = parseFlashcardMarkdown('Um texto **importante** sem cards.');
    expect(cards).toEqual([]);
    expect(issues).toEqual([
      {
        line: 1,
        severity: 'warning',
        message: 'Bloco ignorado: nenhum formato de flashcard reconhecido.',
      },
    ]);
  });

  it('ignores what an Obsidian note carries around the cards', () => {
    const markdown = [
      '---',
      'tags: [direito]',
      '---',
      '#flashcards/civil',
      '# Prescrição',
      'Prazo geral::10 anos',
      '<!--SR:!2026-11-01,3,250-->',
      '',
      'Reparação civil',
      '?',
      '3 anos <!--SR:!2026-11-02,4,270-->',
    ].join('\n');

    const { cards, issues } = parseFlashcardMarkdown(markdown);

    expect(cards.map(({ front, back, line }) => ({ front, back, line }))).toEqual([
      { front: 'Prazo geral', back: '10 anos', line: 6 },
      { front: 'Reparação civil', back: '3 anos', line: 9 },
    ]);
    expect(issues).toEqual([]);
  });

  it('does not split on separators inside code', () => {
    const markdown = ['Como chamar a função?', '?', '```', 'std::sort(v)', '', '?', '```'].join(
      '\n',
    );
    expect(cardsOf(markdown)).toEqual([
      { front: 'Como chamar a função?', back: '```\nstd::sort(v)\n\n?\n```', format: 'multiline' },
    ]);
    expect(cardsOf('O operador `a::b`::resolução de escopo')).toEqual([
      { front: 'O operador `a::b`', back: 'resolução de escopo', format: 'inline' },
    ]);
  });

  it('warns about lines without a separator in a block of one-line cards', () => {
    const { cards, issues } = parseFlashcardMarkdown('A::1\nsem separador\nB::2');
    expect(cards).toHaveLength(2);
    expect(issues).toEqual([
      {
        line: 2,
        severity: 'warning',
        message: 'Linha ignorada: não tem "::" como as outras do bloco.',
      },
    ]);
  });

  it('flags cards missing a side, or too long, as errors', () => {
    const result = parseFlashcardMarkdown(
      `::sem pergunta\n\nPergunta\n?\n\n${'x'.repeat(2001)}::ok`,
    );

    expect(hasErrors(result)).toBe(true);
    expect(result.issues).toEqual([
      { line: 1, severity: 'error', message: 'Card sem pergunta.' },
      { line: 3, severity: 'error', message: 'Card sem resposta.' },
      { line: 6, severity: 'error', message: 'Pergunta com mais de 2000 caracteres.' },
    ]);
  });

  it('accepts Windows line endings', () => {
    expect(cardsOf('Pergunta\r\n?\r\nResposta')).toEqual([
      { front: 'Pergunta', back: 'Resposta', format: 'multiline' },
    ]);
  });
});
