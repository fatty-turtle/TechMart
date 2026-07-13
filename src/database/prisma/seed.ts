/**
 * src/database/prisma/seed.ts
 *
 * Auto-seeding script for Prisma 7. Reuses the app's existing PrismaService
 * (same adapter/connection setup as the rest of the app) instead of creating
 * a second, separately-configured PrismaClient.
 *
 * How it works:
 *  - Every *.json file in ./data is a "seed file". Filenames don't matter —
 *    each file declares its own target model, so you can name files however
 *    you like (e.g. prefix with numbers like 01-users.json, 02-orders.json
 *    if load order matters for relations).
 *  - Seed file shape:
 *      {
 *        "model": "user",                 // matches prisma.<model>
 *        "uniqueFields": [["email"]],     // optional, see below
 *        "records": [ { ... }, { ... } ]
 *      }
 *  - "uniqueFields" is a list of field groups. Each group is checked in
 *    order; the first group whose fields are all present on a record is
 *    used to look up whether that record already exists. A group with more
 *    than one field name is treated as a compound unique (matches Prisma's
 *    "field1_field2" compound-unique input key).
 *    If omitted, defaults to [["id"]].
 *  - For each record: if a match is found, skip it (already seeded);
 *    otherwise create it.
 *
 * Usage:
 *   npx prisma db seed
 *   (configured via prisma.config.ts -> migrations.seed, see notes at bottom)
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// PrismaService extends PrismaClient and already sets up the adapter/connection.
// This is a plain class instantiation (not run through Nest's DI container),
// which is fine here since the constructor has no injected dependencies.
import { PrismaService } from '../prisma.service';

const DATA_DIR = path.join(__dirname, 'data');

const prisma = new PrismaService();

/** Shape every seed file must follow, after validation. */
interface SeedFile {
  model: string;
  uniqueFields: string[][];
  records: Record<string, unknown>[];
}

/** Runtime validation for a parsed JSON seed file — avoids trusting `unknown` from JSON.parse. */
function parseSeedFile(fileName: string, parsed: unknown): SeedFile | null {
  if (typeof parsed !== 'object' || parsed === null) {
    console.warn(`Skipping ${fileName}: expected a JSON object.`);
    return null;
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.model !== 'string' || !obj.model.trim()) {
    console.warn(`Skipping ${fileName}: missing or invalid "model" field.`);
    return null;
  }

  if (
    !Array.isArray(obj.records) ||
    !obj.records.every((r) => typeof r === 'object' && r !== null)
  ) {
    console.warn(
      `Skipping ${fileName}: "records" must be an array of objects.`,
    );
    return null;
  }
  const records = obj.records as Record<string, unknown>[];

  let uniqueFields: string[][] = [['id']];
  if (obj.uniqueFields !== undefined) {
    const isValid =
      Array.isArray(obj.uniqueFields) &&
      obj.uniqueFields.every(
        (group) =>
          Array.isArray(group) && group.every((f) => typeof f === 'string'),
      );
    if (!isValid) {
      console.warn(
        `Skipping ${fileName}: "uniqueFields" must be a string[][].`,
      );
      return null;
    }
    uniqueFields = obj.uniqueFields as string[][];
  }

  return { model: obj.model, uniqueFields, records };
}

/** Build a `where` clause for an existence check, from the first unique group the record has values for. */
function buildWhereClause(
  record: Record<string, unknown>,
  uniqueFieldSets: string[][],
): Record<string, unknown> | null {
  for (const fields of uniqueFieldSets) {
    const hasAll = fields.every(
      (f) => record[f] !== undefined && record[f] !== null,
    );
    if (!hasAll) continue;

    if (fields.length === 1) {
      return { [fields[0]]: record[fields[0]] };
    }
    // Compound unique -> Prisma expects the special "field1_field2" key
    const compoundKey = fields.join('_');
    const compoundValue = Object.fromEntries(fields.map((f) => [f, record[f]]));
    return { [compoundKey]: compoundValue };
  }
  return null;
}

/** Minimal shape every Prisma model delegate exposes — enough for seeding, fully typed. */
interface ModelDelegate {
  findFirst(args: { where: Record<string, unknown> }): Promise<unknown>;
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
}

async function seedFromFile(seedFile: SeedFile, fileName: string) {
  const client = (
    prisma as unknown as Record<string, ModelDelegate | undefined>
  )[seedFile.model];

  if (!client || typeof client.create !== 'function') {
    console.warn(
      `Skipping ${fileName}: no model "${seedFile.model}" on Prisma Client.`,
    );
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const record of seedFile.records) {
    const where = buildWhereClause(record, seedFile.uniqueFields);

    if (where) {
      const existing = await client.findFirst({ where });
      if (existing) {
        skipped++;
        continue;
      }
    }

    await client.create({ data: record });
    created++;
  }

  console.log(
    `  ${seedFile.model} (${fileName}): ${created} created, ${skipped} already seeded`,
  );
}

/**
 * Ensures an admin user exists, independent of the JSON data files.
 * Reads credentials from env vars so the same seed script can bootstrap an
 * admin in every environment (local, staging, CI) without committing a
 * password to a data file.
 *
 * Required env vars: ADMIN_EMAIL, ADMIN_PASSWORD
 * Optional: ADMIN_FULL_NAME (defaults to "Administrator")
 */
async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME ?? 'Administrator';

  if (!email || !password) {
    console.warn(
      'Skipping admin user: set ADMIN_EMAIL and ADMIN_PASSWORD in your .env to enable this.',
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== 'admin') {
      console.warn(
        `A user with email "${email}" already exists but has role "${existing.role}", not "admin". Leaving it untouched — change ADMIN_EMAIL or update the role manually.`,
      );
    } else {
      console.log(`Admin user already exists (${email}), skipping.`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`Created admin user: ${email}`);
}

async function main() {
  await seedAdminUser();

  if (!fs.existsSync(DATA_DIR)) {
    console.warn(
      `Data folder not found: ${DATA_DIR} — skipping file-based seeding.`,
    );
    return;
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  if (!files.length) {
    console.log('No .json files found in ./data — nothing to seed.');
    return;
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    const seedFile = parseSeedFile(file, parsed);
    if (!seedFile) continue;

    console.log(
      `Seeding "${seedFile.model}" from ${file} (${seedFile.records.length} records)...`,
    );
    await seedFromFile(seedFile, file);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
