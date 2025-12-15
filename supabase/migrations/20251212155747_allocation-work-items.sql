drop policy "Enable delete for authenticated users on own sessions" on "public"."chat_session";

drop policy "Enable insert for authenticated users" on "public"."chat_session";

drop policy "Enable select for authenticated users on own sessions" on "public"."chat_session";

drop policy "Enable update for authenticated users on own sessions" on "public"."chat_session";

drop policy "Enable delete for authenticated users on own sessions" on "public"."message";

drop policy "Enable insert for authenticated users on own sessions" on "public"."message";

drop policy "Enable select for authenticated users on own sessions" on "public"."message";

drop policy "Enable update for authenticated users on own sessions" on "public"."message";

revoke delete on table "public"."work_item_enabled_users" from "anon";

revoke insert on table "public"."work_item_enabled_users" from "anon";

revoke references on table "public"."work_item_enabled_users" from "anon";

revoke select on table "public"."work_item_enabled_users" from "anon";

revoke trigger on table "public"."work_item_enabled_users" from "anon";

revoke truncate on table "public"."work_item_enabled_users" from "anon";

revoke update on table "public"."work_item_enabled_users" from "anon";

revoke delete on table "public"."work_item_enabled_users" from "authenticated";

revoke insert on table "public"."work_item_enabled_users" from "authenticated";

revoke references on table "public"."work_item_enabled_users" from "authenticated";

revoke select on table "public"."work_item_enabled_users" from "authenticated";

revoke trigger on table "public"."work_item_enabled_users" from "authenticated";

revoke truncate on table "public"."work_item_enabled_users" from "authenticated";

revoke update on table "public"."work_item_enabled_users" from "authenticated";

revoke delete on table "public"."work_item_enabled_users" from "service_role";

revoke insert on table "public"."work_item_enabled_users" from "service_role";

revoke references on table "public"."work_item_enabled_users" from "service_role";

revoke select on table "public"."work_item_enabled_users" from "service_role";

revoke trigger on table "public"."work_item_enabled_users" from "service_role";

revoke truncate on table "public"."work_item_enabled_users" from "service_role";

revoke update on table "public"."work_item_enabled_users" from "service_role";

alter table "public"."allocation" drop constraint "allocation_project_id_fkey";

alter table "public"."work_item_enabled_users" drop constraint "work_item_enabled_users_user_id_fkey";

alter table "public"."work_item_enabled_users" drop constraint "work_item_enabled_users_work_item_id_fkey";

drop function if exists "public"."get_current_user_id"();

alter table "public"."work_item_enabled_users" drop constraint "work_item_enabled_users_pkey";

alter table "public"."allocation" drop constraint "allocation_pkey";

drop index if exists "public"."work_item_enabled_users_pkey";

drop index if exists "public"."allocation_pkey";

drop table "public"."work_item_enabled_users";

alter table "public"."allocation" drop column "project_id";

alter table "public"."allocation" add column "work_item_id" uuid not null;

CREATE UNIQUE INDEX allocation_pkey ON public.allocation USING btree (user_id, work_item_id);

alter table "public"."allocation" add constraint "allocation_pkey" PRIMARY KEY using index "allocation_pkey";

alter table "public"."allocation" add constraint "allocation_work_item_id_fkey" FOREIGN KEY (work_item_id) REFERENCES work_items(id) not valid;

alter table "public"."allocation" validate constraint "allocation_work_item_id_fkey";


