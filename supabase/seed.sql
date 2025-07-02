SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."client" ("id", "name", "code", "email", "phone", "address", "vat_number", "contact_person", "status", "created_at", "notes") VALUES
	('767baaa4-5ce7-4792-b1e2-fc354f495f2f', 'Luxottica', 'LUX', 'info@luxottica.com', '12312312312', 'Via Piazzale Cadorna, 3, Milan, Lombardia', 'LUX1231243', 'Francesco Milleri', 'active', '2025-06-30 20:23:39.472+00', '');


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."project" ("id", "created_at", "name", "description", "start_date", "end_date", "status", "client_id") VALUES
	('b536e876-9f5e-4f24-9901-98169b72313d', '2025-07-01 16:15:52.249+00', 'New Booking System', NULL, '2025-07-01 00:00:00', NULL, 'ACTIVE', '767baaa4-5ce7-4792-b1e2-fc354f495f2f');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("id", "created_at", "email", "name", "avatar_url", "referent_id", "role") VALUES
	('29db1aab-78f4-4645-a581-bf61f1bd2f36', '2025-06-19 07:48:50.139+00', 'gianluca.larosa@bitrock.it', 'Gianluca La Rosa', NULL, NULL, 'Employee'),
	('e8874482-8365-4973-8c72-6c2d2933c7c9', '2025-06-19 07:51:48.042+00', 'daniel.zotti@bitrock.it', 'Daniel Zotti', NULL, '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Key Client'),
	('660e6bdb-000d-4ba9-b368-e26f6d879a49', '2025-06-19 08:18:40.873+00', 'test@test.com', 'test test', NULL, '59f579f0-8c04-4938-8ea3-e5dad19fc87a', 'Manager'),
	('59f579f0-8c04-4938-8ea3-e5dad19fc87a', '2025-06-19 07:49:17.141+00', 'miguel.deleon@bitrock.it', 'Miguel De Leon', NULL, NULL, 'Employee'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-06-03 14:51:55.25+00', 'niccolo.naso@bitrock.it', 'Niccolò Naso', NULL, 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'Admin'),
	('386a8f27-cf71-4ed0-b1d7-b78d547028a9', '2025-06-01 15:20:00.527163+00', 'yi.zhang@bitrock.it', 'Yi Zhang', NULL, NULL, 'Key Client'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-06-01 15:18:48.439214+00', 'davide.ghiotto@bitrock.it', 'Davide Ghiotto', 'https://ca.slack-edge.com/TBUKN04GN-U04RURP3SL8-6c85b7bb5bca-512', '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Admin');


--
-- Data for Name: allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."allocation" ("created_at", "user_id", "project_id", "start_date", "end_date", "percentage") VALUES
	('2025-07-01 18:47:17.359+00', '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'b536e876-9f5e-4f24-9901-98169b72313d', '2025-07-01 18:47:17.193', NULL, 100),
	('2025-07-01 18:47:45.536+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'b536e876-9f5e-4f24-9901-98169b72313d', '2025-07-01 18:47:45.447', NULL, 100);


--
-- Data for Name: chat_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chat_session" ("id", "user_id", "title", "last_message", "last_updated") VALUES
	('5b78d24c-9de1-464a-90c6-f524215f1784', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', NULL, '2025-07-01 18:52:11.233+00'),
	('4309e098-fe62-45d8-987e-f84681f1570e', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', NULL, '2025-07-02 06:19:58.742+00');


--
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: development_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."development_plan" ("id", "user_id", "created_date") VALUES
	('6c1a4217-b3b5-48b9-a540-95fa9fb30306', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-06-28');


--
-- Data for Name: goal; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."goal" ("id", "development_plan_id", "title", "description") VALUES
	('762fbbac-74ab-4ec0-85c7-3e098365754d', '6c1a4217-b3b5-48b9-a540-95fa9fb30306', 'First Goal', 'vediamo se aggiorna la descrizione'),
	('679d2e9b-08f0-43f2-baf8-b3e29c31ad2f', '6c1a4217-b3b5-48b9-a540-95fa9fb30306', 'Manager Growth', 'Manage at least 2 people in Luxottica projects');


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."message" ("id", "chat_session_id", "type", "content", "timestamp", "is_json", "json_data", "confirmed") VALUES
	('f85bc928-78dd-419e-acfc-21523fc2fd41', '5b78d24c-9de1-464a-90c6-f524215f1784', 'user', 'per quando sono programmate le mie prossime ferie?', '2025-07-01 18:52:34.951+00', false, NULL, false),
	('b387db47-8dfb-404e-bf89-bd13f70f3441', '5b78d24c-9de1-464a-90c6-f524215f1784', 'bot', 'Le date registrate sono il 2025-07-24, 2025-07-25, 2025-07-26 e 2025-07-27. 📅', '2025-07-01 18:52:34.951+00', false, '[{"date": "2025-07-24"}, {"date": "2025-07-25"}, {"date": "2025-07-26"}, {"date": "2025-07-27"}]', false),
	('d00964d9-f4a0-4196-8b16-c0202ed2c2ae', '5b78d24c-9de1-464a-90c6-f524215f1784', 'user', 'ritornami solo il primo giorno', '2025-07-02 06:19:46.406+00', false, NULL, false),
	('e4015cca-a649-488c-a199-374f649a9c36', '5b78d24c-9de1-464a-90c6-f524215f1784', 'bot', 'Il 31 maggio 2025 📅', '2025-07-02 06:19:46.406+00', false, '[{"date": "2025-05-31"}]', false),
	('98a45566-ad30-497d-8c17-403d7553b138', '4309e098-fe62-45d8-987e-f84681f1570e', 'user', 'chi sono io?', '2025-07-02 06:20:08.32+00', false, NULL, false),
	('e6ff7a34-d52e-45d4-bc8c-856ee6168ff8', '4309e098-fe62-45d8-987e-f84681f1570e', 'bot', 'Ecco a te, Davide Ghiotto! 😊', '2025-07-02 06:20:08.32+00', false, '[{"name": "Davide Ghiotto"}]', false),
	('6cb2b273-6308-471b-b9ab-9c989d49b48c', '4309e098-fe62-45d8-987e-f84681f1570e', 'user', 'trovami tutte le skill dell''utente appena trovato', '2025-07-02 06:20:24.52+00', false, NULL, false),
	('8a594469-c7a9-4910-a762-4785ef4aab4e', '4309e098-fe62-45d8-987e-f84681f1570e', 'bot', 'Ecco le competenze indicate: Gestione Clienti e Typescript 😊', '2025-07-02 06:20:24.52+00', false, '[{"name": "Client Management"}, {"name": "Typescript"}]', false),
	('3c123759-f0e1-4bae-9946-9ebfb51dd817', '4309e098-fe62-45d8-987e-f84681f1570e', 'user', 'delle due competenze appena trovate, fai una lista di skill + tipologia (hard/soft)', '2025-07-02 06:20:56.858+00', false, NULL, false),
	('f821ab85-3abe-40b4-aafe-8c9c4f13e726', '4309e098-fe62-45d8-987e-f84681f1570e', 'bot', 'Le competenze includono  "Client Management" (categoria soft) e "Typescript" (categoria hard). 😊', '2025-07-02 06:20:56.858+00', false, '[{"name": "Client Management", "category": "soft"}, {"name": "Typescript", "category": "hard"}]', false);


--
-- Data for Name: permit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."permit" ("created_at", "user_id", "duration", "id", "description", "type", "date", "status", "reviewer_id") VALUES
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '9c519e50-64ed-4250-b64b-6d9c1ed76ed2', 'testozzo', 'VACATION', '2025-06-19', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'f5ddf501-3104-4020-80ab-dd12df846ce9', 'testozzo', 'VACATION', '2025-06-20', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '6269d97e-a086-41fe-93f4-81b5f4f78009', 'testozzo', 'VACATION', '2025-06-21', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '366f1f44-d311-48c3-94a3-a46a06e41707', 'testozzo', 'VACATION', '2025-06-22', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'ed539059-c6da-4a93-83d6-a74377b52871', 'testozzo', 'VACATION', '2025-06-23', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'd516c9fe-6dab-4e15-834b-b40b8822205f', 'testozzo', 'VACATION', '2025-06-24', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:34:58.285+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '7567b97f-a32d-4e85-8b87-1ca9d62afc6c', 'sto maleh', 'SICKNESS', '2025-06-27', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:34:58.285+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '7e822df4-6341-41ab-928b-16b7e09f6977', 'sto maleh', 'SICKNESS', '2025-06-28', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:34:58.285+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'f573b380-ad8a-440a-a1fb-1e5b1f0ecf7c', 'sto maleh', 'SICKNESS', '2025-06-29', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:36:33.338+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'ac0dcc20-c968-4e29-8aa3-16324c03131c', 'vediamo', 'VACATION', '2025-05-31', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:36:33.338+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '9304653c-4587-42b3-af8b-5ff55c3a7f26', 'vediamo', 'VACATION', '2025-06-01', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:36:33.338+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '8af5a010-1647-4fcb-b5e4-b9a4cd9235de', 'vediamo', 'VACATION', '2025-06-02', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:36:33.338+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'a1ce0042-9618-4437-be5c-2ce24c9095be', 'vediamo', 'VACATION', '2025-06-03', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:37:38.755+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '98685bd8-38da-4a6d-b72b-7e3290205aaa', '', 'SICKNESS', '2025-06-10', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:37:38.755+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '2ad601d8-7da9-4172-a758-272af924f695', '', 'SICKNESS', '2025-06-11', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:37:38.755+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '38d4cc93-6035-4f6a-ae9c-de289e50d4d9', '', 'SICKNESS', '2025-06-12', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:37:38.755+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, 'dfd0babe-7d00-4ba3-abb6-92b2a1bd9f2e', '', 'SICKNESS', '2025-06-13', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:40:24.711+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '4e225a60-59ed-468e-99f0-0a2ef2ede6f9', 'imbroglino', 'VACATION', '2025-06-15', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:40:24.711+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '00834703-5f9c-4e4f-b9f2-974bb1322253', 'imbroglino', 'VACATION', '2025-06-16', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:40:24.711+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '0e90b07e-8195-41da-834e-09c30d8b5e21', 'imbroglino', 'VACATION', '2025-06-17', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:40:24.711+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '0ef3a94f-b838-47b4-9d0e-d61c5dd6207f', 'imbroglino', 'VACATION', '2025-06-18', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '29f028bc-cce9-4d7f-ac12-fe042e72f71b', 'testozzo', 'VACATION', '2025-06-16', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '03f3153f-e81b-4a69-88b5-9391713f685e', 'testozzo', 'VACATION', '2025-06-17', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '78853736-7e56-496f-a0e4-c62996b34199', 'testozzo', 'VACATION', '2025-06-18', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-07-01 18:48:07.563+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '2a4f313e-0889-4448-9708-62c3e0d426b1', 'Vacanza in centro Italia', 'VACATION', '2025-07-24', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-07-01 18:48:07.563+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '438ab037-5fa9-4400-9c17-13308eaf30e8', 'Vacanza in centro Italia', 'VACATION', '2025-07-26', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-07-01 18:48:07.563+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '88a93343-4db9-426f-96a1-0636a1c6b8a1', 'Vacanza in centro Italia', 'VACATION', '2025-07-25', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-07-01 18:48:07.563+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '9fcb37a8-ce08-431e-be56-6a09d0a0cced', 'Vacanza in centro Italia', 'VACATION', '2025-07-27', 'APPROVED', '386a8f27-cf71-4ed0-b1d7-b78d547028a9');


--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."skill" ("id", "name", "category", "description", "icon", "active", "created_at", "updated_at") VALUES
	('b163d22a-5d08-4234-ae23-b1741ae90e8f', 'Typescript', 'hard', 'Type definition for javascript - updated', 'Code', true, '2025-06-28 23:57:11.763+00', '2025-06-29 00:00:06.816151+00'),
	('beae37fa-da4d-4a09-b80c-187c79af7051', 'Client Management', 'soft', '', 'Users', true, '2025-06-29 00:01:27.157+00', '2025-06-29 00:01:27.157+00'),
	('ebf6a21a-ac5c-47fd-8a71-04e05a7af916', 'Screen Sharing', 'soft', '', 'Monitor', true, '2025-06-30 11:24:34.411+00', '2025-06-30 11:24:34.411+00');


--
-- Data for Name: timesheet; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: todo_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."todo_item" ("id", "goal_id", "text", "completed") VALUES
	('f7c5f038-3ef0-48dc-9bf9-6e929c0b9bd0', '762fbbac-74ab-4ec0-85c7-3e098365754d', 'seconda', true),
	('8545e964-692d-41b9-b831-e400d3c03a0d', '762fbbac-74ab-4ec0-85c7-3e098365754d', 'prima attività', true);


--
-- Data for Name: user_skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_skill" ("user_id", "skill_id", "seniorityLevel") VALUES
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'beae37fa-da4d-4a09-b80c-187c79af7051', 'junior'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'b163d22a-5d08-4234-ae23-b1741ae90e8f', 'middle');


--
-- Data for Name: work_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."work_items" ("id", "title", "client_id", "project_id", "type", "start_date", "end_date", "status", "description", "hourly_rate", "estimated_hours", "fixed_price", "created_at") VALUES
	('192692d5-2087-4d85-8e8e-04bceb4c5205', 'Disruptive UX/UI', '767baaa4-5ce7-4792-b1e2-fc354f495f2f', 'b536e876-9f5e-4f24-9901-98169b72313d', 'time-material', '2025-07-01', NULL, 'active', '', 65, 800, NULL, '2025-07-01 16:18:02.139+00');


--
-- Data for Name: work_item_enabled_users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

RESET ALL;
