-- SQL Script to insert/update users from organizational chart
-- Generated automatically from organigramma data
-- Order: Top-down (CEO first, then direct reports, etc.)
--
-- This script:
-- 1. Inserts/updates areas in the area table
-- 2. Inserts/updates societa in the societa table
-- 3. Inserts/updates users with all organizational fields

BEGIN;

-- Insert/update areas
INSERT INTO "public"."area" ("name")
VALUES ('Amministrazione')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('Data Engineering')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('Engineering ProActivity')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('Front-end, UI, UX e Mobile')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('HR')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('Marketing')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('Operations')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "public"."area" ("name")
VALUES ('Vendite ProActivity')
ON CONFLICT (name) DO NOTHING;

-- Insert/update societa
INSERT INTO "public"."societa" ("name")
VALUES ('ProActivity')
ON CONFLICT (name) DO NOTHING;

-- Insert/update users
-- Leo Pillon
--   Title: 'CEO'
--   Posizione: NULL
--   Area: NULL
--   Societa: NULL
--   Altri Ruoli: Chief Sales Officer (ad interim)
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'leo.pillon@bitrock.it',
  'Leo Pillon',
  NULL,
  'Employee',
  NOW(),
  NULL,
  'CEO',
  NULL,
  NULL,
  NULL,
  ARRAY['Chief Sales Officer (ad interim)']
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

-- Marco Veronese
--   Title: 'Chief Operating Officer'
--   Posizione: NULL
--   Area: NULL
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.veronese@bitrock.it',
  'Marco Veronese',
  (SELECT id FROM "public"."user" WHERE email = 'leo.pillon@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Chief Operating Officer',
  NULL,
  NULL,
  NULL,
  '{}'
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

-- Franco Geraci
--   Title: 'Head of Engineering'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'franco.geraci@bitrock.it',
  'Franco Geraci',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Head of Engineering',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Simone Esposito
--   Title: 'Senior Manager'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'simone.esposito@bitrock.it',
  'Simone Esposito',
  (SELECT id FROM "public"."user" WHERE email = 'franco.geraci@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Senior Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Manuele Salvador
--   Title: 'Manager Software Quality Assurance'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'manuele.salvador@bitrock.it',
  'Manuele Salvador',
  (SELECT id FROM "public"."user" WHERE email = 'franco.geraci@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager Software Quality Assurance',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Ilaria Stasuzzo
--   Title: 'SQAE'
--   Posizione: 'SQAE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'ilaria.stasuzzo@bitrock.it',
  'Ilaria Stasuzzo',
  (SELECT id FROM "public"."user" WHERE email = 'manuele.salvador@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SQAE',
  'SQAE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Giorgio Vendrame
--   Title: 'SQAE'
--   Posizione: 'SQAE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'giorgio.vendrame@bitrock.it',
  'Giorgio Vendrame',
  (SELECT id FROM "public"."user" WHERE email = 'manuele.salvador@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SQAE',
  'SQAE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Daniele Bonelli
--   Title: 'Manager'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'daniele.bonelli@bitrock.it',
  'Daniele Bonelli',
  (SELECT id FROM "public"."user" WHERE email = 'franco.geraci@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Cristian Bertuccioli
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'cristian.bertuccioli@bitrock.it',
  'Cristian Bertuccioli',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Carmelo Calabrò
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'carmelo.calabro@bitrock.it',
  'Carmelo Calabrò',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Gianluca Cavalli
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'gianluca.cavalli@bitrock.it',
  'Gianluca Cavalli',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Anton Cucu
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'anton.cucu@bitrock.it',
  'Anton Cucu',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Bradley Gersh
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'bradley.gersh@bitrock.it',
  'Bradley Gersh',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Federico Gradizzi
--   Title: 'JSE'
--   Posizione: 'JSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'federico.gradizzi@bitrock.it',
  'Federico Gradizzi',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JSE',
  'JSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Mario Taccori
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'mario.taccori@bitrock.it',
  'Mario Taccori',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bonelli@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Matteo Gazzetta
--   Title: 'Manager'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'matteo.gazzetta@bitrock.it',
  'Matteo Gazzetta',
  (SELECT id FROM "public"."user" WHERE email = 'franco.geraci@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Claudio Vesco
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'claudio.vesco@bitrock.it',
  'Claudio Vesco',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Vincenzo Aprea
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'vincenzo.aprea@bitrock.it',
  'Vincenzo Aprea',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Matteo Livoli
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'matteo.livoli@bitrock.it',
  'Matteo Livoli',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Enrico Luongo
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'enrico.luongo@bitrock.it',
  'Enrico Luongo',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Marco Marice
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.marice@bitrock.it',
  'Marco Marice',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Davide Pavan
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'davide.pavan@bitrock.it',
  'Davide Pavan',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Marco Righi
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.righi@bitrock.it',
  'Marco Righi',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Federico Vidali
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'federico.vidali@bitrock.it',
  'Federico Vidali',
  (SELECT id FROM "public"."user" WHERE email = 'matteo.gazzetta@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Simone Ripamonti
--   Title: 'Manager'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'simone.ripamonti@bitrock.it',
  'Simone Ripamonti',
  (SELECT id FROM "public"."user" WHERE email = 'franco.geraci@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Matteo Anselmi
--   Title: 'DE'
--   Posizione: 'DE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'matteo.anselmi@bitrock.it',
  'Matteo Anselmi',
  (SELECT id FROM "public"."user" WHERE email = 'simone.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'DE',
  'DE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Marco Gatti
--   Title: 'DE'
--   Posizione: 'DE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.gatti@bitrock.it',
  'Marco Gatti',
  (SELECT id FROM "public"."user" WHERE email = 'simone.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'DE',
  'DE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Andrea Laspada
--   Title: 'DE'
--   Posizione: 'DE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'andrea.laspada@bitrock.it',
  'Andrea Laspada',
  (SELECT id FROM "public"."user" WHERE email = 'simone.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'DE',
  'DE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Lorenzo Rutigliano
--   Title: 'DE'
--   Posizione: 'DE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'lorenzo.rutigliano@bitrock.it',
  'Lorenzo Rutigliano',
  (SELECT id FROM "public"."user" WHERE email = 'simone.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'DE',
  'DE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Michael Tabolsky
--   Title: 'SDE'
--   Posizione: 'SDE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'michael.tabolsky@bitrock.it',
  'Michael Tabolsky',
  (SELECT id FROM "public"."user" WHERE email = 'simone.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SDE',
  'SDE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Luca Tronchin
--   Title: 'Manager'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'luca.tronchin@bitrock.it',
  'Luca Tronchin',
  (SELECT id FROM "public"."user" WHERE email = 'franco.geraci@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Cristian Bianco
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'cristian.bianco@bitrock.it',
  'Cristian Bianco',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Francesco Cadili
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'francesco.cadili@bitrock.it',
  'Francesco Cadili',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Fabio Castello
--   Title: 'JSE'
--   Posizione: 'JSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'fabio.castello@bitrock.it',
  'Fabio Castello',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JSE',
  'JSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Francesco Malerba
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'francesco.malerba@bitrock.it',
  'Francesco Malerba',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Giovanni Morlin
--   Title: 'SE'
--   Posizione: 'SE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'giovanni.morlin@bitrock.it',
  'Giovanni Morlin',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SE',
  'SE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Claudia Salmaso
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'claudia.salmaso@bitrock.it',
  'Claudia Salmaso',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Marco Tosini
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.tosini@bitrock.it',
  'Marco Tosini',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Danilo Ventura
--   Title: 'SSE'
--   Posizione: 'SSE'
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'danilo.ventura@bitrock.it',
  'Danilo Ventura',
  (SELECT id FROM "public"."user" WHERE email = 'luca.tronchin@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SSE',
  'SSE',
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Daniele Bergo
--   Title: 'Head of Key Client'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'daniele.bergo@bitrock.it',
  'Daniele Bergo',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Head of Key Client',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Moreno Brusauro
--   Title: 'Senior Key Client'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'moreno.brusauro@bitrock.it',
  'Moreno Brusauro',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bergo@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Senior Key Client',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Luca Savarese
--   Title: 'Key Client'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'luca.savarese@bitrock.it',
  'Luca Savarese',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bergo@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Key Client',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Michele Mazza
--   Title: 'Key Client'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'michele.mazza@bitrock.it',
  'Michele Mazza',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.bergo@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Key Client',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Alessandro Conflitti
--   Title: 'Head of AI'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'alessandro.conflitti@bitrock.it',
  'Alessandro Conflitti',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Head of AI',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Antonio Barbuzzi
--   Title: 'Head of Data Engineering'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'antonio.barbuzzi@bitrock.it',
  'Antonio Barbuzzi',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Head of Data Engineering',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Yi Zhang
--   Title: 'Senior Manager FE'
--   Posizione: NULL
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'yi.zhang@bitrock.it',
  'Yi Zhang',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Senior Manager FE',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Daniele Chiarello
--   Title: 'Manager FE'
--   Posizione: NULL
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'daniele.chiarello@bitrock.it',
  'Daniele Chiarello',
  (SELECT id FROM "public"."user" WHERE email = 'yi.zhang@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager FE',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Luca Boudidat
--   Title: 'FE'
--   Posizione: 'FE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'luca.boudidat@bitrock.it',
  'Luca Boudidat',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.chiarello@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'FE',
  'FE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Gastòn Diaz
--   Title: 'FE'
--   Posizione: 'FE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'gaston.diaz@bitrock.it',
  'Gastòn Diaz',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.chiarello@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'FE',
  'FE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Marika Fabiani
--   Title: 'JFE'
--   Posizione: 'JFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marika.fabiani@bitrock.it',
  'Marika Fabiani',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.chiarello@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JFE',
  'JFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Giuseppe Figliuolo
--   Title: 'JFE'
--   Posizione: 'JFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'giuseppe.figliuolo@bitrock.it',
  'Giuseppe Figliuolo',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.chiarello@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JFE',
  'JFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Elhosain Halili
--   Title: 'FE'
--   Posizione: 'FE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'elhosain.halili@bitrock.it',
  'Elhosain Halili',
  (SELECT id FROM "public"."user" WHERE email = 'daniele.chiarello@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'FE',
  'FE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Mattia Ripamonti
--   Title: 'Manager FE'
--   Posizione: NULL
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'mattia.ripamonti@bitrock.it',
  'Mattia Ripamonti',
  (SELECT id FROM "public"."user" WHERE email = 'yi.zhang@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager FE',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Marco Bartiromo
--   Title: 'FE'
--   Posizione: 'FE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.bartiromo@bitrock.it',
  'Marco Bartiromo',
  (SELECT id FROM "public"."user" WHERE email = 'mattia.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'FE',
  'FE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Davide Filippi
--   Title: 'FE'
--   Posizione: 'FE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'davide.filippi@bitrock.it',
  'Davide Filippi',
  (SELECT id FROM "public"."user" WHERE email = 'mattia.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'FE',
  'FE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Andrea Mazza
--   Title: 'SFE'
--   Posizione: 'SFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'andrea.mazza@bitrock.it',
  'Andrea Mazza',
  (SELECT id FROM "public"."user" WHERE email = 'mattia.ripamonti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SFE',
  'SFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Daniel Zotti
--   Title: 'Manager FE'
--   Posizione: NULL
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'daniel.zotti@bitrock.it',
  'Daniel Zotti',
  (SELECT id FROM "public"."user" WHERE email = 'yi.zhang@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager FE',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Massimiliano Attianese
--   Title: 'JFE'
--   Posizione: 'JFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'massimiliano.attianese@bitrock.it',
  'Massimiliano Attianese',
  (SELECT id FROM "public"."user" WHERE email = 'daniel.zotti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JFE',
  'JFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Gianluca La Rosa
--   Title: 'JFE'
--   Posizione: 'JFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'gianluca.larosa@bitrock.it',
  'Gianluca La Rosa',
  (SELECT id FROM "public"."user" WHERE email = 'daniel.zotti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JFE',
  'JFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Davide Ghiotto
--   Title: 'SFE'
--   Posizione: 'SFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'davide.ghiotto@bitrock.it',
  'Davide Ghiotto',
  (SELECT id FROM "public"."user" WHERE email = 'daniel.zotti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SFE',
  'SFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Niccolò Naso
--   Title: 'JFE'
--   Posizione: 'JFE'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'niccolo.naso@bitrock.it',
  'Niccolò Naso',
  (SELECT id FROM "public"."user" WHERE email = 'daniel.zotti@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JFE',
  'JFE',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Gabriella Moro
--   Title: 'Manager UI/UX'
--   Posizione: NULL
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'gabriella.moro@bitrock.it',
  'Gabriella Moro',
  (SELECT id FROM "public"."user" WHERE email = 'yi.zhang@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager UI/UX',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Federico Bianchi
--   Title: 'Junior'
--   Posizione: 'Junior'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'federico.bianchi@bitrock.it',
  'Federico Bianchi',
  (SELECT id FROM "public"."user" WHERE email = 'gabriella.moro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Junior',
  'Junior',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Marinella Mastrosimone
--   Title: 'Senior'
--   Posizione: 'Senior'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marinella.mastrosimone@bitrock.it',
  'Marinella Mastrosimone',
  (SELECT id FROM "public"."user" WHERE email = 'gabriella.moro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Senior',
  'Senior',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Claudia Miliziano
--   Title: 'Senior'
--   Posizione: 'Senior'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'claudia.miliziano@bitrock.it',
  'Claudia Miliziano',
  (SELECT id FROM "public"."user" WHERE email = 'gabriella.moro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Senior',
  'Senior',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Samantha Giro
--   Title: 'Manager Mobile'
--   Posizione: NULL
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'samantha.giro@bitrock.it',
  'Samantha Giro',
  (SELECT id FROM "public"."user" WHERE email = 'yi.zhang@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager Mobile',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Mattia Contin
--   Title: 'ME'
--   Posizione: 'ME'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'mattia.contin@bitrock.it',
  'Mattia Contin',
  (SELECT id FROM "public"."user" WHERE email = 'samantha.giro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'ME',
  'ME',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Davide Magli
--   Title: 'ME'
--   Posizione: 'ME'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'davide.magli@bitrock.it',
  'Davide Magli',
  (SELECT id FROM "public"."user" WHERE email = 'samantha.giro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'ME',
  'ME',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Emanuele Maso
--   Title: 'SME'
--   Posizione: 'SME'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'emanuele.maso@bitrock.it',
  'Emanuele Maso',
  (SELECT id FROM "public"."user" WHERE email = 'samantha.giro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SME',
  'SME',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Federico Nessi
--   Title: 'SME'
--   Posizione: 'SME'
--   Area: Front-end, UI, UX e Mobile
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'federico.nessi@bitrock.it',
  'Federico Nessi',
  (SELECT id FROM "public"."user" WHERE email = 'samantha.giro@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'SME',
  'SME',
  (SELECT id FROM "public"."area" WHERE name = 'Front-end, UI, UX e Mobile'),
  NULL,
  '{}'
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

-- Fabio Mauro
--   Title: 'Scrum Master'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'fabio.mauro@bitrock.it',
  'Fabio Mauro',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Scrum Master',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Mauro Cortellazzi
--   Title: 'Architect'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'mauro.cortellazzi@bitrock.it',
  'Mauro Cortellazzi',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Architect',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Mauro Mariniello
--   Title: 'Product Owner'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'mauro.mariniello@bitrock.it',
  'Mauro Mariniello',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Product Owner',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Marco Riva
--   Title: 'Manager BE'
--   Posizione: NULL
--   Area: Operations
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marco.riva@bitrock.it',
  'Marco Riva',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Manager BE',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Operations'),
  NULL,
  '{}'
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

-- Nicola Manca
--   Title: 'JDE'
--   Posizione: 'JDE'
--   Area: Data Engineering
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'nicola.manca@bitrock.it',
  'Nicola Manca',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JDE',
  'JDE',
  (SELECT id FROM "public"."area" WHERE name = 'Data Engineering'),
  NULL,
  '{}'
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

-- Carlo Pignatiello
--   Title: 'JDE'
--   Posizione: 'JDE'
--   Area: Data Engineering
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'carlo.pignatiello@bitrock.it',
  'Carlo Pignatiello',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JDE',
  'JDE',
  (SELECT id FROM "public"."area" WHERE name = 'Data Engineering'),
  NULL,
  '{}'
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

-- Claudiu Pintilie
--   Title: 'JDE'
--   Posizione: 'JDE'
--   Area: Data Engineering
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'claudiu.pintilie@bitrock.it',
  'Claudiu Pintilie',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'JDE',
  'JDE',
  (SELECT id FROM "public"."area" WHERE name = 'Data Engineering'),
  NULL,
  '{}'
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

-- Domenico Simone
--   Title: 'DE'
--   Posizione: 'DE'
--   Area: Data Engineering
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'domenico.simone@bitrock.it',
  'Domenico Simone',
  (SELECT id FROM "public"."user" WHERE email = 'marco.veronese@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'DE',
  'DE',
  (SELECT id FROM "public"."area" WHERE name = 'Data Engineering'),
  NULL,
  '{}'
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

-- Enrico Sala
--   Title: 'Chief Financial Officer'
--   Posizione: NULL
--   Area: NULL
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'enrico.sala@bitrock.it',
  'Enrico Sala',
  (SELECT id FROM "public"."user" WHERE email = 'leo.pillon@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Chief Financial Officer',
  NULL,
  NULL,
  NULL,
  '{}'
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

-- Debora Marighetto
--   Title: 'Head of Admin e Facility'
--   Posizione: NULL
--   Area: Amministrazione
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'debora.marighetto@bitrock.it',
  'Debora Marighetto',
  (SELECT id FROM "public"."user" WHERE email = 'enrico.sala@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Head of Admin e Facility',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Amministrazione'),
  NULL,
  '{}'
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

-- Marta Chiribiri
--   Title: 'Admin Specialist'
--   Posizione: NULL
--   Area: Amministrazione
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'marta.chiribiri@bitrock.it',
  'Marta Chiribiri',
  (SELECT id FROM "public"."user" WHERE email = 'debora.marighetto@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Admin Specialist',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Amministrazione'),
  NULL,
  '{}'
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

-- Anamaria Juric
--   Title: 'Admin Specialist'
--   Posizione: NULL
--   Area: Amministrazione
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'anamaria.juric@bitrock.it',
  'Anamaria Juric',
  (SELECT id FROM "public"."user" WHERE email = 'debora.marighetto@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Admin Specialist',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Amministrazione'),
  NULL,
  '{}'
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

-- Mirko Lazzarato
--   Title: 'Grant and Tender Account Senior Manager'
--   Posizione: NULL
--   Area: Amministrazione
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'mirko.lazzarato@bitrock.it',
  'Mirko Lazzarato',
  (SELECT id FROM "public"."user" WHERE email = 'enrico.sala@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Grant and Tender Account Senior Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Amministrazione'),
  NULL,
  '{}'
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

-- Matteo Bianchi
--   Title: 'System Administrator'
--   Posizione: NULL
--   Area: Amministrazione
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'matteo.bianchi@bitrock.it',
  'Matteo Bianchi',
  (SELECT id FROM "public"."user" WHERE email = 'enrico.sala@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'System Administrator',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Amministrazione'),
  NULL,
  '{}'
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

-- Leonardo Cullurà
--   Title: 'Direttore Generale ProActivity'
--   Posizione: NULL
--   Area: NULL
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'leonardo.cullura@bitrock.it',
  'Leonardo Cullurà',
  (SELECT id FROM "public"."user" WHERE email = 'leo.pillon@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Direttore Generale ProActivity',
  NULL,
  NULL,
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Alessandro Peretti
--   Title: 'Chief Sales Officer ProActivity'
--   Posizione: NULL
--   Area: Vendite ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'alessandro.peretti@bitrock.it',
  'Alessandro Peretti',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Chief Sales Officer ProActivity',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Vendite ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Alessio Bizzotto
--   Title: 'Software Engineer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'alessio.bizzotto@bitrock.it',
  'Alessio Bizzotto',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Software Engineer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Michael Bonini
--   Title: 'Software Engineer – Junior'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'michael.bonini@bitrock.it',
  'Michael Bonini',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Software Engineer – Junior',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Nicola Carlucci
--   Title: 'Software Engineer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'nicola.carlucci@bitrock.it',
  'Nicola Carlucci',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Software Engineer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Alessandro Conte
--   Title: 'Software Engineer - Senior'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'alessandro.conte@bitrock.it',
  'Alessandro Conte',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Software Engineer - Senior',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Davide Frola
--   Title: 'Software Engineer - Senior'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'davide.frola@bitrock.it',
  'Davide Frola',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Software Engineer - Senior',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Vincenzo Dell'Avvocato
--   Title: 'Front-end Engineer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'vincenzo.dellavvocato@bitrock.it',
  'Vincenzo Dell''Avvocato',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Front-end Engineer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Agnese Di Marzio
--   Title: 'Front-end Engineer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'agnese.dimarzio@bitrock.it',
  'Agnese Di Marzio',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Front-end Engineer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Stefano Frontini
--   Title: 'Front-end Engineer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'stefano.frontini@bitrock.it',
  'Stefano Frontini',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Front-end Engineer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Giuseppe Ciullo
--   Title: 'Front-end Engineer - Senior'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'giuseppe.ciullo@bitrock.it',
  'Giuseppe Ciullo',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Front-end Engineer - Senior',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Enrico Fantini
--   Title: 'Mobile Developer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'enrico.fantini@bitrock.it',
  'Enrico Fantini',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Mobile Developer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Luigi Mazzarella
--   Title: 'Mobile Developer'
--   Posizione: NULL
--   Area: Engineering ProActivity
--   Societa: ProActivity
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'luigi.mazzarella@bitrock.it',
  'Luigi Mazzarella',
  (SELECT id FROM "public"."user" WHERE email = 'leonardo.cullura@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Mobile Developer',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Engineering ProActivity'),
  (SELECT id FROM "public"."societa" WHERE name = 'ProActivity'),
  '{}'
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

-- Michele Ridi
--   Title: 'Chief Presales Officer'
--   Posizione: NULL
--   Area: NULL
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'michele.ridi@bitrock.it',
  'Michele Ridi',
  (SELECT id FROM "public"."user" WHERE email = 'leo.pillon@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Chief Presales Officer',
  NULL,
  NULL,
  NULL,
  '{}'
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

-- Raffaella Volpato
--   Title: 'Chief HR Officer & Organization'
--   Posizione: NULL
--   Area: NULL
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'raffaella.volpato@bitrock.it',
  'Raffaella Volpato',
  (SELECT id FROM "public"."user" WHERE email = 'leo.pillon@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Chief HR Officer & Organization',
  NULL,
  NULL,
  NULL,
  '{}'
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

-- Martina Casiraghi
--   Title: 'Mktg & Communication Senior Manager'
--   Posizione: NULL
--   Area: Marketing
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'martina.casiraghi@bitrock.it',
  'Martina Casiraghi',
  (SELECT id FROM "public"."user" WHERE email = 'raffaella.volpato@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Mktg & Communication Senior Manager',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Marketing'),
  NULL,
  '{}'
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

-- Valentina Della Valle
--   Title: 'Digital Marketing Specialist'
--   Posizione: NULL
--   Area: Marketing
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'valentina.dellavalle@bitrock.it',
  'Valentina Della Valle',
  (SELECT id FROM "public"."user" WHERE email = 'martina.casiraghi@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Digital Marketing Specialist',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Marketing'),
  NULL,
  '{}'
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

-- Chiara Schivo
--   Title: 'Marketing and Communication Specialist'
--   Posizione: NULL
--   Area: Marketing
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'chiara.schivo@bitrock.it',
  'Chiara Schivo',
  (SELECT id FROM "public"."user" WHERE email = 'martina.casiraghi@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Marketing and Communication Specialist',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'Marketing'),
  NULL,
  '{}'
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

-- Eleonora De Vecchi
--   Title: 'RSGSI - Consulente esterno (Gerico)'
--   Posizione: NULL
--   Area: HR
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'eleonora.devecchi@bitrock.it',
  'Eleonora De Vecchi',
  (SELECT id FROM "public"."user" WHERE email = 'raffaella.volpato@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'RSGSI - Consulente esterno (Gerico)',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'HR'),
  NULL,
  '{}'
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

-- Cristina Del Vecchio
--   Title: 'Head of HR'
--   Posizione: NULL
--   Area: HR
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'cristina.delvecchio@bitrock.it',
  'Cristina Del Vecchio',
  (SELECT id FROM "public"."user" WHERE email = 'raffaella.volpato@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Head of HR',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'HR'),
  NULL,
  '{}'
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

-- Melissa Gifuni
--   Title: 'Responsabile Selezione'
--   Posizione: NULL
--   Area: HR
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'melissa.gifuni@bitrock.it',
  'Melissa Gifuni',
  (SELECT id FROM "public"."user" WHERE email = 'cristina.delvecchio@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Responsabile Selezione',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'HR'),
  NULL,
  '{}'
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

-- Carlotta Emili
--   Title: 'Recruiter'
--   Posizione: NULL
--   Area: HR
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'carlotta.emili@bitrock.it',
  'Carlotta Emili',
  (SELECT id FROM "public"."user" WHERE email = 'melissa.gifuni@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Recruiter',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'HR'),
  NULL,
  '{}'
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

-- Valentina Paris
--   Title: 'Recruiter'
--   Posizione: NULL
--   Area: HR
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'valentina.paris@bitrock.it',
  'Valentina Paris',
  (SELECT id FROM "public"."user" WHERE email = 'melissa.gifuni@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Recruiter',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'HR'),
  NULL,
  '{}'
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

-- Giulia Migliore
--   Title: 'Specialista Formazione e Sviluppo'
--   Posizione: NULL
--   Area: HR
--   Societa: NULL
--   Altri Ruoli: NULL
INSERT INTO "public"."user" ("email", "name", "referent_id", "role", "created_at", "avatar_url", "title", "posizione", "area_id", "societa_id", "altri_ruoli")
VALUES (
  'giulia.migliore@bitrock.it',
  'Giulia Migliore',
  (SELECT id FROM "public"."user" WHERE email = 'cristina.delvecchio@bitrock.it'),
  'Employee',
  NOW(),
  NULL,
  'Specialista Formazione e Sviluppo',
  NULL,
  (SELECT id FROM "public"."area" WHERE name = 'HR'),
  NULL,
  '{}'
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

COMMIT;

-- Total users: 108
-- Total areas: 8
-- Total societa: 1
