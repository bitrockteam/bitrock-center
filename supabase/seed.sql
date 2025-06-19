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
	('95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-03 14:51:10.857563+00', 'Light Vehicle Fleet Management', 'Amman', '', '2025-06-03 00:00:00', NULL, 'PLANNED'),
	('9fb633b2-7892-4f84-b9fa-d15d58efe663', '2025-06-17 15:18:53.604966+00', 'New Booking System', 'Luxottica', '', '2025-05-26 00:00:00', NULL, 'ACTIVE');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("id", "created_at", "email", "name", "avatar_url", "referent_id", "role") VALUES
	('386a8f27-cf71-4ed0-b1d7-b78d547028a9', '2025-06-01 15:20:00.527163+00', 'yi.zhang@bitrock.it', 'Yi Zhang', NULL, NULL, 'Manager'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-06-01 15:18:48.439214+00', 'davide.ghiotto@bitrock.it', 'Davide Ghiotto', NULL, '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Key Client'),
	('29db1aab-78f4-4645-a581-bf61f1bd2f36', '2025-06-19 07:48:50.139+00', 'gianluca.larosa@bitrock.it', 'Gianluca La Rosa', NULL, NULL, 'Employee'),
	('e8874482-8365-4973-8c72-6c2d2933c7c9', '2025-06-19 07:51:48.042+00', 'daniel.zotti@bitrock.it', 'Daniel Zotti', NULL, '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Key Client'),
	('660e6bdb-000d-4ba9-b368-e26f6d879a49', '2025-06-19 08:18:40.873+00', 'test@test.com', 'test test', NULL, '59f579f0-8c04-4938-8ea3-e5dad19fc87a', 'Manager'),
	('59f579f0-8c04-4938-8ea3-e5dad19fc87a', '2025-06-19 07:49:17.141+00', 'miguel.deleon@bitrock.it', 'Miguel De Leon', NULL, NULL, 'Employee'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-06-03 14:51:55.25+00', 'niccolo.naso@bitrock.it', 'Niccolò Naso', NULL, NULL, 'Admin');


--
-- Data for Name: allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."allocation" ("created_at", "user_id", "project_id", "start_date", "end_date", "percentage") VALUES
	('2025-06-17 15:29:10.632+00', '108ddaad-82c5-4689-b36f-c20ae2bc6a36', '9fb633b2-7892-4f84-b9fa-d15d58efe663', '2025-05-31 22:00:00', NULL, 100),
	('2025-06-19 07:52:21.862+00', '108ddaad-82c5-4689-b36f-c20ae2bc6a36', '95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-18 22:00:00', NULL, 100),
	('2025-06-19 07:52:29.927+00', 'e8874482-8365-4973-8c72-6c2d2933c7c9', '95db656b-c8d6-4000-80bb-27f96c996281', '2025-06-19 07:52:29.834', NULL, 100);


--
-- Data for Name: permit; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: timesheet; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

RESET ALL;
