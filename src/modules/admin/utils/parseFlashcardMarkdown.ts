import { FLASHCARD_LIMITS } from '../constants/flashcards';

/**
 * Card formats of Obsidian's Spaced Repetition plugin, with its default separators:
 *
 *   Pergunta::Resposta          basic, one line
 *   Pergunta:::Resposta         reversed, one line (also makes Resposta → Pergunta)
 *   Pergunta / ? / Resposta     basic, several lines, `?` alone on its line
 *   Pergunta / ?? / Resposta    reversed, several lines
 *   Texto com ==lacuna==        cloze (also {{lacuna}}): one card per gap
 *
 * Cards are separated by blank lines. Frontmatter, headings, tag lines
 * (#flashcards) and the plugin's scheduling comments (<!--SR:...-->) are ignored.
 * `**bold**` stays formatting: the plugin's bold-as-cloze option is not supported.
 */
export type FlashcardFormat =
  'inline' | 'inlineReversed' | 'multiline' | 'multilineReversed' | 'cloze';

export type ParsedFlashcard = {
  front: string;
  back: string;
  format: FlashcardFormat;
  /** The source line the card starts at (1-based), to point the admin at it. */
  line: number;
};

export type ParseIssue = { line: number; severity: 'error' | 'warning'; message: string };

export type ParseResult = { cards: ParsedFlashcard[]; issues: ParseIssue[] };

type SourceLine = { text: string; number: number; inFence: boolean };

const CLOZE_GAP = '[...]';
const SCHEDULING_COMMENT = /<!--SR:.*?-->/g;
const FENCE = /^\s*(```|~~~)/;
const HEADING = /^\s{0,3}#{1,6}\s/;
const TAGS_ONLY = /^\s*(#[^\s#]+\s*)+$/;
const CLOZE = /==(.+?)==|\{\{(.+?)\}\}/g;
const HAS_CLOZE = new RegExp(CLOZE.source);

/** Drops a leading YAML frontmatter, keeping line numbers by blanking it. */
const blankFrontmatter = (lines: string[]) => {
  if (lines[0]?.trim() !== '---') return lines;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end === -1) return lines;
  return lines.map((line, index) => (index <= end ? '' : line));
};

/** Groups lines into blocks split by blank lines and headings; fenced code stays whole. */
const toBlocks = (markdown: string): SourceLine[][] => {
  const lines = blankFrontmatter(markdown.replace(/\r\n?/g, '\n').split('\n'));
  const blocks: SourceLine[][] = [];
  let current: SourceLine[] = [];
  let inFence = false;

  const close = () => {
    if (current.length > 0) blocks.push(current);
    current = [];
  };

  lines.forEach((raw, index) => {
    const isFence = FENCE.test(raw);
    const text = inFence || isFence ? raw : raw.replace(SCHEDULING_COMMENT, '').trimEnd();

    if (!inFence && !isFence) {
      if (text.trim() === '') return close();
      if (HEADING.test(text)) return close();
      if (TAGS_ONLY.test(text)) return;
    }

    current.push({ text, number: index + 1, inFence: inFence || isFence });
    if (isFence) inFence = !inFence;
  });
  close();

  return blocks;
};

/** Where `separator` first appears in the line outside inline code, or -1. */
const indexOutsideCode = (line: string, separator: string) => {
  let inCode = false;
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '`') inCode = !inCode;
    else if (!inCode && line.startsWith(separator, index)) return index;
  }
  return -1;
};

const joinLines = (lines: SourceLine[]) =>
  lines
    .map((line) => line.text)
    .join('\n')
    .trim();

const reversed = (card: ParsedFlashcard, format: FlashcardFormat): ParsedFlashcard[] => [
  { ...card, format },
  { front: card.back, back: card.front, format, line: card.line },
];

const parseMultiline = (block: SourceLine[], separatorIndex: number): ParsedFlashcard[] => {
  const card = {
    front: joinLines(block.slice(0, separatorIndex)),
    back: joinLines(block.slice(separatorIndex + 1)),
    line: block[0].number,
  };
  return block[separatorIndex].text.trim() === '??'
    ? reversed({ ...card, format: 'multilineReversed' }, 'multilineReversed')
    : [{ ...card, format: 'multiline' }];
};

const parseInline = (line: SourceLine): ParsedFlashcard[] => {
  const reversedAt = indexOutsideCode(line.text, ':::');
  const at = reversedAt !== -1 ? reversedAt : indexOutsideCode(line.text, '::');
  const separatorLength = reversedAt !== -1 ? 3 : 2;
  const card = {
    front: line.text.slice(0, at).trim(),
    back: line.text.slice(at + separatorLength).trim(),
    line: line.number,
  };
  return reversedAt !== -1
    ? reversed({ ...card, format: 'inlineReversed' }, 'inlineReversed')
    : [{ ...card, format: 'inline' }];
};

const lineOffset = (text: string, index: number) => text.slice(0, index).split('\n').length - 1;

/** One card per gap: that gap hidden on the front and bold on the back, the others shown. */
const parseCloze = (block: SourceLine[]): ParsedFlashcard[] => {
  const text = joinLines(block);
  const gaps = [...text.matchAll(CLOZE)];

  return gaps.map((gap, gapIndex) => {
    let occurrence = -1;
    const render = (hidden: (answer: string) => string) =>
      text.replace(CLOZE, (_, highlight?: string, curly?: string) => {
        occurrence += 1;
        const answer = highlight ?? curly ?? '';
        return occurrence === gapIndex ? hidden(answer) : answer;
      });

    const front = render(() => CLOZE_GAP);
    occurrence = -1;
    const back = render((answer) => `**${answer}**`);
    return {
      front,
      back,
      format: 'cloze' as const,
      line: block[0].number + lineOffset(text, gap.index),
    };
  });
};

const parseBlock = (block: SourceLine[]): ParseResult => {
  const outsideFences = block.filter((line) => !line.inFence);

  const separatorIndex = block.findIndex(
    (line) => !line.inFence && ['?', '??'].includes(line.text.trim()),
  );
  if (separatorIndex !== -1) return { cards: parseMultiline(block, separatorIndex), issues: [] };

  const inlineLines = outsideFences.filter((line) => indexOutsideCode(line.text, '::') !== -1);
  if (inlineLines.length > 0) {
    return {
      cards: inlineLines.flatMap(parseInline),
      issues: outsideFences
        .filter((line) => !inlineLines.includes(line))
        .map((line) => ({
          line: line.number,
          severity: 'warning' as const,
          message: 'Linha ignorada: não tem "::" como as outras do bloco.',
        })),
    };
  }

  if (HAS_CLOZE.test(joinLines(outsideFences))) {
    return { cards: parseCloze(block), issues: [] };
  }

  return {
    cards: [],
    issues: [
      {
        line: block[0].number,
        severity: 'warning',
        message: 'Bloco ignorado: nenhum formato de flashcard reconhecido.',
      },
    ],
  };
};

const validate = (card: ParsedFlashcard): ParseIssue[] => {
  const issue = (message: string): ParseIssue => ({ line: card.line, severity: 'error', message });
  const issues: ParseIssue[] = [];

  if (!card.front) issues.push(issue('Card sem pergunta.'));
  else if (card.front.length > FLASHCARD_LIMITS.front) {
    issues.push(issue(`Pergunta com mais de ${FLASHCARD_LIMITS.front} caracteres.`));
  }
  if (!card.back) issues.push(issue('Card sem resposta.'));
  else if (card.back.length > FLASHCARD_LIMITS.back) {
    issues.push(issue(`Resposta com mais de ${FLASHCARD_LIMITS.back} caracteres.`));
  }
  return issues;
};

/** Reads flashcards written in Obsidian Spaced Repetition's Markdown formats. */
export const parseFlashcardMarkdown = (markdown: string): ParseResult => {
  const cards: ParsedFlashcard[] = [];
  const issues: ParseIssue[] = [];

  for (const block of toBlocks(markdown)) {
    const result = parseBlock(block);
    cards.push(...result.cards);
    issues.push(...result.issues, ...result.cards.flatMap(validate));
  }

  issues.sort((a, b) => a.line - b.line);
  return { cards, issues };
};

export const hasErrors = ({ issues }: ParseResult) =>
  issues.some((issue) => issue.severity === 'error');
