alter table "public"."permit" drop column "end_date";

alter table "public"."permit" rename column "start_date" to "date";
alter table "public"."permit" alter column "date" set data type date using "date"::date;
alter table "public"."permit" alter column "date" set not null;

alter table "public"."user" disable row level security;


