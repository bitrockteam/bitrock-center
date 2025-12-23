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
	('ad58d92d-e08a-4572-9a8c-35c76ba93c32', 'Luxottica', 'LUX', 'test@test.com', '34525', 'Via Piazzale Cadorna, 3, Milan, Lombardia', 'LUX1231243', 'Francesco Milleri', 'active', '2025-12-11 16:31:17.589+00', ''),
	('7b68d3fe-6e84-44ff-b021-20603ac15096', 'BIP Group', 'BIP', 'info@bipgroup.it', '123412312', 'Via del BIP', 'IT1234501230', 'Gaetano Nicassio', 'active', '2025-12-23 11:29:07.013+00', 'test ciao'),
	('5ee5011a-6ce8-49fe-bcd0-db6632c44133', 'Arpinine', 'ARP', 'info@arpinine.com', '12309123021', 'Via dei Torturatori, 118', 'IT12031299', 'Alberto Zannol', 'active', '2025-12-23 11:35:42.819+00', ''),
	('53e59703-2f27-48c2-8972-f00883a4f08e', 'Università di Trieste', 'UNITS', 'info@units.it', '1231231231', 'Via Trieste, 123', 'IT1234567890', 'Michele Bava', 'active', '2025-12-23 11:48:28.548+00', 'Aiutoooo il deploy nooooo');


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."project" ("id", "created_at", "name", "description", "start_date", "end_date", "status", "client_id") VALUES
	('9c6728b9-ee6b-4c9e-94de-891214fc8958', '2025-12-11 16:31:39.991+00', 'NBS', NULL, '2025-12-03 00:00:00', '2025-12-19 00:00:00', 'ACTIVE', 'ad58d92d-e08a-4572-9a8c-35c76ba93c32'),
	('55a17c49-49a6-41e1-8d77-2c9fea8b0512', '2025-12-23 11:36:57.919+00', 'LVFM', 'Light Vehicle Fleet Management', '2025-05-01 00:00:00', NULL, 'ACTIVE', '5ee5011a-6ce8-49fe-bcd0-db6632c44133'),
	('19e76c1b-ad1d-4d36-9cd1-a775758a6458', '2025-12-23 11:49:35.108+00', 'Joint Platform', 'Gestione corsi, gestione candidature e iscrizione studenti università', '2024-11-15 00:00:00', NULL, 'PAUSED', '53e59703-2f27-48c2-8972-f00883a4f08e'),
	('1c3a07b9-5e22-4b8b-b11d-5d8691269499', '2025-12-23 11:51:54.729+00', 'PAGO PA - SMCR', 'Service Management Control Room  per PagoPA', '2025-10-01 00:00:00', NULL, 'ACTIVE', '7b68d3fe-6e84-44ff-b021-20603ac15096');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("id", "created_at", "email", "name", "avatar_url", "referent_id", "role", "custom_days_off_left", "custom_days_off_planned") VALUES
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 16:29:55.281572+00', 'niccolo.naso@bitrock.it', 'Niccolò Naso', NULL, '73c05880-512d-4406-bcd2-1d646f332d3f', 'Admin', 32, 24),
	('5fcaf4d4-328a-4dee-b31f-a399b7da34f9', '2025-12-16 11:08:02.878777+00', 'samantha.giro@bitrock.it', 'Samantha Giro', 'https://lh3.googleusercontent.com/a/ACg8ocJCR_pz4oBIoqZqMmS5jmYY-yd-jrXX2ivV0cSN5CMvczFQoQ=s96-c', NULL, 'Employee', NULL, NULL),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:08:10.695954+00', 'yi.zhang@bitrock.it', 'Yi Zhang', 'https://lh3.googleusercontent.com/a/ACg8ocJB3e6QA7fxt-4eJeihkdkmizE1Ij57Xc-HC80j2FoQ5QLERg=s96-c', NULL, 'Employee', NULL, NULL),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 17:17:50.752876+00', 'davide.ghiotto@bitrock.it', 'Davide Ghiotto', 'https://lh3.googleusercontent.com/a/ACg8ocKGxncilqQ9_PNUC1fcdKF3bMwvMdeBO8riefwuh395S4lcVm3K=s96-c', '73c05880-512d-4406-bcd2-1d646f332d3f', 'Admin', 28, 8);


--
-- Data for Name: work_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."work_items" ("id", "title", "client_id", "project_id", "type", "start_date", "end_date", "status", "description", "hourly_rate", "fixed_price", "created_at") VALUES
	('69c19d70-e9aa-4935-b655-8fa205a809e0', 'Fase 2 bis', '5ee5011a-6ce8-49fe-bcd0-db6632c44133', '55a17c49-49a6-41e1-8d77-2c9fea8b0512', 'fixed-price', '2026-01-11', '2026-03-31', 'active', '"mini CR" fase 2', NULL, 40000, '2025-12-23 11:38:53.148+00'),
	('25d54c15-2d0c-4a11-be21-15b85a3bd16c', 'Luxottica Eyecare', 'ad58d92d-e08a-4572-9a8c-35c76ba93c32', '9c6728b9-ee6b-4c9e-94de-891214fc8958', 'time-material', '2025-12-04', '2025-12-31', 'active', 'DIF + NBS Frontend', 300, NULL, '2025-12-11 17:29:55.654747+00'),
	('3c788bad-d1ae-4f4c-af85-b58bd1288fa9', 'Supporto Units', '53e59703-2f27-48c2-8972-f00883a4f08e', '19e76c1b-ad1d-4d36-9cd1-a775758a6458', 'time-material', '2025-12-23', NULL, 'active', 'Supporto attività di manutenzione e bug fix', 100, NULL, '2025-12-23 11:50:39.252+00'),
	('c83d2f7c-8576-4a82-813d-484cc0cd3838', 'BIP - Attività T&M', '7b68d3fe-6e84-44ff-b021-20603ac15096', NULL, 'time-material', '2025-09-30', NULL, 'active', 'Sviluppo (frontend) piattaforma SMCR', 250, NULL, '2025-12-23 11:55:10.75+00');


--
-- Data for Name: allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."allocation" ("created_at", "user_id", "start_date", "end_date", "percentage", "work_item_id") VALUES
	('2025-12-23 11:38:53.258+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-23 11:38:53.256', NULL, 10, '69c19d70-e9aa-4935-b655-8fa205a809e0'),
	('2025-12-23 11:46:59.994+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-23 11:46:59.993', NULL, 100, '25d54c15-2d0c-4a11-be21-15b85a3bd16c'),
	('2025-12-23 11:50:39.282+00', '73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-23 11:50:39.282', NULL, 10, '3c788bad-d1ae-4f4c-af85-b58bd1288fa9'),
	('2025-12-23 11:55:10.785+00', '73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-23 11:55:10.785', NULL, 100, 'c83d2f7c-8576-4a82-813d-484cc0cd3838');


--
-- Data for Name: chat_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chat_session" ("id", "user_id", "title", "last_message", "last_updated") VALUES
	('752e80b9-650c-487d-b0fb-52673f86db36', 'fc74eb61-9e89-48fb-8577-d87173304d15', 'New Chat', 'Attualmente non ci sono competenze disponibili nel sistema. Se hai bisogno di ulteriori informazioni...', '2025-12-12 08:49:30.117+00'),
	('5e8f8e45-58c8-4b88-aebe-a606d8e1657c', '73c05880-512d-4406-bcd2-1d646f332d3f', 'New Chat', 'Davide Ghiotto non risulta allocato su nessun progetto al momento. Se hai bisogno di ulteriori infor...', '2025-12-12 10:04:12.366+00'),
	('bde9aea2-1830-4853-ada4-317377d0961f', 'fc74eb61-9e89-48fb-8577-d87173304d15', 'New Chat', 'Sei Davide Ghiotto, un dipendente. La tua email è davide.ghiotto@bitrock.it. Hai un avatar associato...', '2025-12-12 16:11:04.47+00');


--
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: development_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: goal; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."message" ("id", "chat_session_id", "type", "content", "timestamp", "is_json", "json_data", "confirmed") VALUES
	('cd43ce19-100f-4a9f-899c-e93e11d040b8', '752e80b9-650c-487d-b0fb-52673f86db36', 'user', 'chi sono?', '2025-12-12 08:42:30.03095+00', false, NULL, NULL),
	('f81a2838-2b96-4cb0-81c2-eb7f48b3acf3', '752e80b9-650c-487d-b0fb-52673f86db36', 'bot', 'Sei Davide Ghiotto, un dipendente. Il tuo indirizzo email è davide.ghiotto@bitrock.it. Attualmente, non hai un''immagine del profilo disponibile. 

Se hai bisogno di ulteriori informazioni o assistenza, fammelo sapere!', '2025-12-12 08:42:37.838387+00', false, NULL, NULL),
	('d4291264-4a6e-497c-a499-81a929d2080c', '752e80b9-650c-487d-b0fb-52673f86db36', 'user', 'quante richieste di permessi ho?', '2025-12-12 08:45:25.735687+00', false, NULL, NULL),
	('caf28d49-e471-4d9a-9e53-ece9b2e4352a', '752e80b9-650c-487d-b0fb-52673f86db36', 'bot', 'Hai attualmente 0 richieste di permessi registrate. Se hai bisogno di ulteriori informazioni o assistenza, fammelo sapere!', '2025-12-12 08:45:31.280506+00', false, NULL, NULL),
	('8e2a3125-9e51-4eaa-9c33-57ac6481d3c2', '752e80b9-650c-487d-b0fb-52673f86db36', 'user', 'quali sono le skills disponibili^', '2025-12-12 08:49:24.863964+00', false, NULL, NULL),
	('464924d4-dc86-4cdf-94d4-bb61de0e4b3e', '752e80b9-650c-487d-b0fb-52673f86db36', 'bot', 'Attualmente non ci sono competenze disponibili nel sistema. Se hai bisogno di ulteriori informazioni o assistenza, fammelo sapere!', '2025-12-12 08:49:30.062274+00', false, NULL, NULL),
	('2f57afa1-d227-4226-b1fc-69f982e2d740', '5e8f8e45-58c8-4b88-aebe-a606d8e1657c', 'user', 'chi sono?', '2025-12-12 10:03:28.316982+00', false, NULL, NULL),
	('8778cd95-7988-4a00-b58a-5b0516539f63', '5e8f8e45-58c8-4b88-aebe-a606d8e1657c', 'bot', 'Tu sei Niccolò Naso, un Admin nel sistema. La tua email è niccolo.naso@bitrock.it. Hai un totale di 32 giorni di ferie rimasti e nessun giorno di ferie pianificato.', '2025-12-12 10:03:36.346084+00', false, NULL, NULL),
	('c72d1220-9fb2-4a15-b796-a5de35b0f80c', '5e8f8e45-58c8-4b88-aebe-a606d8e1657c', 'user', 'Su che progetto sono allocato e in che percentuali?', '2025-12-12 10:03:52.262217+00', false, NULL, NULL),
	('7d800ea3-1fc7-4658-a5d4-8157fffef8d1', '5e8f8e45-58c8-4b88-aebe-a606d8e1657c', 'bot', 'Attualmente, non risulti allocato su nessun progetto. Se hai bisogno di ulteriori informazioni o di assistenza, fammi sapere!', '2025-12-12 10:03:58.408292+00', false, NULL, NULL),
	('84adc8f3-3a2f-41c9-b6b8-741f7023217f', '5e8f8e45-58c8-4b88-aebe-a606d8e1657c', 'user', 'Davide Ghiotto su che progetti è allocato?', '2025-12-12 10:04:06.62288+00', false, NULL, NULL),
	('00c5d575-5d9f-4c76-b699-334468731cb2', '5e8f8e45-58c8-4b88-aebe-a606d8e1657c', 'bot', 'Davide Ghiotto non risulta allocato su nessun progetto al momento. Se hai bisogno di ulteriori informazioni o assistenza, fammi sapere!', '2025-12-12 10:04:12.311638+00', false, NULL, NULL),
	('9fbf78f2-807c-4c7b-8564-0097193ca514', 'bde9aea2-1830-4853-ada4-317377d0961f', 'user', 'chi sono?', '2025-12-12 16:10:56.954754+00', false, NULL, NULL),
	('52b368ac-4eed-4b5d-b67c-79914cd5ba57', 'bde9aea2-1830-4853-ada4-317377d0961f', 'user', 'chi sono?', '2025-12-12 16:10:57.588278+00', false, NULL, NULL),
	('3d3489db-e594-4682-b003-5682a11ab4c3', 'bde9aea2-1830-4853-ada4-317377d0961f', 'bot', 'Sei Davide Ghiotto, un dipendente. La tua email è davide.ghiotto@bitrock.it. Hai un avatar associato al tuo profilo. Attualmente, non hai giorni di ferie personalizzati pianificati o rimasti.', '2025-12-12 16:11:04.398228+00', false, NULL, NULL);


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: permit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."permit" ("created_at", "user_id", "duration", "id", "description", "type", "date", "status", "reviewer_id") VALUES
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, '053e2a0a-dd4f-4feb-baeb-3ba71fa2f782', 'christmax', 'VACATION', '2025-12-25', 'PENDING', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, '8c2ab37d-7d74-406e-bd10-32df254243fe', 'christmax', 'VACATION', '2025-12-26', 'PENDING', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, '7355483e-e137-4c03-95c4-460eb3522f89', 'christmax', 'VACATION', '2025-12-27', 'PENDING', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, '42297bdd-0b6d-4beb-a4b6-d4d562d376cf', 'christmax', 'VACATION', '2025-12-28', 'PENDING', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, 'cc57599c-8591-4900-8923-cb0ea101004e', 'christmax', 'VACATION', '2025-12-29', 'PENDING', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-15 15:47:57.859+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 4, '088e3756-06f5-4a7f-bf25-ee1e12d00a37', 'Vado in palestra', 'PERMISSION', '2025-12-15', 'PENDING', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, '23742e51-9638-4cc5-a212-0cb8583f52e6', 'christmax', 'VACATION', '2025-12-31', 'REJECTED', '73c05880-512d-4406-bcd2-1d646f332d3f'),
	('2025-12-11 21:31:47.142+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', 8, '67c939b9-ab46-44fd-b818-1980e84567ec', 'christmax', 'VACATION', '2025-12-30', 'APPROVED', '73c05880-512d-4406-bcd2-1d646f332d3f');


--
-- Data for Name: projection; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projection" ("id", "name", "description", "created_at", "created_by", "is_active") VALUES
	('01d799db-8c97-4be0-95f6-9c2a3aab651c', 'Q1 2026 Amman', NULL, '2025-12-17 13:25:15.707+00', 'fc74eb61-9e89-48fb-8577-d87173304d15', true);


--
-- Data for Name: projection_allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."skill" ("id", "name", "category", "description", "icon", "active", "created_at", "updated_at", "color") VALUES
	('bf5e5cb2-acd1-48d2-8917-db534fd3861b', 'Typescript', 'hard', NULL, 'Code', true, '2025-12-11 20:41:00.806+00', '2025-12-11 20:41:00.806+00', NULL),
	('e3de3a0d-8336-4dec-8282-344df6bcadbe', 'React', 'hard', NULL, 'Code', true, '2025-12-11 20:41:12.566+00', '2025-12-11 20:41:12.566+00', NULL),
	('a2bae742-1c6b-40d6-a4bf-87656b8aa8d6', 'Spoken English', 'soft', NULL, 'MessageCircle', true, '2025-12-23 13:23:53.973+00', '2025-12-23 13:23:53.973+00', NULL),
	('6f396b3c-9733-4bba-bacd-39f1cb2c6564', 'Functional Analysis', 'soft', NULL, 'Code', true, '2025-12-23 13:23:20.478+00', '2025-12-23 14:03:08.765198+00', 'oklch(0.6 0.2 0)'),
	('2046cdf7-831d-4b92-8b88-56489dd0fb82', 'Nextjs', 'hard', NULL, 'Code', true, '2025-12-23 14:05:35.452+00', '2025-12-23 14:05:35.452+00', 'oklch(0.65 0.15 190)'),
	('5ea915f3-7ad4-4d68-9669-ba3d7766ce44', 'Vuejs', 'hard', NULL, 'Code', true, '2025-12-23 14:34:15.708+00', '2025-12-23 14:34:15.708+00', 'oklch(0.65 0.2 160)');


--
-- Data for Name: timesheet; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."timesheet" ("created_at", "date", "user_id", "description", "id", "hours", "work_item_id") VALUES
	('2025-12-11 20:45:13.238+00', '2025-12-11', 'fc74eb61-9e89-48fb-8577-d87173304d15', NULL, '56a20886-056e-40b9-a255-baecec454cd3', 8, '25d54c15-2d0c-4a11-be21-15b85a3bd16c'),
	('2025-12-11 20:45:30.502+00', '2025-12-19', 'fc74eb61-9e89-48fb-8577-d87173304d15', 'test 2', 'e71813ba-141d-4936-9c6d-4ebadb75adb5', 8, '25d54c15-2d0c-4a11-be21-15b85a3bd16c'),
	('2025-12-11 20:45:43.801+00', '2025-12-17', 'fc74eb61-9e89-48fb-8577-d87173304d15', 'il 17 mhhh', '73a91832-6e05-4b85-a109-e6908907d2b3', 8, '25d54c15-2d0c-4a11-be21-15b85a3bd16c');


--
-- Data for Name: todo_item; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_permission" ("user_id", "created_at", "permission_id") VALUES
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:19:32.644246+00', 'CAN_SEE_CLIENT'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:20:57.754489+00', 'CAN_SEE_PERMISSIONS'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:08.45378+00', 'CAN_DEAL_PERMISSIONS'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:25.75+00', 'CAN_CREATE_CLIENT'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:30.497+00', 'CAN_EDIT_CLIENT'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:34.112+00', 'CAN_CREATE_WORK_ITEM'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:40.5+00', 'CAN_EDIT_WORK_ITEM'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:45.607+00', 'CAN_EDIT_WORKING_DAY'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:21:58.343+00', 'CAN_SEE_WORK_ITEM'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:04.004+00', 'CAN_APPROVE_PERMIT'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:09.109+00', 'CAN_CREATE_PROJECT'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:13.314+00', 'CAN_EDIT_PROJECT'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:19.287+00', 'CAN_SEE_OTHERS_TIMESHEET'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:24.002+00', 'CAN_CREATE_USER'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:27.429+00', 'CAN_ALLOCATE_RESOURCE'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', '2025-12-11 17:22:31.576+00', 'CAN_EDIT_USER'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 17:23:24.526+00', 'CAN_DEAL_PERMISSIONS'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 17:23:28.445+00', 'CAN_SEE_PERMISSIONS'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.235+00', 'CAN_CREATE_CLIENT'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.25+00', 'CAN_CREATE_PROJECT'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.245+00', 'CAN_EDIT_WORK_ITEM'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.281+00', 'CAN_ALLOCATE_RESOURCE'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.261+00', 'CAN_EDIT_PROJECT'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.249+00', 'CAN_APPROVE_PERMIT'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.263+00', 'CAN_SEE_OTHERS_TIMESHEET'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.241+00', 'CAN_EDIT_CLIENT'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.243+00', 'CAN_CREATE_WORK_ITEM'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.246+00', 'CAN_EDIT_WORKING_DAY'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.283+00', 'CAN_CREATE_USER'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.284+00', 'CAN_EDIT_USER'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.286+00', 'CAN_SEE_CLIENT'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2025-12-11 20:37:22.287+00', 'CAN_SEE_WORK_ITEM'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.125+00', 'CAN_EDIT_WORKING_DAY'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.121+00', 'CAN_EDIT_CLIENT'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.14+00', 'CAN_SEE_OTHERS_TIMESHEET'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.135+00', 'CAN_APPROVE_PERMIT'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.141+00', 'CAN_ALLOCATE_RESOURCE'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.118+00', 'CAN_CREATE_CLIENT'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.124+00', 'CAN_EDIT_WORK_ITEM'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.138+00', 'CAN_EDIT_PROJECT'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.137+00', 'CAN_CREATE_PROJECT'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.122+00', 'CAN_CREATE_WORK_ITEM'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.142+00', 'CAN_CREATE_USER'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.145+00', 'CAN_EDIT_USER'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.146+00', 'CAN_SEE_CLIENT'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.156+00', 'CAN_SEE_WORK_ITEM'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.158+00', 'CAN_DEAL_PERMISSIONS'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '2025-12-16 11:12:13.157+00', 'CAN_SEE_PERMISSIONS');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_skill" ("user_id", "skill_id", "seniorityLevel") VALUES
	('73c05880-512d-4406-bcd2-1d646f332d3f', 'e3de3a0d-8336-4dec-8282-344df6bcadbe', 'middle'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', 'a2bae742-1c6b-40d6-a4bf-87656b8aa8d6', 'junior'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', 'bf5e5cb2-acd1-48d2-8917-db534fd3861b', 'senior'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', 'a2bae742-1c6b-40d6-a4bf-87656b8aa8d6', 'senior'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', 'e3de3a0d-8336-4dec-8282-344df6bcadbe', 'middle'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', 'e3de3a0d-8336-4dec-8282-344df6bcadbe', 'senior'),
	('e7616e55-477b-4d5a-aeff-a72039f5674f', '6f396b3c-9733-4bba-bacd-39f1cb2c6564', 'senior'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '2046cdf7-831d-4b92-8b88-56489dd0fb82', 'middle'),
	('fc74eb61-9e89-48fb-8577-d87173304d15', '6f396b3c-9733-4bba-bacd-39f1cb2c6564', 'senior'),
	('5fcaf4d4-328a-4dee-b31f-a399b7da34f9', '6f396b3c-9733-4bba-bacd-39f1cb2c6564', 'junior'),
	('73c05880-512d-4406-bcd2-1d646f332d3f', 'bf5e5cb2-acd1-48d2-8917-db534fd3861b', 'middle');


--
-- PostgreSQL database dump complete
--

RESET ALL;
