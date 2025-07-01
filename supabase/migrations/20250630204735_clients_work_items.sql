create type "public"."ClientStatus" as enum ('active', 'inactive');

create type "public"."work_item_status" as enum ('active', 'completed', 'on-hold');

create type "public"."work_item_type" as enum ('time-material', 'fixed-price');

alter table "public"."allocation" drop constraint "allocation_project_id_fkey";

alter table "public"."timesheet" drop constraint "timesheet_project_id_fkey";

create table "public"."client" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "code" character varying not null,
    "email" character varying not null,
    "phone" character varying,
    "address" character varying,
    "vat_number" character varying,
    "contact_person" character varying,
    "status" "ClientStatus" not null default 'active'::"ClientStatus",
    "created_at" timestamp(6) with time zone not null default now(),
    "notes" text
);


create table "public"."work_item_enabled_users" (
    "work_item_id" uuid not null,
    "user_id" uuid not null
);


create table "public"."work_items" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying not null,
    "client_id" uuid not null,
    "project_id" uuid,
    "type" work_item_type not null,
    "start_date" date not null,
    "end_date" date,
    "status" work_item_status not null default 'active'::work_item_status,
    "description" text,
    "hourly_rate" integer,
    "estimated_hours" integer,
    "fixed_price" integer,
    "created_at" timestamp with time zone default now()
);


alter table "public"."project" drop column "client";

alter table "public"."project" add column "client_id" uuid not null;

CREATE UNIQUE INDEX client_pkey ON public.client USING btree (id);

CREATE UNIQUE INDEX idx_client_code ON public.client USING btree (code);

CREATE INDEX idx_client_name ON public.client USING btree (name);

CREATE UNIQUE INDEX work_item_enabled_users_pkey ON public.work_item_enabled_users USING btree (work_item_id, user_id);

CREATE UNIQUE INDEX work_items_pkey ON public.work_items USING btree (id);

alter table "public"."client" add constraint "client_pkey" PRIMARY KEY using index "client_pkey";

alter table "public"."work_item_enabled_users" add constraint "work_item_enabled_users_pkey" PRIMARY KEY using index "work_item_enabled_users_pkey";

alter table "public"."work_items" add constraint "work_items_pkey" PRIMARY KEY using index "work_items_pkey";

alter table "public"."project" add constraint "fk_project_client" FOREIGN KEY (client_id) REFERENCES client(id) not valid;

alter table "public"."project" validate constraint "fk_project_client";

alter table "public"."work_item_enabled_users" add constraint "work_item_enabled_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."work_item_enabled_users" validate constraint "work_item_enabled_users_user_id_fkey";

alter table "public"."work_item_enabled_users" add constraint "work_item_enabled_users_work_item_id_fkey" FOREIGN KEY (work_item_id) REFERENCES work_items(id) ON DELETE CASCADE not valid;

alter table "public"."work_item_enabled_users" validate constraint "work_item_enabled_users_work_item_id_fkey";

alter table "public"."work_items" add constraint "check_time_material_fields" CHECK ((((type = 'time-material'::work_item_type) AND (hourly_rate IS NOT NULL) AND (estimated_hours IS NOT NULL) AND (fixed_price IS NULL)) OR ((type = 'fixed-price'::work_item_type) AND (fixed_price IS NOT NULL) AND (hourly_rate IS NULL) AND (estimated_hours IS NULL)))) not valid;

alter table "public"."work_items" validate constraint "check_time_material_fields";

alter table "public"."work_items" add constraint "fk_work_items_client" FOREIGN KEY (client_id) REFERENCES client(id) not valid;

alter table "public"."work_items" validate constraint "fk_work_items_client";

alter table "public"."work_items" add constraint "work_items_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) not valid;

alter table "public"."work_items" validate constraint "work_items_project_id_fkey";

alter table "public"."allocation" add constraint "allocation_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE not valid;

alter table "public"."allocation" validate constraint "allocation_project_id_fkey";

alter table "public"."timesheet" add constraint "timesheet_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE not valid;

alter table "public"."timesheet" validate constraint "timesheet_project_id_fkey";

grant delete on table "public"."client" to "anon";

grant insert on table "public"."client" to "anon";

grant references on table "public"."client" to "anon";

grant select on table "public"."client" to "anon";

grant trigger on table "public"."client" to "anon";

grant truncate on table "public"."client" to "anon";

grant update on table "public"."client" to "anon";

grant delete on table "public"."client" to "authenticated";

grant insert on table "public"."client" to "authenticated";

grant references on table "public"."client" to "authenticated";

grant select on table "public"."client" to "authenticated";

grant trigger on table "public"."client" to "authenticated";

grant truncate on table "public"."client" to "authenticated";

grant update on table "public"."client" to "authenticated";

grant delete on table "public"."client" to "service_role";

grant insert on table "public"."client" to "service_role";

grant references on table "public"."client" to "service_role";

grant select on table "public"."client" to "service_role";

grant trigger on table "public"."client" to "service_role";

grant truncate on table "public"."client" to "service_role";

grant update on table "public"."client" to "service_role";

grant delete on table "public"."work_item_enabled_users" to "anon";

grant insert on table "public"."work_item_enabled_users" to "anon";

grant references on table "public"."work_item_enabled_users" to "anon";

grant select on table "public"."work_item_enabled_users" to "anon";

grant trigger on table "public"."work_item_enabled_users" to "anon";

grant truncate on table "public"."work_item_enabled_users" to "anon";

grant update on table "public"."work_item_enabled_users" to "anon";

grant delete on table "public"."work_item_enabled_users" to "authenticated";

grant insert on table "public"."work_item_enabled_users" to "authenticated";

grant references on table "public"."work_item_enabled_users" to "authenticated";

grant select on table "public"."work_item_enabled_users" to "authenticated";

grant trigger on table "public"."work_item_enabled_users" to "authenticated";

grant truncate on table "public"."work_item_enabled_users" to "authenticated";

grant update on table "public"."work_item_enabled_users" to "authenticated";

grant delete on table "public"."work_item_enabled_users" to "service_role";

grant insert on table "public"."work_item_enabled_users" to "service_role";

grant references on table "public"."work_item_enabled_users" to "service_role";

grant select on table "public"."work_item_enabled_users" to "service_role";

grant trigger on table "public"."work_item_enabled_users" to "service_role";

grant truncate on table "public"."work_item_enabled_users" to "service_role";

grant update on table "public"."work_item_enabled_users" to "service_role";

grant delete on table "public"."work_items" to "anon";

grant insert on table "public"."work_items" to "anon";

grant references on table "public"."work_items" to "anon";

grant select on table "public"."work_items" to "anon";

grant trigger on table "public"."work_items" to "anon";

grant truncate on table "public"."work_items" to "anon";

grant update on table "public"."work_items" to "anon";

grant delete on table "public"."work_items" to "authenticated";

grant insert on table "public"."work_items" to "authenticated";

grant references on table "public"."work_items" to "authenticated";

grant select on table "public"."work_items" to "authenticated";

grant trigger on table "public"."work_items" to "authenticated";

grant truncate on table "public"."work_items" to "authenticated";

grant update on table "public"."work_items" to "authenticated";

grant delete on table "public"."work_items" to "service_role";

grant insert on table "public"."work_items" to "service_role";

grant references on table "public"."work_items" to "service_role";

grant select on table "public"."work_items" to "service_role";

grant trigger on table "public"."work_items" to "service_role";

grant truncate on table "public"."work_items" to "service_role";

grant update on table "public"."work_items" to "service_role";


