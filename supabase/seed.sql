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
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."project" ("id", "created_at", "name", "client", "description", "start_date", "end_date", "status") VALUES
	('9fb633b2-7892-4f84-b9fa-d15d58efe663', '2025-06-17 15:18:53.604966+00', 'New Booking System', 'Luxottica', '', '2025-05-26 00:00:00', NULL, 'ACTIVE'),
	('95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-03 14:51:10.857563+00', 'Light Vehicle Fleet Management', 'Amman', '', '2001-06-02 22:00:00', NULL, 'COMPLETED');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("id", "created_at", "email", "name", "avatar_url", "referent_id", "role") VALUES
	('29db1aab-78f4-4645-a581-bf61f1bd2f36', '2025-06-19 07:48:50.139+00', 'gianluca.larosa@bitrock.it', 'Gianluca La Rosa', NULL, NULL, 'Employee'),
	('e8874482-8365-4973-8c72-6c2d2933c7c9', '2025-06-19 07:51:48.042+00', 'daniel.zotti@bitrock.it', 'Daniel Zotti', NULL, '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Key Client'),
	('660e6bdb-000d-4ba9-b368-e26f6d879a49', '2025-06-19 08:18:40.873+00', 'test@test.com', 'test test', NULL, '59f579f0-8c04-4938-8ea3-e5dad19fc87a', 'Manager'),
	('59f579f0-8c04-4938-8ea3-e5dad19fc87a', '2025-06-19 07:49:17.141+00', 'miguel.deleon@bitrock.it', 'Miguel De Leon', NULL, NULL, 'Employee'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-06-01 15:18:48.439214+00', 'davide.ghiotto@bitrock.it', 'Davide Ghiotto', 'https://ca.slack-edge.com/TBUKN04GN-U04RURP3SL8-6c85b7bb5bca-512', '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Super Admin'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-06-03 14:51:55.25+00', 'niccolo.naso@bitrock.it', 'Niccolò Naso', NULL, 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'Admin'),
	('386a8f27-cf71-4ed0-b1d7-b78d547028a9', '2025-06-01 15:20:00.527163+00', 'yi.zhang@bitrock.it', 'Yi Zhang', NULL, NULL, 'Key Client');


--
-- Data for Name: allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."allocation" ("created_at", "user_id", "project_id", "start_date", "end_date", "percentage") VALUES
	('2025-06-17 15:29:10.632+00', '108ddaad-82c5-4689-b36f-c20ae2bc6a36', '9fb633b2-7892-4f84-b9fa-d15d58efe663', '2025-05-31 22:00:00', NULL, 100),
	('2025-06-19 07:52:21.862+00', '108ddaad-82c5-4689-b36f-c20ae2bc6a36', '95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-18 22:00:00', NULL, 100),
	('2025-06-19 07:52:29.927+00', 'e8874482-8365-4973-8c72-6c2d2933c7c9', '95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-19 07:52:29.834', NULL, 100),
	('2025-06-24 10:57:47.663+00', '660e6bdb-000d-4ba9-b368-e26f6d879a49', '95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-10 22:00:00', '2025-06-26 22:00:00', 100),
	('2025-06-26 13:29:40.996+00', '386a8f27-cf71-4ed0-b1d7-b78d547028a9', '9fb633b2-7892-4f84-b9fa-d15d58efe663', '2025-06-26 13:29:40.92', NULL, 100),
	('2025-06-26 13:33:16.017+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '9fb633b2-7892-4f84-b9fa-d15d58efe663', '2025-06-26 13:33:15.955', NULL, 100);


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
-- Data for Name: permit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."permit" ("created_at", "user_id", "duration", "id", "description", "type", "date", "status", "reviewer_id") VALUES
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '29f028bc-cce9-4d7f-ac12-fe042e72f71b', 'testozzo', 'VACATION', '2025-06-16', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '03f3153f-e81b-4a69-88b5-9391713f685e', 'testozzo', 'VACATION', '2025-06-17', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
	('2025-06-26 13:33:35.504+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '78853736-7e56-496f-a0e4-c62996b34199', 'testozzo', 'VACATION', '2025-06-18', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9'),
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
	('2025-06-26 13:40:24.711+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 8, '0ef3a94f-b838-47b4-9d0e-d61c5dd6207f', 'imbroglino', 'VACATION', '2025-06-18', 'PENDING', '386a8f27-cf71-4ed0-b1d7-b78d547028a9');


--
-- Data for Name: timesheet; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."timesheet" ("created_at", "date", "project_id", "user_id", "description", "id", "hours") VALUES
	('2025-06-27 15:57:24.958+00', '2025-06-27', '95db656b-c8d6-4000-80bb-27f96c996281', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', NULL, '117c7677-3fef-4715-9aef-da887a8dbe96', 8),
	('2025-06-27 15:57:33.408+00', '2025-06-27', '9fb633b2-7892-4f84-b9fa-d15d58efe663', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', NULL, 'b0b8f2c4-b967-47f8-aa25-2bb7d60f6de4', 8);


--
-- Data for Name: todo_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."todo_item" ("id", "goal_id", "text", "completed") VALUES
	('f7c5f038-3ef0-48dc-9bf9-6e929c0b9bd0', '762fbbac-74ab-4ec0-85c7-3e098365754d', 'seconda', true),
	('8545e964-692d-41b9-b831-e400d3c03a0d', '762fbbac-74ab-4ec0-85c7-3e098365754d', 'prima attività', false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
