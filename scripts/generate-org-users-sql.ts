import { writeFileSync } from "fs";
import { join } from "path";
import { orgData } from "../lib/organigramma/transform-data";

type OrgPerson = {
  ruolo: string;
  nome: string;
  riporta_a?: string | null;
  riporti?: OrgPerson[];
  aree?: Array<{
    nome_area: string;
    responsabile?: { ruolo: string; nome: string };
    riporti?: OrgPerson[];
    team?: Array<{ nome: string; posizione?: string; ruolo?: string }>;
  }>;
  team?: Array<{ nome: string; posizione?: string; ruolo?: string }>;
  area?: string;
  societa?: string;
  altri_ruoli?: string[];
  posizione?: string;
};

type UserEntry = {
  nome: string;
  email: string;
  referentEmail: string | null;
  ruolo: string;
  title: string | null;
  posizione: string | null;
  area: string | null;
  societa: string | null;
  altri_ruoli: string[] | null;
};

const normalizeEmail = (nome: string): string => {
  const normalized = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  const parts = normalized.split(/\s+/);
  if (parts.length >= 2) {
    const nome = parts[0];
    const cognome = parts.slice(1).join("");
    return `${nome}.${cognome}@bitrock.it`;
  }

  return `${normalized.replace(/\s+/g, ".")}@bitrock.it`;
};

const extractUsers = (): UserEntry[] => {
  const users: UserEntry[] = [];
  const emailMap = new Map<string, string>();
  const processedNames = new Set<string>();

  const processPerson = (
    person: OrgPerson,
    parentEmail: string | null,
    _parentName: string | null,
    currentArea: string | null = null,
    currentSocieta: string | null = null
  ): void => {
    if (processedNames.has(person.nome)) {
      return;
    }

    const email = normalizeEmail(person.nome);
    emailMap.set(person.nome, email);
    processedNames.add(person.nome);

    const referentEmail = parentEmail || null;
    const title = person.ruolo || null;
    const posizione = person.posizione || null;
    const area = person.area || currentArea || null;
    const societa = person.societa || currentSocieta || null;
    const altri_ruoli =
      person.altri_ruoli && person.altri_ruoli.length > 0 ? person.altri_ruoli : null;

    users.push({
      nome: person.nome,
      email,
      referentEmail,
      ruolo: person.ruolo,
      title,
      posizione,
      area,
      societa,
      altri_ruoli,
    });

    if (person.riporti && person.riporti.length > 0) {
      for (const riporto of person.riporti) {
        processPerson(riporto, email, person.nome, area, societa);
      }
    }

    if (person.aree && person.aree.length > 0) {
      for (const areaObj of person.aree) {
        const areaName = areaObj.nome_area;
        if (areaObj.riporti && areaObj.riporti.length > 0) {
          for (const riporto of areaObj.riporti) {
            processPerson(riporto, email, person.nome, areaName, societa);
          }
        }

        if (areaObj.team && areaObj.team.length > 0) {
          for (const teamMember of areaObj.team) {
            if (processedNames.has(teamMember.nome)) {
              continue;
            }

            const teamEmail = normalizeEmail(teamMember.nome);
            emailMap.set(teamMember.nome, teamEmail);
            processedNames.add(teamMember.nome);

            users.push({
              nome: teamMember.nome,
              email: teamEmail,
              referentEmail: email,
              ruolo: teamMember.posizione || teamMember.ruolo || "Team Member",
              title: teamMember.ruolo || teamMember.posizione || null,
              posizione: teamMember.posizione || null,
              area: areaName,
              societa,
              altri_ruoli: null,
            });
          }
        }
      }
    }

    if (person.team && person.team.length > 0) {
      for (const teamMember of person.team) {
        if (processedNames.has(teamMember.nome)) {
          continue;
        }

        const teamEmail = normalizeEmail(teamMember.nome);
        emailMap.set(teamMember.nome, teamEmail);
        processedNames.add(teamMember.nome);

        users.push({
          nome: teamMember.nome,
          email: teamEmail,
          referentEmail: email,
          ruolo: teamMember.ruolo || teamMember.posizione || "Team Member",
          title: teamMember.ruolo || teamMember.posizione || null,
          posizione: teamMember.posizione || null,
          area,
          societa,
          altri_ruoli: null,
        });
      }
    }
  };

  const ceo = orgData.gruppo.organigramma;
  const ceoEmail = normalizeEmail(ceo.nome);
  emailMap.set(ceo.nome, ceoEmail);
  processedNames.add(ceo.nome);

  users.push({
    nome: ceo.nome,
    email: ceoEmail,
    referentEmail: null,
    ruolo: ceo.ruolo,
    title: ceo.ruolo,
    posizione: null,
    area: null,
    societa: null,
    altri_ruoli: ceo.altri_ruoli || null,
  });

  if (ceo.riporti && ceo.riporti.length > 0) {
    for (const riporto of ceo.riporti) {
      processPerson(riporto, ceoEmail, ceo.nome, null, null);
    }
  }

  return users;
};

const generateSQL = (): string => {
  const users = extractUsers();

  // Collect unique areas and societa
  const uniqueAreas = new Set<string>();
  const uniqueSocieta = new Set<string>();

  for (const user of users) {
    if (user.area) {
      uniqueAreas.add(user.area);
    }
    if (user.societa) {
      uniqueSocieta.add(user.societa);
    }
  }

  let sql = `-- SQL Script to insert/update users from organizational chart
-- Generated automatically from organigramma data
-- Order: Top-down (CEO first, then direct reports, etc.)
--
-- This script:
-- 1. Inserts/updates areas in the area table
-- 2. Inserts/updates societa in the societa table
-- 3. Inserts/updates users with all organizational fields

BEGIN;

-- Insert/update areas
`;

  for (const areaName of Array.from(uniqueAreas).sort()) {
    const escapedArea = areaName.replace(/'/g, "''");
    sql += `INSERT INTO "public"."area" ("name")
VALUES ('${escapedArea}')
ON CONFLICT (name) DO NOTHING;

`;
  }

  sql += `-- Insert/update societa
`;

  for (const societaName of Array.from(uniqueSocieta).sort()) {
    const escapedSocieta = societaName.replace(/'/g, "''");
    sql += `INSERT INTO "public"."societa" ("name")
VALUES ('${escapedSocieta}')
ON CONFLICT (name) DO NOTHING;

`;
  }

  sql += `-- Insert/update users
`;

  for (const user of users) {
    const referentIdSQL = user.referentEmail
      ? `(SELECT id FROM "public"."user" WHERE email = '${user.referentEmail}')`
      : "NULL";

    const escapedName = user.nome.replace(/'/g, "''");
    const escapedEmail = user.email.replace(/'/g, "''");
    const escapedTitle = user.title ? `'${user.title.replace(/'/g, "''")}'` : "NULL";
    const escapedPosizione = user.posizione ? `'${user.posizione.replace(/'/g, "''")}'` : "NULL";

    const areaIdSQL = user.area
      ? `(SELECT id FROM "public"."area" WHERE name = '${user.area.replace(/'/g, "''")}')`
      : "NULL";

    const societaIdSQL = user.societa
      ? `(SELECT id FROM "public"."societa" WHERE name = '${user.societa.replace(/'/g, "''")}')`
      : "NULL";

    const altriRuoliSQL =
      user.altri_ruoli && user.altri_ruoli.length > 0
        ? `ARRAY[${user.altri_ruoli.map((r) => `'${r.replace(/'/g, "''")}'`).join(", ")}]`
        : "'{}'";

    sql += `-- ${user.nome}
--   Title: ${escapedTitle || "NULL"}
--   Posizione: ${escapedPosizione || "NULL"}
--   Area: ${user.area || "NULL"}
--   Societa: ${user.societa || "NULL"}
--   Altri Ruoli: ${
      user.altri_ruoli && user.altri_ruoli.length > 0 ? user.altri_ruoli.join(", ") : "NULL"
    }
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  '${escapedEmail}',
  '${escapedName}',
  ${referentIdSQL},
  'Employee',
  NOW(),
  NULL,
  ${escapedTitle},
  ${escapedPosizione},
  ${areaIdSQL},
  ${societaIdSQL},
  ${altriRuoliSQL}
)
ON CONFLICT (email) DO UPDATE SET
  "name" = EXCLUDED."name",
  "referent_id" = EXCLUDED."referent_id",
  "role" = EXCLUDED."role",
  "title" = EXCLUDED."title",
  "posizione" = EXCLUDED."posizione",
  "area_id" = EXCLUDED."area_id",
  "societa_id" = EXCLUDED."societa_id",
  "altri_ruoli" = EXCLUDED."altri_ruoli";

`;
  }

  sql += `COMMIT;

-- Total users: ${users.length}
-- Total areas: ${uniqueAreas.size}
-- Total societa: ${uniqueSocieta.size}
`;

  return sql;
};

const generateDataExtractionReport = (): string => {
  const users = extractUsers();

  const report: string[] = [];
  report.push("=".repeat(80));
  report.push("DATA EXTRACTION REPORT - Organizational Chart Users");
  report.push("=".repeat(80));
  report.push("");
  report.push(`Total users extracted: ${users.length}`);
  report.push("");
  report.push("EXTRACTABLE FIELDS:");
  report.push("");
  report.push("1. title (string | null)");
  report.push("   - Main role/title from 'ruolo' field");
  report.push("   - Examples: 'CEO', 'Chief Operating Officer', 'Head of Engineering',");
  report.push("     'Manager', 'Senior Manager', 'SE', 'SSE', 'JSE', 'FE', 'SFE',");
  report.push("     'DE', 'SQAE', 'ME', 'SME', 'Key Client', etc.");
  report.push("   - NULL for: Team members without explicit role");
  report.push("");
  report.push("2. posizione (string | null)");
  report.push("   - Position code/level");
  report.push("   - Examples: 'SE' (Software Engineer), 'SSE' (Senior Software Engineer),");
  report.push("     'JSE' (Junior Software Engineer), 'FE' (Frontend Engineer),");
  report.push("     'SFE' (Senior Frontend Engineer), 'JFE' (Junior Frontend Engineer),");
  report.push("     'DE' (Data Engineer), 'JDE' (Junior Data Engineer),");
  report.push("     'SQAE' (Software Quality Assurance Engineer),");
  report.push("     'ME' (Mobile Engineer), 'SME' (Senior Mobile Engineer),");
  report.push("     'Recruiter', 'Admin Specialist', etc.");
  report.push("   - NULL for: Managers, Heads, and roles without position code");
  report.push("");
  report.push("3. area (string | null)");
  report.push("   - Business area/unit name");
  report.push("   - Examples: 'Operations', 'Data Engineering',");
  report.push("     'Front-end, UI, UX e Mobile', 'Radicalbit Platform',");
  report.push("     'Amministrazione', 'Marketing', 'HR', 'Vendite ProActivity',");
  report.push("     'Engineering ProActivity', etc.");
  report.push("   - NULL for: CEO, top-level executives, and users not in specific areas");
  report.push("");
  report.push("4. societa (string | null)");
  report.push("   - Company name");
  report.push("   - Examples: 'ProActivity', 'Fortitude', 'Bitrock', 'Waterstream'");
  report.push("   - NULL for: Most users (only set for ProActivity-specific roles)");
  report.push("");
  report.push("5. altri_ruoli (string[] | null)");
  report.push("   - Additional roles array");
  report.push("   - Examples: ['Chief Sales Officer (ad interim)']");
  report.push("   - NULL for: Most users (only CEO has this field)");
  report.push("");
  report.push("STATISTICS:");
  report.push("");

  const withTitle = users.filter((u) => u.title !== null).length;
  const withPosizione = users.filter((u) => u.posizione !== null).length;
  const withArea = users.filter((u) => u.area !== null).length;
  const withSocieta = users.filter((u) => u.societa !== null).length;
  const withAltriRuoli = users.filter(
    (u) => u.altri_ruoli !== null && u.altri_ruoli.length > 0
  ).length;

  report.push(
    `  - Users with title: ${withTitle} (${((withTitle / users.length) * 100).toFixed(1)}%)`
  );
  report.push(
    `  - Users with posizione: ${withPosizione} (${((withPosizione / users.length) * 100).toFixed(
      1
    )}%)`
  );
  report.push(
    `  - Users with area: ${withArea} (${((withArea / users.length) * 100).toFixed(1)}%)`
  );
  report.push(
    `  - Users with societa: ${withSocieta} (${((withSocieta / users.length) * 100).toFixed(1)}%)`
  );
  report.push(
    `  - Users with altri_ruoli: ${withAltriRuoli} (${(
      (withAltriRuoli / users.length) * 100
    ).toFixed(1)}%)`
  );
  report.push("");

  const uniqueAreas = new Set(users.filter((u) => u.area !== null).map((u) => u.area));
  const uniquePosizioni = new Set(
    users.filter((u) => u.posizione !== null).map((u) => u.posizione)
  );
  const uniqueSocieta = new Set(users.filter((u) => u.societa !== null).map((u) => u.societa));

  report.push("UNIQUE VALUES:");
  report.push("");
  report.push(`  - Unique areas: ${uniqueAreas.size}`);
  report.push(
    `    ${Array.from(uniqueAreas).slice(0, 5).join(", ")}${uniqueAreas.size > 5 ? "..." : ""}`
  );
  report.push("");
  report.push(`  - Unique posizioni: ${uniquePosizioni.size}`);
  report.push(
    `    ${Array.from(uniquePosizioni).slice(0, 10).join(", ")}${
      uniquePosizioni.size > 10 ? "..." : ""
    }`
  );
  report.push("");
  report.push(`  - Unique societa: ${uniqueSocieta.size}`);
  report.push(`    ${Array.from(uniqueSocieta).join(", ") || "None"}`);
  report.push("");
  report.push("=".repeat(80));

  return report.join("\n");
};

const main = () => {
  console.log(generateDataExtractionReport());
  console.log("");

  const sql = generateSQL();
  const outputPath = join(
    process.cwd(),
    "supabase",
    "migrations",
    `insert-org-users-${Date.now()}.sql`
  );
  writeFileSync(outputPath, sql, "utf-8");
  console.log(`✅ SQL script generated: ${outputPath}`);
  console.log(`📊 Total users: ${extractUsers().length}`);
};

if (require.main === module) {
  main();
}

export { extractUsers, generateDataExtractionReport, generateSQL, normalizeEmail };
