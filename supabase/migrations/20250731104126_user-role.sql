create type "public"."Permissions" as enum ('CAN_CREATE_CLIENT', 'CAN_EDIT_CLIENT', 'CAN_CREATE_WORK_ITEM', 'CAN_EDIT_WORK_ITEM', 'CAN_EDIT_WORKING_DAY', 'CAN_APPROVE_PERMIT', 'CAN_CREATE_PROJECT', 'CAN_EDIT_PROJECT', 'CAN_SEE_OTHERS_TIMESHEET', 'CAN_ALLOCATE_RESOURCE', 'CAN_CREATE_USER', 'CAN_EDIT_USER', 'CAN_SEE_CLIENT', 'CAN_SEE_WORK_ITEM');

drop policy "Enable insert for authenticated users only" on "public"."user";

drop policy "Enable read access for all users" on "public"."user";

alter table "public"."timesheet" drop constraint "timesheet_project_id_fkey";

create table "public"."permission" (
    "id" "Permissions" not null,
    "created_at" timestamp with time zone not null default now(),
    "deactivated" boolean not null default false
);


alter table "public"."permission" enable row level security;

create table "public"."role" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text
);


alter table "public"."role" enable row level security;

create table "public"."user_permission" (
    "user_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "permission_id" "Permissions" not null
);


alter table "public"."user_permission" enable row level security;

create table "public"."user_roles" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "role_id" uuid not null
);


alter table "public"."user_roles" enable row level security;

alter table "public"."allocation" enable row level security;

alter table "public"."chat_session" enable row level security;

alter table "public"."client" enable row level security;

alter table "public"."contract" enable row level security;

alter table "public"."development_plan" enable row level security;

alter table "public"."goal" enable row level security;

alter table "public"."message" enable row level security;

alter table "public"."permit" enable row level security;

alter table "public"."project" enable row level security;

alter table "public"."skill" enable row level security;

alter table "public"."timesheet" drop column "project_id";

alter table "public"."timesheet" add column "work_item_id" uuid not null;

alter table "public"."timesheet" enable row level security;

alter table "public"."todo_item" enable row level security;

alter table "public"."user" enable row level security;

alter table "public"."user_skill" enable row level security;

alter table "public"."work_item_enabled_users" enable row level security;

alter table "public"."work_items" enable row level security;

CREATE UNIQUE INDEX permission_pkey ON public.permission USING btree (id);

CREATE UNIQUE INDEX role_pkey ON public.role USING btree (id);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX user_permission_pkey ON public.user_permission USING btree (user_id, permission_id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_id, role_id);

alter table "public"."permission" add constraint "permission_pkey" PRIMARY KEY using index "permission_pkey";

alter table "public"."role" add constraint "role_pkey" PRIMARY KEY using index "role_pkey";

alter table "public"."user_permission" add constraint "user_permission_pkey" PRIMARY KEY using index "user_permission_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."timesheet" add constraint "timesheet_work_item_id_fkey" FOREIGN KEY (work_item_id) REFERENCES work_items(id) not valid;

alter table "public"."timesheet" validate constraint "timesheet_work_item_id_fkey";

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";

alter table "public"."user_permission" add constraint "user_permission_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) not valid;

alter table "public"."user_permission" validate constraint "user_permission_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES role(id) not valid;

alter table "public"."user_roles" validate constraint "user_roles_role_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

grant delete on table "public"."permission" to "anon";

grant insert on table "public"."permission" to "anon";

grant references on table "public"."permission" to "anon";

grant select on table "public"."permission" to "anon";

grant trigger on table "public"."permission" to "anon";

grant truncate on table "public"."permission" to "anon";

grant update on table "public"."permission" to "anon";

grant delete on table "public"."permission" to "authenticated";

grant insert on table "public"."permission" to "authenticated";

grant references on table "public"."permission" to "authenticated";

grant select on table "public"."permission" to "authenticated";

grant trigger on table "public"."permission" to "authenticated";

grant truncate on table "public"."permission" to "authenticated";

grant update on table "public"."permission" to "authenticated";

grant delete on table "public"."permission" to "service_role";

grant insert on table "public"."permission" to "service_role";

grant references on table "public"."permission" to "service_role";

grant select on table "public"."permission" to "service_role";

grant trigger on table "public"."permission" to "service_role";

grant truncate on table "public"."permission" to "service_role";

grant update on table "public"."permission" to "service_role";

grant delete on table "public"."role" to "anon";

grant insert on table "public"."role" to "anon";

grant references on table "public"."role" to "anon";

grant select on table "public"."role" to "anon";

grant trigger on table "public"."role" to "anon";

grant truncate on table "public"."role" to "anon";

grant update on table "public"."role" to "anon";

grant delete on table "public"."role" to "authenticated";

grant insert on table "public"."role" to "authenticated";

grant references on table "public"."role" to "authenticated";

grant select on table "public"."role" to "authenticated";

grant trigger on table "public"."role" to "authenticated";

grant truncate on table "public"."role" to "authenticated";

grant update on table "public"."role" to "authenticated";

grant delete on table "public"."role" to "service_role";

grant insert on table "public"."role" to "service_role";

grant references on table "public"."role" to "service_role";

grant select on table "public"."role" to "service_role";

grant trigger on table "public"."role" to "service_role";

grant truncate on table "public"."role" to "service_role";

grant update on table "public"."role" to "service_role";

grant delete on table "public"."user_permission" to "anon";

grant insert on table "public"."user_permission" to "anon";

grant references on table "public"."user_permission" to "anon";

grant select on table "public"."user_permission" to "anon";

grant trigger on table "public"."user_permission" to "anon";

grant truncate on table "public"."user_permission" to "anon";

grant update on table "public"."user_permission" to "anon";

grant delete on table "public"."user_permission" to "authenticated";

grant insert on table "public"."user_permission" to "authenticated";

grant references on table "public"."user_permission" to "authenticated";

grant select on table "public"."user_permission" to "authenticated";

grant trigger on table "public"."user_permission" to "authenticated";

grant truncate on table "public"."user_permission" to "authenticated";

grant update on table "public"."user_permission" to "authenticated";

grant delete on table "public"."user_permission" to "service_role";

grant insert on table "public"."user_permission" to "service_role";

grant references on table "public"."user_permission" to "service_role";

grant select on table "public"."user_permission" to "service_role";

grant trigger on table "public"."user_permission" to "service_role";

grant truncate on table "public"."user_permission" to "service_role";

grant update on table "public"."user_permission" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

create policy "Enable read access for all users"
on "public"."project"
as permissive
for select
to public
using (false);



