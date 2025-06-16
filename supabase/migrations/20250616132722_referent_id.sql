alter table "public"."user" add column "referent_id" uuid;

alter table "public"."user" add constraint "user_referent_id_fkey" FOREIGN KEY ("referent_id") REFERENCES "user"(id) not valid;

alter table "public"."user" validate constraint "user_referent_id_fkey";


