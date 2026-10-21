import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { PGlite, type Transaction } from '@electric-sql/pglite';

const migrationsDir = path.resolve(import.meta.dirname, '../migrations');

// The slice of the Supabase platform the migrations rely on: the API roles,
// `auth.users`, `auth.uid()`, and the default grants Supabase gives those roles.
const supabaseStub = `
  create role anon nologin;
  create role authenticated nologin;

  create schema auth;
  create table auth.users (
    id uuid primary key,
    raw_user_meta_data jsonb not null default '{}'
  );
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;

  grant usage on schema public, auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
  alter default privileges in schema public grant all on sequences to anon, authenticated;
`;

const migrationFiles = () =>
  readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

/** Applies the migrations whose file name passes `include`, in order. */
export const migrate = async (db: PGlite, include: (file: string) => boolean = () => true) => {
  for (const file of migrationFiles().filter(include)) {
    await db.exec(readFileSync(path.join(migrationsDir, file), 'utf8'));
  }
};

/**
 * A fresh in-memory Postgres with the migrations applied, in order. Pass
 * `before` (a migration's file name) to stop just before it.
 */
export const createDb = async ({ before }: { before?: string } = {}) => {
  const db = new PGlite();
  await db.exec(supabaseStub);
  await migrate(db, (file) => !before || file < before);
  return db;
};

/** Runs `fn` the way PostgREST runs a request carrying `userId`'s JWT. */
export const asUser = <T>(db: PGlite, userId: string, fn: (tx: Transaction) => Promise<T>) =>
  db.transaction(async (tx) => {
    await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [userId]);
    await tx.exec('set local role authenticated');
    return fn(tx);
  });

export const createUser = async (db: PGlite, id: string) => {
  await db.query(`insert into auth.users (id, raw_user_meta_data) values ($1, $2)`, [
    id,
    { name: 'Estudante' },
  ]);
  return id;
};

export const trailId = async (db: PGlite, slug: string) => {
  const { rows } = await db.query<{ id: string }>(`select id from public.trails where slug = $1`, [
    slug,
  ]);
  return rows[0].id;
};

/** An active, authored case with its answer key. */
export const createCase = async (db: PGlite, trail: string, title: string) => {
  const { rows } = await db.query<{ id: string }>(
    `insert into public.case_studies (trail_id, title, statement, origin)
     values ($1, $2, 'Enunciado', 'autoral') returning id`,
    [trail, title],
  );
  await db.query(
    `insert into public.case_study_answer_keys
       (case_study_id, piece, addressing, qualification, grounds, requests, closing)
     values ($1, 'Petição inicial', 'Endereçamento', 'Qualificação', 'Fundamentos', 'Pedidos', 'Fechamento')`,
    [rows[0].id],
  );
  return rows[0].id;
};
