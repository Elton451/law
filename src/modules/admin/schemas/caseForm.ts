import { z } from 'zod';

// Limits mirror the checks in the database (20261025000000_admin_case_studies.sql).
const requiredText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'Preencha este campo.')
    .max(max, `Use no máximo ${max.toLocaleString('pt-BR')} caracteres.`);

export const caseOriginSchema = z.enum(['oab', 'autoral']);

export const caseFormSchema = z
  .object({
    trailId: z.string().min(1, 'Escolha a trilha.'),
    title: requiredText(200),
    statement: requiredText(20000),
    origin: caseOriginSchema,
    examEdition: z.string().trim().max(50, 'Use no máximo 50 caracteres.'),
    isActive: z.boolean(),
    piece: requiredText(200),
    addressing: requiredText(20000),
    qualification: requiredText(20000),
    grounds: requiredText(20000),
    requests: requiredText(20000),
    closing: requiredText(20000),
  })
  .refine(({ origin, examEdition }) => origin !== 'oab' || examEdition !== '', {
    path: ['examEdition'],
    message: 'Informe o exame da OAB (ex.: XXXV Exame).',
  });

export type CaseFormValues = z.output<typeof caseFormSchema>;

export const emptyCaseForm: CaseFormValues = {
  trailId: '',
  title: '',
  statement: '',
  origin: 'oab',
  examEdition: '',
  isActive: true,
  piece: '',
  addressing: '',
  qualification: '',
  grounds: '',
  requests: '',
  closing: '',
};
