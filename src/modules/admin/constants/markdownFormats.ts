import type { FlashcardFormat } from '../utils/parseFlashcardMarkdown';

export const formatLabels: Record<FlashcardFormat, string> = {
  inline: 'Básico',
  inlineReversed: 'Invertido',
  multiline: 'Multilinha',
  multilineReversed: 'Multilinha invertido',
  cloze: 'Lacuna',
};

/** The syntax cheat sheet shown next to the import (Obsidian Spaced Repetition). */
export const formatExamples: { title: string; example: string; note: string }[] = [
  {
    title: 'Básico (uma linha)',
    example: 'Prazo prescricional geral::10 anos',
    note: 'Pergunta e resposta separadas por ::',
  },
  {
    title: 'Invertido (uma linha)',
    example: 'Habeas corpus:::Protege a liberdade de locomoção',
    note: 'Com ::: são criados dois cards, um em cada sentido.',
  },
  {
    title: 'Multilinha',
    example:
      'Quais são as excludentes de ilicitude?\n?\n- Estado de necessidade\n- Legítima defesa',
    note: 'Uma linha só com ? separa a pergunta da resposta. Use ?? para inverter.',
  },
  {
    title: 'Lacuna',
    example: 'O prazo geral é de ==10 anos== (art. {{205}}, CC).',
    note: 'Cada ==trecho== ou {{trecho}} vira um card com a lacuna escondida.',
  },
];
