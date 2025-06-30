create type "public"."contractstatus" as enum ('active', 'not-active');

create type "public"."contracttype" as enum ('permanent', 'fixed-term');

create type "public"."remotepolicy" as enum ('hybrid', 'full-remote', 'on-site');

create type "public"."workinghours" as enum ('full-time', 'part-time');

create table "public"."contract" (
    "id" uuid not null default gen_random_uuid(),
    "employee_id" uuid not null,
    "ral" integer not null,
    "contract_type" contracttype not null,
    "start_date" date not null,
    "end_date" date,
    "working_hours" workinghours not null,
    "remote_policy" remotepolicy not null,
    "notes" text,
    "status" contractstatus not null,
    "contract_visible_to_employee" boolean not null default true,
    "last_modified" timestamp with time zone not null default now(),
    "modified_by" uuid not null
);


CREATE UNIQUE INDEX contract_pkey ON public.contract USING btree (id);

alter table "public"."contract" add constraint "contract_pkey" PRIMARY KEY using index "contract_pkey";

alter table "public"."contract" add constraint "contract_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."contract" validate constraint "contract_employee_id_fkey";

alter table "public"."contract" add constraint "contract_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES "user"(id) ON DELETE SET NULL not valid;

alter table "public"."contract" validate constraint "contract_modified_by_fkey";

grant delete on table "public"."contract" to "anon";

grant insert on table "public"."contract" to "anon";

grant references on table "public"."contract" to "anon";

grant select on table "public"."contract" to "anon";

grant trigger on table "public"."contract" to "anon";

grant truncate on table "public"."contract" to "anon";

grant update on table "public"."contract" to "anon";

grant delete on table "public"."contract" to "authenticated";

grant insert on table "public"."contract" to "authenticated";

grant references on table "public"."contract" to "authenticated";

grant select on table "public"."contract" to "authenticated";

grant trigger on table "public"."contract" to "authenticated";

grant truncate on table "public"."contract" to "authenticated";

grant update on table "public"."contract" to "authenticated";

grant delete on table "public"."contract" to "service_role";

grant insert on table "public"."contract" to "service_role";

grant references on table "public"."contract" to "service_role";

grant select on table "public"."contract" to "service_role";

grant trigger on table "public"."contract" to "service_role";

grant truncate on table "public"."contract" to "service_role";

grant update on table "public"."contract" to "service_role";


