create type "public"."ProjectStatus" as enum ('ACTIVE', 'PLANNED', 'PAUSED', 'COMPLETED');

create type "public"."Role" as enum ('Super Admin', 'Admin', 'Key Client', 'Manager', 'Employee');

revoke delete on table "public"."role" from "anon";

revoke insert on table "public"."role" from "anon";

revoke references on table "public"."role" from "anon";

revoke select on table "public"."role" from "anon";

revoke trigger on table "public"."role" from "anon";

revoke truncate on table "public"."role" from "anon";

revoke update on table "public"."role" from "anon";

revoke delete on table "public"."role" from "authenticated";

revoke insert on table "public"."role" from "authenticated";

revoke references on table "public"."role" from "authenticated";

revoke select on table "public"."role" from "authenticated";

revoke trigger on table "public"."role" from "authenticated";

revoke truncate on table "public"."role" from "authenticated";

revoke update on table "public"."role" from "authenticated";

revoke delete on table "public"."role" from "service_role";

revoke insert on table "public"."role" from "service_role";

revoke references on table "public"."role" from "service_role";

revoke select on table "public"."role" from "service_role";

revoke trigger on table "public"."role" from "service_role";

revoke truncate on table "public"."role" from "service_role";

revoke update on table "public"."role" from "service_role";

revoke delete on table "public"."status" from "anon";

revoke insert on table "public"."status" from "anon";

revoke references on table "public"."status" from "anon";

revoke select on table "public"."status" from "anon";

revoke trigger on table "public"."status" from "anon";

revoke truncate on table "public"."status" from "anon";

revoke update on table "public"."status" from "anon";

revoke delete on table "public"."status" from "authenticated";

revoke insert on table "public"."status" from "authenticated";

revoke references on table "public"."status" from "authenticated";

revoke select on table "public"."status" from "authenticated";

revoke trigger on table "public"."status" from "authenticated";

revoke truncate on table "public"."status" from "authenticated";

revoke update on table "public"."status" from "authenticated";

revoke delete on table "public"."status" from "service_role";

revoke insert on table "public"."status" from "service_role";

revoke references on table "public"."status" from "service_role";

revoke select on table "public"."status" from "service_role";

revoke trigger on table "public"."status" from "service_role";

revoke truncate on table "public"."status" from "service_role";

revoke update on table "public"."status" from "service_role";

alter table "public"."project" drop constraint "project_status_id_fkey";

alter table "public"."user" drop constraint "user_role_id_fkey";

alter table "public"."role" drop constraint "role_pkey";

alter table "public"."status" drop constraint "status_pkey";

drop index if exists "public"."role_pkey";

drop index if exists "public"."status_pkey";

drop table "public"."role";

drop table "public"."status";

alter table "public"."project" drop column "status_id";

alter table "public"."project" add column "status" "ProjectStatus" not null default 'PLANNED'::"ProjectStatus";

alter table "public"."user" drop column "role_id";

alter table "public"."user" add column "role" "Role" not null default 'Employee'::"Role";


