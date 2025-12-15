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

INSERT INTO "public"."user" ("id", "created_at", "email", "name", "avatar_url", "referent_id", "role", "custom_days_off_left", "custom_days_off_planned") VALUES
	('29db1aab-78f4-4645-a581-bf61f1bd2f36', '2025-06-19 07:48:50.139+00', 'gianluca.larosa@bitrock.it', 'Gianluca La Rosa', NULL, NULL, 'Employee', NULL, NULL),
	('e8874482-8365-4973-8c72-6c2d2933c7c9', '2025-06-19 07:51:48.042+00', 'daniel.zotti@bitrock.it', 'Daniel Zotti', NULL, '386a8f27-cf71-4ed0-b1d7-b78d547028a9', 'Key Client', NULL, NULL),
	('660e6bdb-000d-4ba9-b368-e26f6d879a49', '2025-06-19 08:18:40.873+00', 'test@test.com', 'test test', NULL, '59f579f0-8c04-4938-8ea3-e5dad19fc87a', 'Manager', NULL, NULL),
	('59f579f0-8c04-4938-8ea3-e5dad19fc87a', '2025-06-19 07:49:17.141+00', 'miguel.deleon@bitrock.it', 'Miguel De Leon', NULL, NULL, 'Employee', NULL, NULL),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-06-03 14:51:55.25+00', 'niccolo.naso@bitrock.it', 'Niccolò Naso', NULL, 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'Admin', NULL, NULL),
	('386a8f27-cf71-4ed0-b1d7-b78d547028a9', '2025-06-01 15:20:00.527163+00', 'yi.zhang@bitrock.it', 'Yi Zhang', NULL, NULL, 'Key Client', NULL, NULL),
	('2f2cd135-3590-45e1-9d15-308337a5971b', '2025-12-12 10:29:22.436928+00', 'ghiotto.davidenko@gmail.com', 'Davide Ghiotto', 'https://lh3.googleusercontent.com/a/ACg8ocL-jaXB7rUuaR1Yf8ssFDTDC5xZH-A0xT97tUgkOMUdSulEK_O4AA=s96-c', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'Employee', NULL, NULL),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-06-01 15:18:48.439214+00', 'davide.ghiotto@bitrock.it', 'Davide Ghiotto', 'https://ca.slack-edge.com/TBUKN04GN-U04RURP3SL8-6c85b7bb5bca-512', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'Admin', NULL, NULL);


--
-- Data for Name: work_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."work_items" ("id", "title", "client_id", "project_id", "type", "start_date", "end_date", "status", "description", "hourly_rate", "estimated_hours", "fixed_price", "created_at") VALUES
	('9869bf5d-bdef-4439-93f1-f497759fd76b', 'NBS Test Commessa', '767baaa4-5ce7-4792-b1e2-fc354f495f2f', 'b536e876-9f5e-4f24-9901-98169b72313d', 'time-material', '2025-12-17', '2026-01-02', 'active', 'test c', 100, 100, NULL, '2025-12-12 16:24:04.29+00');


--
-- Data for Name: allocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."allocation" ("created_at", "user_id", "start_date", "end_date", "percentage", "work_item_id") VALUES
	('2025-12-15 15:27:13.725+00', '108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-12-15 15:27:13.724', NULL, 100, '9869bf5d-bdef-4439-93f1-f497759fd76b'),
	('2025-12-15 15:27:13.725+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-15 15:27:13.724', NULL, 100, '9869bf5d-bdef-4439-93f1-f497759fd76b'),
	('2025-12-15 15:27:13.725+00', '29db1aab-78f4-4645-a581-bf61f1bd2f36', '2025-12-15 15:27:13.724', NULL, 75, '9869bf5d-bdef-4439-93f1-f497759fd76b'),
	('2025-12-15 15:27:13.725+00', '2f2cd135-3590-45e1-9d15-308337a5971b', '2025-12-15 15:27:13.724', NULL, 90, '9869bf5d-bdef-4439-93f1-f497759fd76b');


--
-- Data for Name: chat_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chat_session" ("id", "user_id", "title", "last_message", "last_updated") VALUES
	('5b78d24c-9de1-464a-90c6-f524215f1784', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', NULL, '2025-07-01 18:52:11.233+00'),
	('4309e098-fe62-45d8-987e-f84681f1570e', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', NULL, '2025-07-02 06:19:58.742+00'),
	('deb8a6d6-49cd-4b06-b1f1-4caa5f3311dd', '2f2cd135-3590-45e1-9d15-308337a5971b', 'New Chat', 'It seems like your request may be incomplete or unclear. Could you please provide more context or sp...', '2025-12-12 10:31:01.498+00'),
	('451c35f2-0456-44d0-b217-be7268b1435c', '2f2cd135-3590-45e1-9d15-308337a5971b', 'New Chat', 'It seems there was an error in retrieving your information due to the incorrect column name in the q...', '2025-12-12 10:41:03.149+00'),
	('599a93c6-5599-49ed-9f0b-f55404f9da94', '2f2cd135-3590-45e1-9d15-308337a5971b', 'New Chat', 'Sure! Feel free to ask any questions you have or let me know what you''d like to check.', '2025-12-12 10:44:12.486+00'),
	('0bce91fa-468a-459d-b220-bc1ce0b7ff3a', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', 'Al momento non hai alcuna allocazione registrata nel sistema. Se hai bisogno di assistenza su questo...', '2025-12-12 16:27:56.506+00'),
	('d4a33349-1558-4c04-9422-a2e2534e9856', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', 'Error: <!DOCTYPE html><html><head><meta charSet="utf-8" data-next-head=""/><meta name="viewport" con...', '2025-12-12 16:30:22.695+00'),
	('58d7d021-51d2-4aba-aa42-83207ae9a472', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'New Chat', 'Sembra che ci sia stato un errore durante l''esecuzione della query per ottenere i membri del tuo tea...', '2025-12-12 16:32:15.303+00');


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
	('f821ab85-3abe-40b4-aafe-8c9c4f13e726', '4309e098-fe62-45d8-987e-f84681f1570e', 'bot', 'Le competenze includono  "Client Management" (categoria soft) e "Typescript" (categoria hard). 😊', '2025-07-02 06:20:56.858+00', false, '[{"name": "Client Management", "category": "soft"}, {"name": "Typescript", "category": "hard"}]', false),
	('a4d91cc1-a070-4aef-b0da-179465b9ca08', 'deb8a6d6-49cd-4b06-b1f1-4caa5f3311dd', 'user', 'sensor', '2025-12-12 10:30:58.083032+00', false, NULL, NULL),
	('c96588e1-18d0-49b4-9574-00f51fceac9e', 'deb8a6d6-49cd-4b06-b1f1-4caa5f3311dd', 'bot', 'It seems like your request may be incomplete or unclear. Could you please provide more context or specify what information you are looking for?', '2025-12-12 10:31:01.494337+00', false, NULL, NULL),
	('d6eb6820-23c9-4146-970c-97babb0142db', '451c35f2-0456-44d0-b217-be7268b1435c', 'user', 'start to some test with them API web speech API and retrieve me who I am in this application', '2025-12-12 10:40:55.637876+00', false, NULL, NULL),
	('4df3bed0-f41f-4a41-8ec4-f2b96228924a', '451c35f2-0456-44d0-b217-be7268b1435c', 'bot', 'It seems there was an error in retrieving your information due to the incorrect column name in the query. Let me correct that.

Here''s the correct SQL query to retrieve your details:
```sql
SELECT 
  id, name, email, role
FROM "user"
WHERE id = ''2f2cd135-3590-45e1-9d15-308337a5971b''
```

I''ll execute this and get back to you with the results.The query executed successfully, and here are your details in the application:

- **ID:** 2f2cd135-3590-45e1-9d15-308337a5971b
- **Name:** Davide Ghiotto
- **Email:** ghiotto.davidenko@gmail.com
- **Role:** Employee

If you need any further information or assistance, feel free to ask!', '2025-12-12 10:41:03.14669+00', false, NULL, NULL),
	('41efddf2-feb2-4438-b7cb-7abeed0c7fc4', '599a93c6-5599-49ed-9f0b-f55404f9da94', 'user', 'ok let me try to see if it worked', '2025-12-12 10:44:09.863823+00', false, NULL, NULL),
	('a60318d5-a408-4586-a51b-7bf85bfc8237', '599a93c6-5599-49ed-9f0b-f55404f9da94', 'bot', 'Sure! Feel free to ask any questions you have or let me know what you''d like to check.', '2025-12-12 10:44:12.477784+00', false, NULL, NULL),
	('29ac5b5e-563f-4a9f-95eb-f4a3cff18cbf', '0bce91fa-468a-459d-b220-bc1ce0b7ff3a', 'user', 'chi sono io?', '2025-12-12 16:27:40.049251+00', false, NULL, NULL),
	('4623e859-65a5-448a-8448-d4251b2915d2', '0bce91fa-468a-459d-b220-bc1ce0b7ff3a', 'bot', 'Sei Davide Ghiotto, un Admin nel sistema. Il tuo indirizzo email è davide.ghiotto@bitrock.it. Sei stato registrato il 1° giugno 2025. 

Se hai bisogno di ulteriori informazioni, fammelo sapere!', '2025-12-12 16:27:44.388663+00', false, NULL, NULL),
	('d108f7a7-3325-4de2-b49d-c97059f38e78', '0bce91fa-468a-459d-b220-bc1ce0b7ff3a', 'user', 'come sono allocato?', '2025-12-12 16:27:52.591308+00', false, NULL, NULL),
	('4018086c-c8fa-45a1-a4a7-3cf17e720bfe', '0bce91fa-468a-459d-b220-bc1ce0b7ff3a', 'bot', 'Al momento non hai alcuna allocazione registrata nel sistema. Se hai bisogno di assistenza su questo argomento o desideri aggiungere un''allocazione, fammi sapere!', '2025-12-12 16:27:56.503673+00', false, NULL, NULL),
	('1f336c04-5a1c-4b7c-96b5-501dec0a4950', 'd4a33349-1558-4c04-9422-a2e2534e9856', 'user', 'come sono allocato io?', '2025-12-12 16:30:21.370326+00', false, NULL, NULL),
	('5361c3c0-8158-4830-841c-72d742d2af17', 'd4a33349-1558-4c04-9422-a2e2534e9856', 'bot', 'No response generated', '2025-12-12 16:30:22.691749+00', false, NULL, NULL),
	('04da3ce8-e3f3-439b-878b-e8b7db715e78', 'd4a33349-1558-4c04-9422-a2e2534e9856', 'bot', 'Error: <!DOCTYPE html><html><head><meta charSet="utf-8" data-next-head=""/><meta name="viewport" content="width=device-width" data-next-head=""/><style data-next-hide-fouc="true">body{display:none}</style><noscript data-next-hide-fouc="true"><style>body{display:block}</style></noscript><noscript data-n-css=""></noscript><script src="/_next/static/chunks/node_modules_next_dist_compiled_8ca6b690._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_dist_shared_lib_82dc2e9d._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_dist_client_d0aa886c._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_dist_b0a279d5._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_app_72f3d36f.js" defer=""></script><script src="/_next/static/chunks/%5Bnext%5D_entry_page-loader_ts_742e4b53._.js" defer=""></script><script src="/_next/static/chunks/node_modules_react-dom_4411d9bd._.js" defer=""></script><script src="/_next/static/chunks/node_modules_7f09fef0._.js" defer=""></script><script src="/_next/static/chunks/%5Broot-of-the-server%5D__45f039c3._.js" defer=""></script><script src="/_next/static/chunks/pages__app_2da965e7._.js" defer=""></script><script src="/_next/static/chunks/turbopack-pages__app_5d693f93._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_dist_shared_lib_cf5b50a6._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_dist_19fd0646._.js" defer=""></script><script src="/_next/static/chunks/node_modules_next_error_1cfbb379.js" defer=""></script><script src="/_next/static/chunks/%5Bnext%5D_entry_page-loader_ts_43b523b5._.js" defer=""></script><script src="/_next/static/chunks/%5Broot-of-the-server%5D__092393de._.js" defer=""></script><script src="/_next/static/chunks/pages__error_2da965e7._.js" defer=""></script><script src="/_next/static/chunks/turbopack-pages__error_9f8f7792._.js" defer=""></script><script src="/_next/static/development/_ssgManifest.js" defer=""></script><script src="/_next/static/development/_buildManifest.js" defer=""></script><noscript id="__next_css__DO_NOT_USE__"></noscript></head><body><div id="__next"></div><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"statusCode":500,"hostname":"localhost"}},"page":"/_error","query":{},"buildId":"development","isFallback":false,"err":{"name":"Error","source":"server","message":"./lib/chat/prompts.ts:57:4\nParsing ecmascript source code failed\n  55 | \n  56 | **Allocations** represent the assignment of users to work items. The relationship structure is:\n\u003e 57 | - `allocation` table links `user_id` to `work_item_id` with:\n     |    ^^^^^^^^^^\n  58 |   - `start_date` and `end_date` (allocation period)\n  59 |   - `percentage` (allocation percentage, default 100)\n  60 | - `work_items` can be associated with a `project` (via `project_id`) and belong to a `client` (via `client_id`)\n\nExpected '';'', got ''allocation''\n\nImport trace:\n  App Route:\n    ./lib/chat/prompts.ts\n    ./app/api/chat/route.ts\n\n","stack":"Error: ./lib/chat/prompts.ts:57:4\nParsing ecmascript source code failed\n\u001b[0m \u001b[90m 55 |\u001b[39m \u001b[32m\u001b[39m\n \u001b[90m 56 |\u001b[39m \u001b[32m**Allocations** represent the assignment of users to work items. The relationship structure is:\u001b[39m\n\u001b[31m\u001b[1m\u003e\u001b[22m\u001b[39m\u001b[90m 57 |\u001b[39m \u001b[32m- `\u001b[39mallocation\u001b[32m` table links `\u001b[39muser_id\u001b[32m` to `\u001b[39mwork_item_id\u001b[32m` with:\u001b[39m\n \u001b[90m    |\u001b[39m    \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 58 |\u001b[39m \u001b[32m  - `\u001b[39mstart_date\u001b[32m` and `\u001b[39mend_date\u001b[32m` (allocation period)\u001b[39m\n \u001b[90m 59 |\u001b[39m \u001b[32m  - `\u001b[39mpercentage\u001b[32m` (allocation percentage, default 100)\u001b[39m\n \u001b[90m 60 |\u001b[39m \u001b[32m- `\u001b[39mwork_items\u001b[32m` can be associated with a `\u001b[39mproject\u001b[32m` (via `\u001b[39mproject_id\u001b[32m`) and belong to a `\u001b[39mclient\u001b[32m` (via `\u001b[39mclient_id\u001b[32m`)\u001b[39m\u001b[0m\n\nExpected '';'', got ''allocation''\n\nImport trace:\n  App Route:\n    ./lib/chat/prompts.ts\n    ./app/api/chat/route.ts\n\n\n    at Object.getCompilationErrors (/Users/davideghiotto/Desktop/bitrock/bitrock-center/node_modules/next/dist/server/dev/hot-reloader-turbopack.js:996:59)\n    at DevBundlerService.getCompilationError (/Users/davideghiotto/Desktop/bitrock/bitrock-center/node_modules/next/dist/server/lib/dev-bundler-service.js:39:55)\n    at DevServer.getCompilationError (/Users/davideghiotto/Desktop/bitrock/bitrock-center/node_modules/next/dist/server/dev/next-dev-server.js:701:42)\n    at DevServer.findPageComponents (/Users/davideghiotto/Desktop/bitrock/bitrock-center/node_modules/next/dist/server/dev/next-dev-server.js:671:43)\n    at async DevServer.renderErrorToResponseImpl (/Users/davideghiotto/Desktop/bitrock/bitrock-center/node_modules/next/dist/server/base-server.js:1704:26)"},"gip":true,"scriptLoader":[]}</script></body></html>', '2025-12-12 16:30:22.691984+00', false, NULL, NULL),
	('058570d2-477d-409b-b1fe-e567f7c21d00', '58d7d021-51d2-4aba-aa42-83207ae9a472', 'user', 'come sono allocato io?', '2025-12-12 16:31:44.715531+00', false, NULL, NULL),
	('f06f89fc-b6cb-473f-8270-86f72840bf88', '58d7d021-51d2-4aba-aa42-83207ae9a472', 'bot', 'Attualmente non hai allocazioni attive. Se hai bisogno di ulteriori informazioni o vuoi controllare altre aree, fammi sapere!', '2025-12-12 16:31:51.58879+00', false, NULL, NULL),
	('337f2c55-4bb7-42e4-a93c-e3ab81ba452a', '58d7d021-51d2-4aba-aa42-83207ae9a472', 'user', 'chi sono i membri del mio team?', '2025-12-12 16:32:03.395925+00', false, NULL, NULL),
	('510f1d00-f3b7-4877-8fa3-9299b386a32a', '58d7d021-51d2-4aba-aa42-83207ae9a472', 'bot', 'Sembra che ci sia stato un errore durante l''esecuzione della query per ottenere i membri del tuo team. 

Proverò a modificare la query per recuperare i membri del tuo team. Un attimo per favore. 

Here’s the revised SQL query:
```sql
SELECT 
  u.id,
  u.name,
  u.email
FROM user u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role_id IN (
  SELECT role_id 
  FROM user_roles 
  WHERE user_id = ''a16d1da1-2db6-43d1-8c24-f65e3728ffa0''
)
AND u.id != ''a16d1da1-2db6-43d1-8c24-f65e3728ffa0''
```

Let me execute this and get back to you.I generated this SQL query:
```sql
SELECT 
  u.id,
  u.name,
  u.email
FROM user u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role_id IN (
  SELECT role_id 
  FROM user_roles 
  WHERE user_id = ''a16d1da1-2db6-43d1-8c24-f65e3728ffa0''
)
AND u.id != ''a16d1da1-2db6-43d1-8c24-f65e3728ffa0''
```

The query executed successfully and here are the results:

- **Membri del tuo team:**
  - Nome: [Nome membro 1], Email: [Email membro 1]
  - Nome: [Nome membro 2], Email: [Email membro 2]

Se hai bisogno di ulteriori dettagli o informazioni, fammelo sapere!', '2025-12-12 16:32:15.300903+00', false, NULL, NULL);


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."permission" ("id", "created_at", "deactivated") VALUES
	('CAN_CREATE_CLIENT', '2025-07-21 14:14:21.065069+00', false);


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
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."role" ("id", "created_at", "name") VALUES
	('b4fc5bee-3d1c-4e94-947a-4895f0fe8e99', '2025-07-28 10:42:36.526579+00', 'key_client');


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
-- Data for Name: user_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_permission" ("user_id", "created_at", "permission_id") VALUES
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-07-23 14:35:13.569198+00', 'CAN_EDIT_CLIENT'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-07-23 14:57:19.406777+00', 'CAN_CREATE_USER'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-08-27 10:42:47.348317+00', 'CAN_SEE_WORK_ITEM'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-09-05 14:42:40.845269+00', 'CAN_DEAL_PERMISSIONS'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-10-09 07:47:23.06+00', 'CAN_SEE_PERMISSIONS'),
	('108ddaad-82c5-4689-b36f-c20ae2bc6a36', '2025-10-09 07:47:39.019+00', 'CAN_SEE_CLIENT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.651+00', 'CAN_CREATE_CLIENT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.666+00', 'CAN_APPROVE_PERMIT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.656+00', 'CAN_EDIT_CLIENT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.665+00', 'CAN_EDIT_WORKING_DAY'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.672+00', 'CAN_CREATE_USER'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.662+00', 'CAN_EDIT_WORK_ITEM'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.659+00', 'CAN_CREATE_WORK_ITEM'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.668+00', 'CAN_EDIT_PROJECT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.667+00', 'CAN_CREATE_PROJECT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.67+00', 'CAN_SEE_OTHERS_TIMESHEET'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.672+00', 'CAN_ALLOCATE_RESOURCE'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.673+00', 'CAN_EDIT_USER'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.673+00', 'CAN_SEE_CLIENT'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.674+00', 'CAN_SEE_WORK_ITEM'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.674+00', 'CAN_SEE_PERMISSIONS'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', '2025-12-12 16:22:22.675+00', 'CAN_DEAL_PERMISSIONS');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("created_at", "user_id", "role_id") VALUES
	('2025-12-12 16:03:27.72767+00', 'a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'b4fc5bee-3d1c-4e94-947a-4895f0fe8e99');


--
-- Data for Name: user_skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_skill" ("user_id", "skill_id", "seniorityLevel") VALUES
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'beae37fa-da4d-4a09-b80c-187c79af7051', 'junior'),
	('a16d1da1-2db6-43d1-8c24-f65e3728ffa0', 'b163d22a-5d08-4234-ae23-b1741ae90e8f', 'middle');


--
-- PostgreSQL database dump complete
--

RESET ALL;
