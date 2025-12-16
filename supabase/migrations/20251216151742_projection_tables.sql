create table "public"."projection" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "description" text,
    "created_at" timestamp(6) with time zone not null default now(),
    "created_by" uuid not null,
    "is_active" boolean not null default true
);

create table "public"."projection_allocation" (
    "id" uuid not null default gen_random_uuid(),
    "projection_id" uuid not null,
    "user_id" uuid not null,
    "work_item_id" uuid,
    "start_date" date not null,
    "end_date" date,
    "percentage" smallint not null,
    "created_at" timestamp(6) with time zone not null default now()
);

CREATE UNIQUE INDEX projection_pkey ON public.projection USING btree (id);

CREATE UNIQUE INDEX projection_allocation_pkey ON public.projection_allocation USING btree (id);

alter table "public"."projection" add constraint "projection_pkey" PRIMARY KEY using index "projection_pkey";

alter table "public"."projection_allocation" add constraint "projection_allocation_pkey" PRIMARY KEY using index "projection_allocation_pkey";

alter table "public"."projection" add constraint "projection_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "user"(id) not valid;

alter table "public"."projection" validate constraint "projection_created_by_fkey";

alter table "public"."projection_allocation" add constraint "projection_allocation_projection_id_fkey" FOREIGN KEY (projection_id) REFERENCES projection(id) ON DELETE CASCADE not valid;

alter table "public"."projection_allocation" validate constraint "projection_allocation_projection_id_fkey";

alter table "public"."projection_allocation" add constraint "projection_allocation_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."projection_allocation" validate constraint "projection_allocation_user_id_fkey";

alter table "public"."projection_allocation" add constraint "projection_allocation_work_item_id_fkey" FOREIGN KEY (work_item_id) REFERENCES work_items(id) ON DELETE SET NULL not valid;

alter table "public"."projection_allocation" validate constraint "projection_allocation_work_item_id_fkey";

alter table "public"."projection_allocation" add constraint "projection_allocation_percentage_check" CHECK (percentage >= 0 AND percentage <= 100);

