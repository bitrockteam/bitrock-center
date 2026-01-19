create type "public"."Area" as enum ('FRONT_END', 'BACK_END', 'OTHER');

alter table "public"."user" add column "area" public."Area" not null default 'OTHER'::public."Area";


